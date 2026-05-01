import { ReactNode } from "react";
import { CategoryNavigation } from "@/components/layout/category-navigation";
import { Footer } from "@/components/layout/footer";
import { MainHeader } from "@/components/layout/main-header";
import { UtilityTopBar } from "@/components/layout/utility-top-bar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-40">
        <UtilityTopBar />
        <MainHeader />
        <CategoryNavigation />
      </div>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-3 py-3">{children}</main>
      <Footer />
    </div>
  );
}
