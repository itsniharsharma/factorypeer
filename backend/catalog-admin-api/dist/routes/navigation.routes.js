import { writeContext } from "../http/write-context.js";
import { parseBody, parseParams, parseQuery } from "../validation/helpers.js";
import { createFooterContentBodySchema, createLinkGroupBodySchema, footerContentListQuerySchema, navigationContentIdParamsSchema, navigationListQuerySchema, updateFooterContentBodySchema, updateLinkGroupBodySchema, } from "../validation/navigation.js";
const PREFIX = "/admin/catalog/navigation";
export async function registerNavigationRoutes(app, services) {
    const { navigation } = services;
    app.get(`${PREFIX}/link-groups`, async (req) => {
        const q = parseQuery(navigationListQuerySchema, req.query);
        return navigation.listLinkGroups(writeContext(req), q.placement, q.status);
    });
    app.get(`${PREFIX}/link-groups/:id`, async (req) => {
        const { id } = parseParams(navigationContentIdParamsSchema, req.params);
        return navigation.getLinkGroup(id, writeContext(req));
    });
    app.post(`${PREFIX}/link-groups`, async (req) => {
        const body = parseBody(createLinkGroupBodySchema, req.body);
        return navigation.createLinkGroup(body, writeContext(req));
    });
    app.patch(`${PREFIX}/link-groups/:id`, async (req) => {
        const { id } = parseParams(navigationContentIdParamsSchema, req.params);
        const body = parseBody(updateLinkGroupBodySchema, req.body);
        return navigation.updateLinkGroup(id, body, writeContext(req));
    });
    app.delete(`${PREFIX}/link-groups/:id`, async (req) => {
        const { id } = parseParams(navigationContentIdParamsSchema, req.params);
        return navigation.deleteLinkGroup(id, writeContext(req));
    });
    app.get(`${PREFIX}/footer-content`, async (req) => {
        const q = parseQuery(footerContentListQuerySchema, req.query);
        return navigation.listFooterContents(writeContext(req), q.status);
    });
    app.get(`${PREFIX}/footer-content/:id`, async (req) => {
        const { id } = parseParams(navigationContentIdParamsSchema, req.params);
        return navigation.getFooterContent(id, writeContext(req));
    });
    app.post(`${PREFIX}/footer-content`, async (req) => {
        const body = parseBody(createFooterContentBodySchema, req.body);
        return navigation.createFooterContent(body, writeContext(req));
    });
    app.patch(`${PREFIX}/footer-content/:id`, async (req) => {
        const { id } = parseParams(navigationContentIdParamsSchema, req.params);
        const body = parseBody(updateFooterContentBodySchema, req.body);
        return navigation.updateFooterContent(id, body, writeContext(req));
    });
    app.delete(`${PREFIX}/footer-content/:id`, async (req) => {
        const { id } = parseParams(navigationContentIdParamsSchema, req.params);
        return navigation.deleteFooterContent(id, writeContext(req));
    });
}
export default registerNavigationRoutes;
