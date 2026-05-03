import { getUtilityLinkGroup } from "@/lib/catalog-service";

const utilityLinksFallback = [
  { label: "Contract Pricing", href: "/pricing" },
  { label: "Bulk RFQ", href: "/rfq" },
  { label: "Fleet Programs", href: "/programs/fleet" },
  { label: "Branch Pickup", href: "/branch-pickup" },
  { label: "Help Center", href: "/help" },
];

export async function UtilityTopBar() {
  const group = await getUtilityLinkGroup().catch(() => undefined);
  const links = group?.links?.length
    ? group.links.map((link) => ({ label: link.label, href: link.href }))
    : utilityLinksFallback;

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
