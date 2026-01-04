import { Hono } from "hono";
import { db, withTiming } from "../db";
import { superinvestors } from "../../db/schema";
import { sql } from "drizzle-orm";

const app = new Hono();

// GET /api/superinvestors - List all superinvestors with optional pagination
app.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") || "1000");
  const offset = parseInt(c.req.query("offset") || "0");

  const { data, queryTimeMs } = await withTiming(async () => {
    const [rows, countResult] = await Promise.all([
      db
        .select({
          id: superinvestors.id,
          cik: superinvestors.cik,
          name: superinvestors.name,
          ticker: superinvestors.ticker,
          activePeriods: superinvestors.activePeriods,
        })
        .from(superinvestors)
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(superinvestors),
    ]);

    return {
      superinvestors: rows,
      total: Number(countResult[0]?.count || 0),
      limit,
      offset,
    };
  });

  return c.json({ ...data, queryTimeMs });
});

// GET /api/superinvestors/:cik - Get single superinvestor by CIK
app.get("/:cik", async (c) => {
  const cik = c.req.param("cik");

  const { data, queryTimeMs } = await withTiming(async () => {
    const rows = await db
      .select()
      .from(superinvestors)
      .where(sql`${superinvestors.cik} = ${cik}`)
      .limit(1);

    return rows[0] || null;
  });

  if (!data) {
    return c.json({ error: "Superinvestor not found", queryTimeMs }, 404);
  }

  return c.json({ superinvestor: data, queryTimeMs });
});

export default app;
