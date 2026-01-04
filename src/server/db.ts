import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/postgres";

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });

// Helper to measure query time
export async function withTiming<T>(
  fn: () => Promise<T>
): Promise<{ data: T; queryTimeMs: number }> {
  const start = performance.now();
  const data = await fn();
  const queryTimeMs = Math.round((performance.now() - start) * 100) / 100;
  return { data, queryTimeMs };
}
