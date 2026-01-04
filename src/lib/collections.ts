import { createCollection } from "@tanstack/db-collections";
import { shapes } from "./electric";

// Project type for TanStack DB
export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  shared_user_ids: string[] | null;
  created_at: string;
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
}

// Projects collection with Electric sync
export const projectsCollection = createCollection<Project>({
  id: "projects",
  primaryKey: "id",
  sync: {
    // Electric shape subscription for real-time sync
    subscribe: (onData) => {
      const shape = shapes.projects();
      shape.subscribe(({ rows }) => {
        onData(rows as Project[]);
      });
      return () => shape.unsubscribe();
    },
  },
});

// Todos collection with Electric sync
export const todosCollection = createCollection<Todo>({
  id: "todos",
  primaryKey: "id",
  sync: {
    subscribe: (onData) => {
      const shape = shapes.todos();
      shape.subscribe(({ rows }) => {
        onData(rows as Todo[]);
      });
      return () => shape.unsubscribe();
    },
  },
});

// Factory for project-scoped todos collection
export const createProjectTodosCollection = (projectId: string) =>
  createCollection<Todo>({
    id: `todos-${projectId}`,
    primaryKey: "id",
    sync: {
      subscribe: (onData) => {
        const shape = shapes.todos(projectId);
        shape.subscribe(({ rows }) => {
          onData(rows as Todo[]);
        });
        return () => shape.unsubscribe();
      },
    },
  });
