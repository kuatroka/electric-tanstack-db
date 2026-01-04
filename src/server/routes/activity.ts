import { Hono } from "hono";
import { db, withTiming } from "../db";
import { activitySummary, investorFlow, cikQuarterly, drilldownActivity } from "../../db/schema";
import { sql, eq, and, isNull } from "drizzle-orm";

const app = new Hono();

// GET /api/all-assets-activity - Aggregated activity by quarter
app.get("/all-assets-activity", async (c) => {
  const cusip = c.req.query("cusip");
  const ticker = c.req.query("ticker");

  const { data, queryTimeMs } = await withTiming(async () => {
    let query = db
      .select({
        quarter: activitySummary.quarter,
        opened: activitySummary.opened,
        closed: activitySummary.closed,
        added: activitySummary.added,
        reduced: activitySummary.reduced,
        held: activitySummary.held,
      })
      .from(activitySummary);

    if (cusip) {
      query = query.where(eq(activitySummary.cusip, cusip)) as typeof query;
    } else if (ticker) {
      query = query.where(eq(activitySummary.ticker, ticker)) as typeof query;
    } else {
      // Global aggregate (cusip IS NULL)
      query = query.where(isNull(activitySummary.cusip)) as typeof query;
    }

    const rows = await query.orderBy(activitySummary.quarter);
    return rows;
  });

  return c.json({ activity: data, queryTimeMs });
});

// GET /api/investor-flow - Inflow/outflow per quarter for a ticker
app.get("/investor-flow", async (c) => {
  const ticker = c.req.query("ticker");

  if (!ticker) {
    return c.json({ error: "ticker parameter required" }, 400);
  }

  const { data, queryTimeMs } = await withTiming(async () => {
    const rows = await db
      .select({
        quarter: investorFlow.quarter,
        inflow: investorFlow.inflow,
        outflow: investorFlow.outflow,
      })
      .from(investorFlow)
      .where(eq(investorFlow.ticker, ticker))
      .orderBy(investorFlow.quarter);

    return rows;
  });

  return c.json({ flow: data, queryTimeMs });
});

// GET /api/cik-quarterly/:cik - Portfolio value time series
app.get("/cik-quarterly/:cik", async (c) => {
  const cik = c.req.param("cik");

  const { data, queryTimeMs } = await withTiming(async () => {
    const rows = await db
      .select({
        cik: cikQuarterly.cik,
        quarter: cikQuarterly.quarter,
        quarterEndDate: cikQuarterly.quarterEndDate,
        totalValue: cikQuarterly.totalValue,
        totalValuePrcChg: cikQuarterly.totalValuePrcChg,
        numAssets: cikQuarterly.numAssets,
      })
      .from(cikQuarterly)
      .where(eq(cikQuarterly.cik, cik))
      .orderBy(cikQuarterly.quarter);

    return rows;
  });

  return c.json({ quarterly: data, queryTimeMs });
});

// GET /api/drilldown/:ticker - Investor activity drilldown
app.get("/drilldown/:ticker", async (c) => {
  const ticker = c.req.param("ticker");
  const quarter = c.req.query("quarter");
  const action = c.req.query("action");

  const { data, queryTimeMs } = await withTiming(async () => {
    let conditions = [eq(drilldownActivity.ticker, ticker)];

    if (quarter) {
      conditions.push(eq(drilldownActivity.quarter, quarter));
    }
    if (action) {
      conditions.push(eq(drilldownActivity.action, action));
    }

    const rows = await db
      .select({
        cik: drilldownActivity.cik,
        cikName: drilldownActivity.cikName,
        quarter: drilldownActivity.quarter,
        action: drilldownActivity.action,
        shares: drilldownActivity.shares,
        value: drilldownActivity.value,
      })
      .from(drilldownActivity)
      .where(and(...conditions))
      .orderBy(drilldownActivity.quarter, drilldownActivity.cik)
      .limit(500);

    return rows;
  });

  return c.json({ drilldown: data, queryTimeMs });
});

// GET /api/drilldown/:ticker/summary - Summary counts per quarter/action
app.get("/drilldown/:ticker/summary", async (c) => {
  const ticker = c.req.param("ticker");

  const { data, queryTimeMs } = await withTiming(async () => {
    const rows = await db
      .select({
        quarter: drilldownActivity.quarter,
        action: drilldownActivity.action,
        count: sql<number>`count(*)`,
      })
      .from(drilldownActivity)
      .where(eq(drilldownActivity.ticker, ticker))
      .groupBy(drilldownActivity.quarter, drilldownActivity.action)
      .orderBy(drilldownActivity.quarter);

    return rows;
  });

  return c.json({ summary: data, queryTimeMs });
});

export default app;
