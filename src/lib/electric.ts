import { ShapeStream, Shape } from "@electric-sql/client";

const ELECTRIC_URL = import.meta.env.VITE_ELECTRIC_URL || "http://localhost:30000";

export interface ShapeConfig {
  table: string;
  where?: string;
  columns?: string[];
}

export function createShapeStream<T>(config: ShapeConfig): ShapeStream<T> {
  const url = new URL(`/v1/shape`, ELECTRIC_URL);
  url.searchParams.set("table", config.table);

  if (config.where) {
    url.searchParams.set("where", config.where);
  }

  if (config.columns) {
    url.searchParams.set("columns", config.columns.join(","));
  }

  return new ShapeStream<T>({
    url: url.toString(),
  });
}

export function createShape<T>(config: ShapeConfig): Shape<T> {
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
};
