import type { ClientSession } from "mongoose";
import type { Types } from "mongoose";
import type { CategoryRepository } from "../repositories/category.repository.js";
import type { SpecSchemaRepository } from "../repositories/spec-schema.repository.js";
import type { ExecOpts } from "../repositories/exec-opts.js";
import { withTransaction } from "../db/with-transaction.js";
import {
  cannotMoveUnderDescendant,
  cannotMoveUnderSelf,
  categoryHasChildren,
  familyRequiredForSpec,
  pathTaken,
  reorderMismatch,
  resourceNotFound,
  slugTaken,
  specSchemaWrongCategory,
} from "../errors/domain.js";
import { NotFoundError } from "../errors/app-error.js";
import { toObjectId } from "../utils/mongo.js";
import type { WriteContext } from "../types/write-context.js";
import { invalidateCatalogCache } from "../utils/cache.js";
import { adminCacheAside } from "../utils/admin-cache.js";

type CategoryDoc = Awaited<ReturnType<CategoryRepository["listChildren"]>>[number];

function eo(ctx?: WriteContext, session?: ClientSession): ExecOpts {
  return { actorId: ctx?.actorUserId ?? undefined, session };
}

function buildPath(parentPath: string | null | undefined, slug: string): string {
  if (!parentPath) return slug;
  return `${parentPath}/${slug}`;
}

export class CategoryService {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly specSchemas: SpecSchemaRepository,
  ) {}

  async getById(id: string, ctx?: WriteContext) {
    return adminCacheAside({
      scope: "category",
      key: `by-id:${id}`,
      ttlSeconds: 120,
      staleWhileRevalidateSeconds: 30,
      loader: async () => {
        const doc = await this.categories.findById(toObjectId(id), eo(ctx));
        if (!doc) throw resourceNotFound("CatalogCategory", id);
        return doc;
      },
    });
  }

  async listChildren(parentId: string | null, ctx?: WriteContext, filters?: { status?: string }) {
    const cacheParentId = parentId ?? "root";
    const cacheStatus = filters?.status ?? "any";
    return adminCacheAside({
      scope: "taxonomy",
      key: `children:${cacheParentId}:${cacheStatus}`,
      ttlSeconds: 120,
      staleWhileRevalidateSeconds: 30,
      loader: async () => {
        const pid = parentId ? toObjectId(parentId) : null;
        return this.categories.listChildren(pid, "sortOrder", { ...eo(ctx), status: filters?.status });
      },
    });
  }

  /** Recursive tree for admin (nested children). */
  async getTree(ctx?: WriteContext): Promise<unknown[]> {
    return adminCacheAside({
      scope: "taxonomy",
      key: "tree:admin",
      ttlSeconds: 120,
      staleWhileRevalidateSeconds: 30,
      loader: async () => {
        const roots = await this.categories.listChildren(null, "sortOrder", eo(ctx));
        const build = async (parentId: Types.ObjectId | null): Promise<unknown[]> => {
          const kids = await this.categories.listChildren(parentId, "sortOrder", eo(ctx));
          return Promise.all(
            kids.map(async (n: CategoryDoc) => ({
              ...n.toObject(),
              children: await build(n._id),
            })),
          );
        };
        return Promise.all(
          roots.map(async (n: CategoryDoc) => ({
            ...n.toObject(),
            children: await build(n._id),
          })),
        );
      },
    });
  }

  async create(
    input: {
      parentId?: string | null;
      slug: string;
      title: string;
      description?: string;
      landingImage?: {
        url: string;
        publicId?: string;
        alt?: string;
        width?: number;
        height?: number;
        format?: string;
      };
      kind: "branch" | "family";
      status?: string;
      sortOrder?: number;
    },
    ctx?: WriteContext,
  ) {
    const parentId = input.parentId ? toObjectId(input.parentId) : null;
    let parentPath: string | null = null;
    if (parentId) {
      const parent = await this.categories.findById(parentId, eo(ctx));
      if (!parent) throw resourceNotFound("CatalogCategory", input.parentId ?? undefined);
      parentPath = parent.path as string;
    }
    const path = buildPath(parentPath, input.slug);
    const exists = await this.categories.slugExistsAmongSiblings(parentId, input.slug, undefined, eo(ctx));
    if (exists) throw slugTaken(input.slug, "category");

    const pathTakenDoc = await this.categories.findByPath(path, eo(ctx));
    if (pathTakenDoc) throw pathTaken(path);

    const created = await this.categories.create(
      {
        parentId,
        path,
        slug: input.slug,
        title: input.title,
        description: input.description ?? "",
        landingImage: input.landingImage,
        kind: input.kind,
        status: input.status,
        sortOrder: input.sortOrder,
      },
      eo(ctx),
    );
    await invalidateCatalogCache(["taxonomy", "category", "search", "homepage", "navigation"]);
    return created;
  }

  async update(
    id: string,
    patch: {
      slug?: string;
      title?: string;
      description?: string;
      landingImage?:
        | {
            url: string;
            publicId?: string;
            alt?: string;
            width?: number;
            height?: number;
            format?: string;
          }
        | null;
      kind?: "branch" | "family";
      status?: string;
      sortOrder?: number;
    },
    ctx?: WriteContext,
  ) {
    const oid = toObjectId(id);
    const node = await this.categories.findById(oid, eo(ctx));
    if (!node) throw resourceNotFound("CatalogCategory", id);

    let newPath = node.path as string;
    if (patch.slug && patch.slug !== node.slug) {
      const parentId = node.parentId as Types.ObjectId | null;
      let parentPath: string | null = null;
      if (parentId) {
        const parent = await this.categories.findById(parentId, eo(ctx));
        if (!parent) throw new NotFoundError("CatalogCategory", parentId.toString());
        parentPath = parent.path as string;
      }
      newPath = buildPath(parentPath, patch.slug);
      const sibling = await this.categories.slugExistsAmongSiblings(parentId, patch.slug, oid, eo(ctx));
      if (sibling) throw slugTaken(patch.slug, "category");
      const pathTakenDoc = await this.categories.findByPath(newPath, eo(ctx));
      if (pathTakenDoc && !pathTakenDoc._id.equals(oid)) {
        throw pathTaken(newPath);
      }
    }

    const oldPath = node.path as string;
    const needsSubtreeRewrite = Boolean(patch.slug && newPath !== oldPath);

    if (needsSubtreeRewrite) {
      const updated = await withTransaction(async (session) => {
        const opt = eo(ctx, session);
        const result = await this.categories.updateById(
          oid,
          {
            ...patch,
            path: newPath,
            ...(patch.status === "published" ? { publishedAt: new Date() } : {}),
          },
          opt,
        );
        await this.categories.rewriteSubtreePaths(oldPath, newPath, opt);
        return result;
      });
      await invalidateCatalogCache(["taxonomy", "category", "search", "homepage", "navigation"]);
      return updated;
    }

    const updated = await this.categories.updateById(
      oid,
      {
        ...patch,
        ...(patch.status === "published" ? { publishedAt: new Date() } : {}),
      },
      eo(ctx),
    );
    await invalidateCatalogCache(["taxonomy", "category", "search", "homepage", "navigation"]);
    return updated;
  }

  async move(categoryId: string, newParentId: string | null, ctx?: WriteContext) {
    const oid = toObjectId(categoryId);
    const updated = await withTransaction(async (session) => {
      const opt = eo(ctx, session);
      const node = await this.categories.findById(oid, opt);
      if (!node) throw resourceNotFound("CatalogCategory", categoryId);

      const oldPath = node.path as string;
      const newPid = newParentId ? toObjectId(newParentId) : null;

      if (newPid && newPid.equals(oid)) {
        throw cannotMoveUnderSelf();
      }

      let newPath: string;
      if (newPid) {
        const parent = await this.categories.findById(newPid, opt);
        if (!parent) throw resourceNotFound("CatalogCategory", newParentId ?? undefined);
        const parentPath = parent.path as string;
        if (parentPath === oldPath || parentPath.startsWith(`${oldPath}/`)) {
          throw cannotMoveUnderDescendant();
        }
        newPath = buildPath(parentPath, node.slug as string);
      } else {
        newPath = node.slug as string;
      }

      const taken = await this.categories.findByPath(newPath, opt);
      if (taken && !taken._id.equals(oid)) {
        throw pathTaken(newPath);
      }

      await this.categories.rewriteSubtreePaths(oldPath, newPath, opt);
      return this.categories.updateById(oid, { parentId: newPid }, opt);
    });
    await invalidateCatalogCache(["taxonomy", "category", "search", "homepage", "navigation"]);
    return updated;
  }

  async reorderSiblings(categoryId: string, orderedIds: string[], ctx?: WriteContext) {
    const reordered = await withTransaction(async (session) => {
      const opt = eo(ctx, session);
      const anchor = await this.categories.findById(toObjectId(categoryId), opt);
      if (!anchor) throw resourceNotFound("CatalogCategory", categoryId);
      const parentId = anchor.parentId as Types.ObjectId | null;

      const oids = orderedIds.map((x) => toObjectId(x));
      const siblings = await this.categories.listChildren(parentId, "sortOrder", opt);
      const sibSet = new Set(siblings.map((s: CategoryDoc) => s._id.toString()));
      if (oids.length !== siblings.length || !oids.every((id) => sibSet.has(id.toString()))) {
        throw reorderMismatch();
      }

      await this.categories.setSortOrders(
        oids.map((id, i) => ({ id, sortOrder: i })),
        opt,
      );
      return this.categories.listChildren(parentId, "sortOrder", opt);
    });
    await invalidateCatalogCache(["taxonomy", "category", "search", "homepage", "navigation"]);
    return reordered;
  }

  async setKind(id: string, kind: "branch" | "family", ctx?: WriteContext) {
    const doc = await this.categories.updateById(toObjectId(id), { kind }, eo(ctx));
    if (!doc) throw resourceNotFound("CatalogCategory", id);
    await invalidateCatalogCache(["taxonomy", "category", "search", "homepage", "navigation"]);
    return doc;
  }

  async attachActiveSpecSchema(categoryId: string, specSchemaId: string, ctx?: WriteContext) {
    const cat = await this.categories.findById(toObjectId(categoryId), eo(ctx));
    if (!cat) throw resourceNotFound("CatalogCategory", categoryId);
    if (cat.kind !== "family") {
      throw familyRequiredForSpec();
    }
    const spec = await this.specSchemas.findById(toObjectId(specSchemaId), eo(ctx));
    if (!spec) throw resourceNotFound("CatalogSpecSchema", specSchemaId);
    if (!(spec.taxonomyNodeId as Types.ObjectId).equals(cat._id)) {
      throw specSchemaWrongCategory();
    }
    const updated = await this.categories.updateById(
      toObjectId(categoryId),
      {
        activeSpecSchemaId: toObjectId(specSchemaId),
      },
      eo(ctx),
    );
    await invalidateCatalogCache(["taxonomy", "category", "search", "homepage", "navigation"]);
    return updated;
  }

  async delete(id: string, ctx?: WriteContext) {
    const oid = toObjectId(id);
    const node = await this.categories.findById(oid, eo(ctx));
    if (!node) throw resourceNotFound("CatalogCategory", id);
    const children = await this.categories.countDirectChildren(oid, eo(ctx));
    if (children > 0) {
      throw categoryHasChildren();
    }
    const deleted = await this.categories.deleteById(oid, eo(ctx));
    await invalidateCatalogCache(["taxonomy", "category", "search", "homepage", "navigation"]);
    return deleted;
  }
}
