import { pgTable, text, timestamp, date, uuid, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Enum for event types
export const eventTypeEnum = pgEnum("event_type", [
    "meeting",
    "work",
    "focus",
    "break",
    "exercise",
    "meal",
    "personal",
    "other",
]);

// Events table for storing user schedule events
export const event = pgTable("event", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    date: date("date").notNull(),
    type: eventTypeEnum("type").notNull().default("other"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
});

// Chat messages table for storing conversation history
export const chatMessage = pgTable("chat_message", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    role: text("role").notNull(), // 'user' or 'assistant'
    timestamp: timestamp("timestamp")
        .$defaultFn(() => new Date())
        .notNull(),
});

// AI insights table for storing AI analysis and recommendations
export const aiInsight = pgTable("ai_insight", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    insight: text("insight").notNull(),
    insightType: text("insight_type").notNull(), // 'schedule_optimization', 'time_audit', 'productivity_tip'
    date: date("date").notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
});

// Types for TypeScript
export type Event = typeof event.$inferSelect;
export type NewEvent = typeof event.$inferInsert;
export type ChatMessage = typeof chatMessage.$inferSelect;
export type NewChatMessage = typeof chatMessage.$inferInsert;
export type AiInsight = typeof aiInsight.$inferSelect;
export type NewAiInsight = typeof aiInsight.$inferInsert;