CREATE TYPE "public"."response" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"max_guests" integer DEFAULT 1 NOT NULL,
	"response" "response",
	"party_size" integer,
	"dietary" text,
	"notes" text,
	"responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
