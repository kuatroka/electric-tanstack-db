import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ContentReadyProvider } from "@/hooks/useContentReady";
import { ThemeProvider } from "@/hooks/useTheme";
import { SiteLayout } from "@/components/layout";
import "@/index.css";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <ContentReadyProvider>
        <div className="min-h-screen bg-background text-foreground">
          <SiteLayout>
            <div className="container mx-auto px-4 py-8">
              <Outlet />
            </div>
          </SiteLayout>
          <TanStackRouterDevtools />
        </div>
      </ContentReadyProvider>
    </ThemeProvider>
  ),
});
