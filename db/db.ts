import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"

export const sql = postgres(process.env.DB_URL as string, { max: 1 })
export const db = drizzle(sql, {schema});
