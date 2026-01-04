import { ShapeStream, Shape } from "@electric-sql/client";

// Use Vite proxy to bypass CORS issues with Electric SQL
// For relative paths, construct absolute URL using window.location.origin
const envUrl = import.meta.env.VITE_ELECTRIC_URL || "/electric";
const ELECTRIC_URL = envUrl.startsWith("/")
  ? `${window.location.origin}${envUrl}`
  : envUrl;

export interface ShapeConfig {
  table: string;
  where?: string;
  columns?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createShapeStream<T extends Record<string, any>>(config: ShapeConfig): ShapeStream<T> {
  // Build URL - append /v1/shape to ELECTRIC_URL base path
  const params = new URLSearchParams();
  params.set("table", config.table);
  if (config.where) {
    params.set("where", config.where);
  }
  if (config.columns) {
    params.set("columns", config.columns.join(","));
  }

  // Ensure no double slashes
  const basePath = ELECTRIC_URL.endsWith("/") ? ELECTRIC_URL.slice(0, -1) : ELECTRIC_URL;
  const urlString = `${basePath}/v1/shape?${params.toString()}`;

  return new ShapeStream<T>({
    url: urlString,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createShape<T extends Record<string, any>>(config: ShapeConfig): Shape<T> {
  const stream = createShapeStream<T>(config);
  return new Shape<T>(stream);
}

// Pre-configured shapes for common use cases
export const shapes = {
  projects: () =>
    createShape<{
      id: string;
      name: string;
      description: string | null;
      owner_id: string;
      shared_user_ids: string[] | null;
      created_at: string;
    }>({ table: "projects" }),

  todos: (projectId?: string) =>
    createShape<{
      id: string;
      text: string;
      completed: boolean;
      user_id: string;
      project_id: string;
      user_ids: string[] | null;
      created_at: string;
    }>({
      table: "todos",
      where: projectId ? `project_id = '${projectId}'` : undefined,
    }),

  // Searches shape - syncs entire searches table for instant offline-capable search
  searches: () =>
    createShape<{
      id: number;
      code: string;
      name: string | null;
      category: string;
      cusip: string | null;
    }>({
      table: "searches",
    }),
};
