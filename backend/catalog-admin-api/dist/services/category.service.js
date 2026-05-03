import { withTransaction } from "../db/with-transaction.js";
import { cannotMoveUnderDescendant, cannotMoveUnderSelf, categoryHasChildren, familyRequiredForSpec, pathTaken, reorderMismatch, resourceNotFound, slugTaken, specSchemaWrongCategory, } from "../errors/domain.js";
import { NotFoundError } from "../errors/app-error.js";
import { toObjectId } from "../utils/mongo.js";
function eo(ctx, session) {
    return { actorId: ctx?.actorUserId ?? undefined, session };
}
function buildPath(parentPath, slug) {
    if (!parentPath)
        return slug;
    return `${parentPath}/${slug}`;
}
export class CategoryService {
    categories;
    specSchemas;
    constructor(categories, specSchemas) {
        this.categories = categories;
        this.specSchemas = specSchemas;
    }
    async getById(id, ctx) {
        const doc = await this.categories.findById(toObjectId(id), eo(ctx));
        if (!doc)
            throw resourceNotFound("CatalogCategory", id);
        return doc;
    }
    async listChildren(parentId, ctx, filters) {
        const pid = parentId ? toObjectId(parentId) : null;
        return this.categories.listChildren(pid, "sortOrder", { ...eo(ctx), status: filters?.status });
    }
    /** Recursive tree for admin (nested children). */
    async getTree(ctx) {
        const roots = await this.categories.listChildren(null, "sortOrder", eo(ctx));
        const build = async (parentId) => {
            const kids = await this.categories.listChildren(parentId, "sortOrder", eo(ctx));
            return Promise.all(kids.map(async (n) => ({
                ...n.toObject(),
                children: await build(n._id),
            })));
        };
        return Promise.all(roots.map(async (n) => ({
            ...n.toObject(),
            children: await build(n._id),
        })));
    }
    async create(input, ctx) {
        const parentId = input.parentId ? toObjectId(input.parentId) : null;
        let parentPath = null;
        if (parentId) {
            const parent = await this.categories.findById(parentId, eo(ctx));
            if (!parent)
                throw resourceNotFound("CatalogCategory", input.parentId ?? undefined);
            parentPath = parent.path;
        }
        const path = buildPath(parentPath, input.slug);
        const exists = await this.categories.slugExistsAmongSiblings(parentId, input.slug, undefined, eo(ctx));
        if (exists)
            throw slugTaken(input.slug, "category");
        const pathTakenDoc = await this.categories.findByPath(path, eo(ctx));
        if (pathTakenDoc)
            throw pathTaken(path);
        return this.categories.create({
            parentId,
            path,
            slug: input.slug,
            title: input.title,
            description: input.description ?? "",
            kind: input.kind,
            status: input.status,
            sortOrder: input.sortOrder,
        }, eo(ctx));
    }
    async update(id, patch, ctx) {
        const oid = toObjectId(id);
        const node = await this.categories.findById(oid, eo(ctx));
        if (!node)
            throw resourceNotFound("CatalogCategory", id);
        let newPath = node.path;
        if (patch.slug && patch.slug !== node.slug) {
            const parentId = node.parentId;
            let parentPath = null;
            if (parentId) {
                const parent = await this.categories.findById(parentId, eo(ctx));
                if (!parent)
                    throw new NotFoundError("CatalogCategory", parentId.toString());
                parentPath = parent.path;
            }
            newPath = buildPath(parentPath, patch.slug);
            const sibling = await this.categories.slugExistsAmongSiblings(parentId, patch.slug, oid, eo(ctx));
            if (sibling)
                throw slugTaken(patch.slug, "category");
            const pathTakenDoc = await this.categories.findByPath(newPath, eo(ctx));
            if (pathTakenDoc && !pathTakenDoc._id.equals(oid)) {
                throw pathTaken(newPath);
            }
        }
        const oldPath = node.path;
        const needsSubtreeRewrite = Boolean(patch.slug && newPath !== oldPath);
        if (needsSubtreeRewrite) {
            return withTransaction(async (session) => {
                const opt = eo(ctx, session);
                const updated = await this.categories.updateById(oid, {
                    ...patch,
                    path: newPath,
                    ...(patch.status === "published" ? { publishedAt: new Date() } : {}),
                }, opt);
                await this.categories.rewriteSubtreePaths(oldPath, newPath, opt);
                return updated;
            });
        }
        return this.categories.updateById(oid, {
            ...patch,
            ...(patch.status === "published" ? { publishedAt: new Date() } : {}),
        }, eo(ctx));
    }
    async move(categoryId, newParentId, ctx) {
        const oid = toObjectId(categoryId);
        return withTransaction(async (session) => {
            const opt = eo(ctx, session);
            const node = await this.categories.findById(oid, opt);
            if (!node)
                throw resourceNotFound("CatalogCategory", categoryId);
            const oldPath = node.path;
            const newPid = newParentId ? toObjectId(newParentId) : null;
            if (newPid && newPid.equals(oid)) {
                throw cannotMoveUnderSelf();
            }
            let newPath;
            if (newPid) {
                const parent = await this.categories.findById(newPid, opt);
                if (!parent)
                    throw resourceNotFound("CatalogCategory", newParentId ?? undefined);
                const parentPath = parent.path;
                if (parentPath === oldPath || parentPath.startsWith(`${oldPath}/`)) {
                    throw cannotMoveUnderDescendant();
                }
                newPath = buildPath(parentPath, node.slug);
            }
            else {
                newPath = node.slug;
            }
            const taken = await this.categories.findByPath(newPath, opt);
            if (taken && !taken._id.equals(oid)) {
                throw pathTaken(newPath);
            }
            await this.categories.rewriteSubtreePaths(oldPath, newPath, opt);
            return this.categories.updateById(oid, { parentId: newPid }, opt);
        });
    }
    async reorderSiblings(categoryId, orderedIds, ctx) {
        return withTransaction(async (session) => {
            const opt = eo(ctx, session);
            const anchor = await this.categories.findById(toObjectId(categoryId), opt);
            if (!anchor)
                throw resourceNotFound("CatalogCategory", categoryId);
            const parentId = anchor.parentId;
            const oids = orderedIds.map((x) => toObjectId(x));
            const siblings = await this.categories.listChildren(parentId, "sortOrder", opt);
            const sibSet = new Set(siblings.map((s) => s._id.toString()));
            if (oids.length !== siblings.length || !oids.every((id) => sibSet.has(id.toString()))) {
                throw reorderMismatch();
            }
            await this.categories.setSortOrders(oids.map((id, i) => ({ id, sortOrder: i })), opt);
            return this.categories.listChildren(parentId, "sortOrder", opt);
        });
    }
    async setKind(id, kind, ctx) {
        const doc = await this.categories.updateById(toObjectId(id), { kind }, eo(ctx));
        if (!doc)
            throw resourceNotFound("CatalogCategory", id);
        return doc;
    }
    async attachActiveSpecSchema(categoryId, specSchemaId, ctx) {
        const cat = await this.categories.findById(toObjectId(categoryId), eo(ctx));
        if (!cat)
            throw resourceNotFound("CatalogCategory", categoryId);
        if (cat.kind !== "family") {
            throw familyRequiredForSpec();
        }
        const spec = await this.specSchemas.findById(toObjectId(specSchemaId), eo(ctx));
        if (!spec)
            throw resourceNotFound("CatalogSpecSchema", specSchemaId);
        if (!spec.taxonomyNodeId.equals(cat._id)) {
            throw specSchemaWrongCategory();
        }
        return this.categories.updateById(toObjectId(categoryId), {
            activeSpecSchemaId: toObjectId(specSchemaId),
        }, eo(ctx));
    }
    async delete(id, ctx) {
        const oid = toObjectId(id);
        const node = await this.categories.findById(oid, eo(ctx));
        if (!node)
            throw resourceNotFound("CatalogCategory", id);
        const children = await this.categories.countDirectChildren(oid, eo(ctx));
        if (children > 0) {
            throw categoryHasChildren();
        }
        return this.categories.deleteById(oid, eo(ctx));
    }
}
