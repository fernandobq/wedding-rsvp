import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzle<typeof schema>>;

// Lazily create the connection on first use. This keeps the build from
// evaluating neon() at import time (when DATABASE_URL may be a placeholder)
// and avoids opening a connection until a request actually needs it.
let cached: DB | undefined;

function getDb(): DB {
  if (!cached) {
    const sql = neon(process.env.DATABASE_URL!);
    cached = drizzle(sql, { schema });
  }
  return cached;
}

export const db = new Proxy({} as DB, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof DB];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
