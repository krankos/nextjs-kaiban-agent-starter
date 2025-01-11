CREATE TABLE "log_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"run_id" serial NOT NULL,
	"task" text NOT NULL,
	"agent" text NOT NULL,
	"status" text NOT NULL,
	"step" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"output" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "log_events" ADD CONSTRAINT "log_events_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE no action ON UPDATE no action;