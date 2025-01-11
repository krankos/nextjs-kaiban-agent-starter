import { pgTable, serial, text, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";

export const runs = pgTable("runs", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  output: text("output"),
  logs: jsonb("logs"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const logEvents = pgTable("log_events", {
  id: serial("id").primaryKey(),
  runId: serial("run_id").references(() => runs.id),
  task: text("task").notNull(),
  agent: text("agent").notNull(),
  status: text("status").notNull(),
  step: text("step"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

export type LogEvent = typeof logEvents.$inferSelect;
export type Run = typeof runs.$inferSelect; 