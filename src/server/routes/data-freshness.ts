import { Hono } from "hono";
import { db, withTiming } from "../db";
import { sql } from "drizzle-orm";

const app = new Hono();

// GET /api/data-freshness - Data load date and version
app.get("/", async (c) => {
  const { data, queryTimeMs } = await withTiming(async () => {
    // Get latest quarter_end_date from cik_quarterly as a proxy for data freshness
    const result = await db.execute(
      sql`SELECT MAX(quarter_end_date) as last_updated FROM cik_quarterly`
    );

    const lastUpdated = result[0]?.last_updated || new Date().toISOString();

    return {
      lastDataLoadDate: lastUpdated,
      version: "1.0.0",
      dbVersion: "postgresql",
    };
  });

  return c.json({ ...data, queryTimeMs });
});

export default app;
