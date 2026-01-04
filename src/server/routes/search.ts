import { Hono } from "hono";
import { db, withTiming } from "../db";
import { searches } from "../../db/schema";
import { sql, or, ilike } from "drizzle-orm";

const app = new Hono();

// GET /api/search - Global search across assets and superinvestors
app.get("/", async (c) => {
  const q = c.req.query("q");
  const limit = parseInt(c.req.query("limit") || "50");

  if (!q || q.length < 1) {
    return c.json({ results: [], queryTimeMs: 0 });
  }

  const { data, queryTimeMs } = await withTiming(async () => {
    const searchPattern = `%${q}%`;

    const rows = await db
      .select({
        id: searches.id,
        code: searches.code,
        name: searches.name,
        category: searches.category,
        cusip: searches.cusip,
      })
      .from(searches)
      .where(
        or(
          ilike(searches.code, searchPattern),
          ilike(searches.name, searchPattern)
        )
      )
      .limit(limit);

    // Group by category
    const grouped = {
      assets: rows.filter((r) => r.category === "assets"),
      superinvestors: rows.filter((r) => r.category === "superinvestors"),
    };

    return grouped;
  });

  return c.json({ results: data, queryTimeMs });
});

// GET /api/search/full-dump - Paginated bulk export for client-side sync
app.get("/full-dump", async (c) => {
  const limit = parseInt(c.req.query("limit") || "10000");
  const offset = parseInt(c.req.query("offset") || "0");

  const { data, queryTimeMs } = await withTiming(async () => {
    const [rows, countResult] = await Promise.all([
      db
        .select({
          id: searches.id,
          code: searches.code,
          name: searches.name,
          category: searches.category,
          cusip: searches.cusip,
        })
        .from(searches)
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(searches),
    ]);

    return {
      searches: rows,
      total: Number(countResult[0]?.count || 0),
      limit,
      offset,
    };
  });

  return c.json({ ...data, queryTimeMs });
});

export default app;
