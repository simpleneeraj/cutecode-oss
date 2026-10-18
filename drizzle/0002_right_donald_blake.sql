ALTER TABLE "users" ADD COLUMN "dodo_customer_id" text;--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "last_event_seq";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_dodo_customer_id_unique" UNIQUE("dodo_customer_id");