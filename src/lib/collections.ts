import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/db-collections";

const ELECTRIC_URL = import.meta.env.VITE_ELECTRIC_URL || "http://localhost:30000";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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
