import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

// Import route modules
import assetsRoutes from "./routes/assets";
import superinvestorsRoutes from "./routes/superinvestors";
import activityRoutes from "./routes/activity";
import searchRoutes from "./routes/search";
import dataFreshnessRoutes from "./routes/data-freshness";

// Legacy imports for backward compatibility
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { projects, todos } from "../db/schema";
import { eq } from "drizzle-orm";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/postgres";

const client = postgres(DATABASE_URL);
const db = drizzle(client);

// Create Hono app
const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger());

// Mount route modules
app.route("/api/assets", assetsRoutes);
app.route("/api/superinvestors", superinvestorsRoutes);
app.route("/api", activityRoutes); // Mounts /all-assets-activity, /investor-flow, /cik-quarterly, /drilldown
app.route("/api/search", searchRoutes);
app.route("/api/data-freshness", dataFreshnessRoutes);

// ============================================
// Legacy routes (for backward compatibility)
// ============================================

// Projects API
app.post("/api/projects", async (c) => {
  const body = await c.req.json();
  await db.insert(projects).values({
    id: body.id,
    name: body.name,
    description: body.description,
    ownerId: body.owner_id,
    sharedUserIds: body.shared_user_ids,
    createdAt: body.created_at ? new Date(body.created_at) : new Date(),
  });
  return c.json({ success: true });
});

app.patch("/api/projects/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await db
    .update(projects)
    .set({
      name: body.name,
      description: body.description,
      sharedUserIds: body.shared_user_ids,
    })
    .where(eq(projects.id, id));
  return c.json({ success: true });
});

app.delete("/api/projects/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(projects).where(eq(projects.id, id));
  return c.json({ success: true });
});

// Todos API
app.post("/api/todos", async (c) => {
  const body = await c.req.json();
  await db.insert(todos).values({
    id: body.id,
    text: body.text,
    completed: body.completed ?? false,
    userId: body.user_id,
    projectId: body.project_id,
    userIds: body.user_ids,
    createdAt: body.created_at ? new Date(body.created_at) : new Date(),
  });
  return c.json({ success: true });
});

app.patch("/api/todos/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await db
    .update(todos)
    .set({
      text: body.text,
      completed: body.completed,
      userIds: body.user_ids,
    })
    .where(eq(todos.id, id));
  return c.json({ success: true });
});

app.delete("/api/todos/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(todos).where(eq(todos.id, id));
  return c.json({ success: true });
});

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json({ error: err.message }, 500);
});

// Start server
const port = parseInt(process.env.PORT || "3001");

export default {
  port,
  fetch: app.fetch,
};

console.log(`API server running on http://localhost:${port}`);
