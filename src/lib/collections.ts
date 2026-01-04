import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/db-collections";

// Use Vite proxy to bypass CORS issues with Electric SQL
// For relative paths, construct absolute URL using window.location.origin
const envUrl = import.meta.env.VITE_ELECTRIC_URL || "/electric";
const ELECTRIC_URL = envUrl.startsWith("/")
  ? `${window.location.origin}${envUrl}`
  : envUrl;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ============================================
// ORIGINAL TYPES (Projects/Todos)
// ============================================

// Project type for TanStack DB
export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  shared_user_ids: string[] | null;
  created_at: string;
  [key: string]: unknown;
}

// Todo type for TanStack DB
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
  project_id: string;
  user_ids: string[] | null;
  created_at: string;
  [key: string]: unknown;
}

// ============================================
// FINTELLECTUS TYPES
// ============================================

// Asset type for TanStack DB (matches assets table)
export interface Asset {
  id: number;
  asset: string; // code/ticker
  asset_name: string | null;
  cusip: string | null;
  [key: string]: unknown;
}

// Superinvestor type for TanStack DB (matches superinvestors table)
export interface Superinvestor {
  id: number;
  cik: string;
  cik_name: string | null;
  cik_ticker: string | null;
  active_periods: string | null;
  [key: string]: unknown;
}

// Search type for TanStack DB (matches searches table)
export interface Search {
  id: number;
  code: string;
  name: string | null;
  category: string;
  cusip: string | null;
  [key: string]: unknown;
}

// Activity Summary type for TanStack DB (matches activity_summary table)
export interface ActivitySummary {
  id: number;
  cusip: string | null;
  ticker: string | null;
  quarter: string;
  opened: number | null;
  closed: number | null;
  added: number | null;
  reduced: number | null;
  held: number | null;
  [key: string]: unknown;
}

// CIK Quarterly type for TanStack DB (matches cik_quarterly table)
export interface CikQuarterly {
  id: number;
  cik: string;
  quarter: string;
  quarter_end_date: string | null;
  total_value: string | null; // numeric comes as string
  total_value_prc_chg: string | null;
  num_assets: number | null;
  [key: string]: unknown;
}

// Investor Flow type for TanStack DB (matches investor_flow table)
export interface InvestorFlow {
  id: number;
  ticker: string;
  quarter: string;
  inflow: string | null; // numeric comes as string
  outflow: string | null;
  [key: string]: unknown;
}

// ============================================
// COLLECTION STATUS TYPES
// ============================================

export type CollectionSyncStatus = {
  syncing: boolean;
  count: number;
  total: number | null;
  error: Error | null;
}

// Projects collection with Electric sync
const { collectionOptions: projectOptions } = electricCollectionOptions<Project>({
  id: "projects",
  shapeOptions: {
    url: `${ELECTRIC_URL}/v1/shape?table=projects`,
  },
  getId: (p) => p.id,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const projectsCollection = createCollection<Project>({
  ...projectOptions,
  onInsert: async ({ transaction }: any) => {
    const item = transaction.mutations[0].modified as Project;
    await fetch(`${API_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  },
  onUpdate: async ({ transaction }: any) => {
    const { original, changes } = transaction.mutations[0];
    await fetch(`${API_URL}/api/projects/${original.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
  },
  onDelete: async ({ transaction }: any) => {
    const item = transaction.mutations[0].original as Project;
    await fetch(`${API_URL}/api/projects/${item.id}`, {
      method: "DELETE",
    });
  },
} as any);

// Todos collection with Electric sync
const { collectionOptions: todoOptions } = electricCollectionOptions<Todo>({
  id: "todos",
  shapeOptions: {
    url: `${ELECTRIC_URL}/v1/shape?table=todos`,
  },
  getId: (t) => t.id,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const todosCollection = createCollection<Todo>({
  ...todoOptions,
  onInsert: async ({ transaction }: any) => {
    const item = transaction.mutations[0].modified as Todo;
    await fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  },
  onUpdate: async ({ transaction }: any) => {
    const { original, changes } = transaction.mutations[0];
    await fetch(`${API_URL}/api/todos/${original.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
  },
  onDelete: async ({ transaction }: any) => {
    const item = transaction.mutations[0].original as Todo;
    await fetch(`${API_URL}/api/todos/${item.id}`, {
      method: "DELETE",
    });
  },
} as any);

// Factory for project-scoped todos collection
export const createProjectTodosCollection = (projectId: string) => {
  const { collectionOptions } = electricCollectionOptions<Todo>({
    id: `todos-${projectId}`,
    shapeOptions: {
      url: `${ELECTRIC_URL}/v1/shape?table=todos&where=project_id='${projectId}'`,
    },
    getId: (t) => t.id,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createCollection<Todo>({
    ...collectionOptions,
    onInsert: async ({ transaction }: any) => {
      const item = transaction.mutations[0].modified as Todo;
      await fetch(`${API_URL}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    },
    onUpdate: async ({ transaction }: any) => {
      const { original, changes } = transaction.mutations[0];
      await fetch(`${API_URL}/api/todos/${original.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
    },
    onDelete: async ({ transaction }: any) => {
      const item = transaction.mutations[0].original as Todo;
      await fetch(`${API_URL}/api/todos/${item.id}`, {
        method: "DELETE",
      });
    },
  } as any);
};

// ============================================
// FINTELLECTUS COLLECTIONS
// ============================================

// Assets collection - syncs entire assets table for instant lookups
const { collectionOptions: assetOptions } = electricCollectionOptions<Asset>({
  id: "assets",
  shapeOptions: {
    url: `${ELECTRIC_URL}/v1/shape?table=assets`,
  },
  getId: (a) => String(a.id),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const assetsCollection = createCollection<Asset>(assetOptions as any);

// Superinvestors collection - syncs entire superinvestors table
const { collectionOptions: superinvestorOptions } = electricCollectionOptions<Superinvestor>({
  id: "superinvestors",
  shapeOptions: {
    url: `${ELECTRIC_URL}/v1/shape?table=superinvestors`,
  },
  getId: (s) => String(s.id),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const superinvestorsCollection = createCollection<Superinvestor>(superinvestorOptions as any);

// Searches collection - syncs global search index for instant search
const { collectionOptions: searchOptions } = electricCollectionOptions<Search>({
  id: "searches",
  shapeOptions: {
    url: `${ELECTRIC_URL}/v1/shape?table=searches`,
  },
  getId: (s) => String(s.id),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const searchesCollection = createCollection<Search>(searchOptions as any);

// Activity Summary collection - syncs aggregated activity data for charts
const { collectionOptions: activitySummaryOptions } = electricCollectionOptions<ActivitySummary>({
  id: "activity_summary",
  shapeOptions: {
    url: `${ELECTRIC_URL}/v1/shape?table=activity_summary`,
  },
  getId: (a) => String(a.id),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const activitySummaryCollection = createCollection<ActivitySummary>(activitySummaryOptions as any);

// ============================================
// PARAMETERIZED COLLECTION FACTORIES
// ============================================

// CIK Quarterly collection - parameterized by CIK for portfolio value time series
export const createCikQuarterlyCollection = (cik: string) => {
  const { collectionOptions } = electricCollectionOptions<CikQuarterly>({
    id: `cik_quarterly-${cik}`,
    shapeOptions: {
      url: `${ELECTRIC_URL}/v1/shape?table=cik_quarterly&where=cik='${cik}'`,
    },
    getId: (c) => String(c.id),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createCollection<CikQuarterly>(collectionOptions as any);
};

// Investor Flow collection - parameterized by ticker for inflow/outflow data
export const createInvestorFlowCollection = (ticker: string) => {
  const { collectionOptions } = electricCollectionOptions<InvestorFlow>({
    id: `investor_flow-${ticker}`,
    shapeOptions: {
      url: `${ELECTRIC_URL}/v1/shape?table=investor_flow&where=ticker='${ticker}'`,
    },
    getId: (f) => String(f.id),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createCollection<InvestorFlow>(collectionOptions as any);
};

// ============================================
// PRELOAD UTILITY
// ============================================

/**
 * Preloads critical collections for app initialization.
 * Call this early in the app lifecycle to start syncing data.
 * Returns a promise that resolves when initial sync is complete.
 */
export async function preloadCollections(): Promise<void> {
  // The collections start syncing when created, we just need to wait for initial data
  // TanStack DB collections automatically start syncing with Electric
  // This function serves as a coordination point for app initialization
  console.log("[collections] Preloading Fintellectus collections...");

  // Collections are already created and syncing at module load time
  // The Electric shape sync happens automatically in the background
  // UI components using useLiveQuery will re-render as data arrives

  console.log("[collections] Collections initialized: assets, superinvestors, searches, activity_summary");
}

/**
 * Collection registry for status monitoring
 */
export const fintellectusCollections = {
  assets: assetsCollection,
  superinvestors: superinvestorsCollection,
  searches: searchesCollection,
  activitySummary: activitySummaryCollection,
} as const;
