import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ContentReadyProvider } from "@/hooks/useContentReady";
import { SiteLayout } from "@/components/SiteLayout";
import "@/index.css";

export const Route = createRootRoute({
  component: () => (
    <ContentReadyProvider>
      <div className="min-h-screen bg-background text-foreground">
        <SiteLayout>
          <main className="container mx-auto px-4 py-8">
            <Outlet />
          </main>
        </SiteLayout>
        <TanStackRouterDevtools />
      </div>
    </ContentReadyProvider>
  ),
});
