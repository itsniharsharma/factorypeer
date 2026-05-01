import { utilityLinks } from "@/lib/mock-data";

export function UtilityTopBar() {
  return (
    <div className="bg-slate-800 text-slate-100">
      <div className="mx-auto flex h-8 max-w-[1400px] items-center justify-between px-4 text-[11px]">
        <p className="font-medium tracking-wide">Factorypeer Industrial Supply Platform</p>
        <nav className="flex items-center gap-4">
          {utilityLinks.map((link) => (
            <a key={link} href="#" className="hover:text-white">
              {link}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
