import { getUtilityLinkGroup } from "@/lib/catalog-service";

export async function UtilityTopBar() {
  const group = await getUtilityLinkGroup().catch(() => undefined);
  const links = group?.links?.length
    ? group.links.map((link) => ({ label: link.label, href: link.href }))
    : [];

  return (
    <div className="bg-slate-800 text-slate-100">
      <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-between px-3 text-[11px]">
        <p className="font-medium tracking-wide">Factorypeer Industrial Supply Platform</p>
        <nav className="flex items-center gap-4">
          {links.map((link) => (
            <a key={link.label} href={link.href || "#"} className="hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
