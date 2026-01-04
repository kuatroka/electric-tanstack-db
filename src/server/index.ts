import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { projects, todos } from "../db/schema";
import { eq } from "drizzle-orm";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/postgres";

const client = postgres(DATABASE_URL);
const db = drizzle(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Projects API
    if (path === "/api/projects" && req.method === "POST") {
      const body = await req.json();
      await db.insert(projects).values({
        id: body.id,
        name: body.name,
        description: body.description,
        ownerId: body.owner_id,
        sharedUserIds: body.shared_user_ids,
        createdAt: body.created_at ? new Date(body.created_at) : new Date(),
      });
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (path.startsWith("/api/projects/") && req.method === "PATCH") {
      const id = path.split("/")[3];
      const body = await req.json();
      await db
        .update(projects)
        .set({
          name: body.name,
          description: body.description,
          sharedUserIds: body.shared_user_ids,
        })
        .where(eq(projects.id, id));
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (path.startsWith("/api/projects/") && req.method === "DELETE") {
      const id = path.split("/")[3];
      await db.delete(projects).where(eq(projects.id, id));
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Todos API
    if (path === "/api/todos" && req.method === "POST") {
      const body = await req.json();
      await db.insert(todos).values({
        id: body.id,
        text: body.text,
        completed: body.completed ?? false,
        userId: body.user_id,
        projectId: body.project_id,
        userIds: body.user_ids,
        createdAt: body.created_at ? new Date(body.created_at) : new Date(),
      });
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (path.startsWith("/api/todos/") && req.method === "PATCH") {
      const id = path.split("/")[3];
      const body = await req.json();
      await db
        .update(todos)
        .set({
          text: body.text,
          completed: body.completed,
          userIds: body.user_ids,
        })
        .where(eq(todos.id, id));
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (path.startsWith("/api/todos/") && req.method === "DELETE") {
      const id = path.split("/")[3];
      await db.delete(todos).where(eq(todos.id, id));
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}

const server = Bun.serve({
  port: 3001,
  fetch: handleRequest,
});

console.log(`API server running on http://localhost:${server.port}`);
