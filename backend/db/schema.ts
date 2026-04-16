import { sql } from "drizzle-orm";
import {
  uuid,
  pgTable,
  varchar,
  text,
  timestamp,
  check,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    displayname: text("displayname"),
    status: text("status").notNull().default("ONLINE"),
    statusEmote: text("status_emote"),
    badges: varchar("badges")
      .array()
      .notNull()
      .default(sql`array[]::varchar[]`),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    statusCheck: check(
      "status_check",
      sql`${table.status} IN ('ONLINE', 'UNAVAILABLE', 'OFFLINE')`,
    ),
  }),
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at"),
  },
  (table) => ({
    // Helps fetch all messages by a specific user quickly
    authorIdx: index("author_idx").on(table.authorId),
  }),
);

export const reactions = pgTable(
  "reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    emoteUrl: text("emote_url").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    // This index makes it impossible for one user to spam the same emote on one message
    uniqueReaction: uniqueIndex("unique_reaction_idx").on(
      table.messageId,
      table.userId,
      table.emoteUrl,
    ),
    // Helps fetch all reactions for a specific message quickly
    messageIdx: index("message_idx").on(table.messageId),
  }),
);
