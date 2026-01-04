import {
  pgTable,
  text,
  boolean,
  timestamp,
  index,
  bigint,
  bigserial,
  integer,
  numeric,
  date,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ============================================
// EXISTING TABLES (from original project)
// ============================================

// Reference to existing Zero user table (not managed by this project)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  partner: boolean("partner").notNull(),
});

// Projects table - Electric synced
export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id),
    sharedUserIds: text("shared_user_ids").array(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_projects_owner").on(table.ownerId),
    index("idx_projects_created").on(table.createdAt),
  ]
);

// Todos table - Electric synced
export const todos = pgTable(
  "todos",
  {
    id: text("id").primaryKey(),
    text: text("text").notNull(),
    completed: boolean("completed").notNull().default(false),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    userIds: text("user_ids").array(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_todos_project").on(table.projectId),
    index("idx_todos_user").on(table.userId),
    index("idx_todos_completed").on(table.completed),
  ]
);

// ============================================
// FINTELLECTUS TABLES (matching existing schema)
// ============================================

// Asset master data (matches existing table structure)
export const assets = pgTable(
  "assets",
  {
    id: bigint("id", { mode: "number" }).primaryKey(),
    code: text("asset").notNull(), // Column is 'asset' in DB, aliased as 'code'
    name: text("asset_name"), // Column is 'asset_name' in DB
    cusip: text("cusip"),
  },
  (table) => [
    index("idx_assets_asset").on(table.code),
    index("idx_assets_cusip").on(table.cusip),
  ]
);

// Superinvestor master data (matches existing table structure)
export const superinvestors = pgTable(
  "superinvestors",
  {
    id: bigint("id", { mode: "number" }).primaryKey(),
    cik: text("cik").notNull(),
    name: text("cik_name"), // Column is 'cik_name' in DB
    ticker: text("cik_ticker"), // Column is 'cik_ticker' in DB
    activePeriods: text("active_periods"),
  },
  (table) => [
    index("idx_superinvestors_cik").on(table.cik),
  ]
);

// Global search index (matches existing table structure)
export const searches = pgTable(
  "searches",
  {
    id: bigint("id", { mode: "number" }).primaryKey(),
    code: text("code").notNull(),
    name: text("name"),
    category: text("category").notNull(),
    cusip: text("cusip"),
  },
  (table) => [
    index("idx_searches_code").on(table.code),
    index("idx_searches_name").on(table.name),
    index("idx_searches_category").on(table.category),
  ]
);

// ============================================
// NEW FINTELLECTUS TABLES
// ============================================

// Aggregated activity by quarter (for charts)
export const activitySummary = pgTable(
  "activity_summary",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    cusip: text("cusip"), // NULL for all-assets aggregate
    ticker: text("ticker"),
    quarter: text("quarter").notNull(), // Format: "2024-Q1"
    opened: integer("opened").default(0),
    closed: integer("closed").default(0),
    added: integer("added").default(0),
    reduced: integer("reduced").default(0),
    held: integer("held").default(0),
  },
  (table) => [
    index("idx_activity_summary_cusip").on(table.cusip),
    index("idx_activity_summary_quarter").on(table.quarter),
    index("idx_activity_summary_ticker").on(table.ticker),
  ]
);

// Portfolio value over time per CIK
export const cikQuarterly = pgTable(
  "cik_quarterly",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    cik: text("cik").notNull(),
    quarter: text("quarter").notNull(),
    quarterEndDate: date("quarter_end_date"),
    totalValue: numeric("total_value", { precision: 20, scale: 2 }),
    totalValuePrcChg: numeric("total_value_prc_chg", { precision: 10, scale: 4 }),
    numAssets: integer("num_assets"),
  },
  (table) => [
    index("idx_cik_quarterly_cik").on(table.cik),
    index("idx_cik_quarterly_quarter").on(table.quarter),
  ]
);

// Investor flow per asset
export const investorFlow = pgTable(
  "investor_flow",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    ticker: text("ticker").notNull(),
    quarter: text("quarter").notNull(),
    inflow: numeric("inflow", { precision: 20, scale: 2 }),
    outflow: numeric("outflow", { precision: 20, scale: 2 }),
  },
  (table) => [
    index("idx_investor_flow_ticker").on(table.ticker),
    index("idx_investor_flow_quarter").on(table.quarter),
  ]
);

// Drilldown activity details
export const drilldownActivity = pgTable(
  "drilldown_activity",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    cusip: text("cusip").notNull(),
    ticker: text("ticker").notNull(),
    quarter: text("quarter").notNull(),
    cik: text("cik").notNull(),
    cikName: text("cik_name"),
    action: text("action"),
    shares: numeric("shares", { precision: 20, scale: 0 }),
    value: numeric("value", { precision: 20, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_drilldown_cusip").on(table.cusip),
    index("idx_drilldown_quarter").on(table.quarter),
    index("idx_drilldown_cik").on(table.cik),
    index("idx_drilldown_cusip_quarter").on(table.cusip, table.quarter),
    check("action_check", sql`${table.action} IN ('open', 'add', 'reduce', 'close', 'hold')`),
  ]
);

// ============================================
// TYPE EXPORTS
// ============================================

// Original types
export type User = typeof user.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

// Fintellectus types
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type Superinvestor = typeof superinvestors.$inferSelect;
export type NewSuperinvestor = typeof superinvestors.$inferInsert;
export type Search = typeof searches.$inferSelect;
export type NewSearch = typeof searches.$inferInsert;
export type ActivitySummary = typeof activitySummary.$inferSelect;
export type NewActivitySummary = typeof activitySummary.$inferInsert;
export type CikQuarterly = typeof cikQuarterly.$inferSelect;
export type NewCikQuarterly = typeof cikQuarterly.$inferInsert;
export type InvestorFlow = typeof investorFlow.$inferSelect;
export type NewInvestorFlow = typeof investorFlow.$inferInsert;
export type DrilldownActivity = typeof drilldownActivity.$inferSelect;
export type NewDrilldownActivity = typeof drilldownActivity.$inferInsert;
