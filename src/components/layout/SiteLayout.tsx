import { GlobalNav } from "./GlobalNav";
import { useContentReady } from "@/hooks/useContentReady";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const { isReady } = useContentReady();

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalNav />
      <main
        className="flex-1"
        style={{ visibility: isReady ? "visible" : "hidden" }}
      >
        {children}
      </main>
    </div>
  );
}
