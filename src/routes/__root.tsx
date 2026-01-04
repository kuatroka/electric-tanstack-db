import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { GlobalSearch } from "@/components/GlobalSearch";
import "@/index.css";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalSearch />
      <main className="pt-16">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
});
