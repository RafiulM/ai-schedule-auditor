CREATE TABLE "event_type_enum" (
	"name" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
INSERT INTO "event_type_enum" (name) VALUES
	('meeting'),
	('work'),
	('focus'),
	('break'),
	('exercise'),
	('meal'),
	('personal'),
	('other');
--> statement-breakpoint
CREATE TABLE "event" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"date" date NOT NULL,
	"type" text NOT NULL DEFAULT 'other',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "event_type_enum" CHECK ((type IN ('meeting', 'work', 'focus', 'break', 'exercise', 'meal', 'personal', 'other')))
);
--> statement-breakpoint
CREATE TABLE "chat_message" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL,
	"role" text NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_insight" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"insight" text NOT NULL,
	"insight_type" text NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_insight" ADD CONSTRAINT "ai_insight_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_user_id_idx" ON "event" ("user_id");--> statement-breakpoint
CREATE INDEX "event_date_idx" ON "event" ("date");--> statement-breakpoint
CREATE INDEX "chat_message_user_id_idx" ON "chat_message" ("user_id");--> statement-breakpoint
CREATE INDEX "chat_message_timestamp_idx" ON "chat_message" ("timestamp");--> statement-breakpoint
CREATE INDEX "ai_insight_user_id_idx" ON "ai_insight" ("user_id");--> statement-breakpoint
CREATE INDEX "ai_insight_date_idx" ON "ai_insight" ("date");