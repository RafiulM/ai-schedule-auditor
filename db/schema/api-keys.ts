import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

// API Keys table for storing user API keys with proper security
export const apiKey = pgTable("api_key", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // User-defined key name for identification
    hashedKey: text("hashed_key").notNull(), // SHA-256 hashed version of the key
    keyPrefix: text("key_prefix").notNull(), // First 8 characters for identification (e.g., "sk_12345678")
    lastFourChars: text("last_four_chars").notNull(), // Last 4 characters for user identification
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    expiresAt: timestamp("expires_at"), // Optional expiration date
}, (table) => ({
    // Index on userId for efficient queries
    userIdIdx: index("api_key_user_id_idx").on(table.userId),
}));

// Types for TypeScript
export type ApiKey = typeof apiKey.$inferSelect;
export type NewApiKey = typeof apiKey.$inferInsert;