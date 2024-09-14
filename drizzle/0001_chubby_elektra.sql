ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "external_user_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_external_user_id_unique" UNIQUE("external_user_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");