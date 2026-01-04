import { createAPIFileRoute } from "@tanstack/start/api";

const ELECTRIC_URL = process.env.ELECTRIC_URL || "http://localhost:30000";

// Proxy requests to Electric service
// This allows the frontend to make shape requests through the app server
// which can add authentication, caching, or other middleware
export const APIRoute = createAPIFileRoute("/api/shapes")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const table = url.searchParams.get("table");
    const where = url.searchParams.get("where");
    const columns = url.searchParams.get("columns");

    if (!table) {
      return new Response(JSON.stringify({ error: "table parameter required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build Electric shape URL
    const electricUrl = new URL(`/v1/shape`, ELECTRIC_URL);
    electricUrl.searchParams.set("table", table);
    if (where) electricUrl.searchParams.set("where", where);
    if (columns) electricUrl.searchParams.set("columns", columns);

    // Forward the request to Electric
    const response = await fetch(electricUrl.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    // Return the Electric response
    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
        "Cache-Control": response.headers.get("Cache-Control") || "no-cache",
      },
    });
  },
});
