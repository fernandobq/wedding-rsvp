import { pgTable, pgEnum, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const responseEnum = pgEnum("response", ["yes", "no"]);

export const guests = pgTable("guests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  maxGuests: integer("max_guests").notNull().default(1),
  response: responseEnum("response"), // null = not answered yet
  partySize: integer("party_size"),
  dietary: text("dietary"),
  notes: text("notes"),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Guest = typeof guests.$inferSelect;
