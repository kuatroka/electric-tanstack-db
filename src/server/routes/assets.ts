import { Hono } from "hono";
import { db, withTiming } from "../db";
import { assets } from "../../db/schema";
import { sql } from "drizzle-orm";

const app = new Hono();

// GET /api/assets - List all assets with optional pagination
app.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") || "1000");
  const offset = parseInt(c.req.query("offset") || "0");

  const { data, queryTimeMs } = await withTiming(async () => {
    const [rows, countResult] = await Promise.all([
      db
        .select({
          id: assets.id,
          code: assets.code,
          cusip: assets.cusip,
          name: assets.name,
        })
        .from(assets)
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(assets),
    ]);

    return {
      assets: rows,
      total: Number(countResult[0]?.count || 0),
      limit,
      offset,
    };
  });

  return c.json({ ...data, queryTimeMs });
});

// GET /api/assets/:code - Get single asset by code
app.get("/:code", async (c) => {
  const code = c.req.param("code");

  const { data, queryTimeMs } = await withTiming(async () => {
    const rows = await db
      .select()
      .from(assets)
      .where(sql`${assets.code} = ${code}`)
      .limit(1);

    return rows[0] || null;
  });

  if (!data) {
    return c.json({ error: "Asset not found", queryTimeMs }, 404);
  }

  return c.json({ asset: data, queryTimeMs });
});

export default app;
