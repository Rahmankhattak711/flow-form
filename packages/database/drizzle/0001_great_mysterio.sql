ALTER TABLE "forms" ADD COLUMN "payment_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "payment_amount" integer;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "payment_currency" text DEFAULT 'usd' NOT NULL;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "payment_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "payment_session_id" text;