import {
  pgTable,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

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

// Type exports for use in application code
export type User = typeof user.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
