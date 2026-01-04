CREATE TABLE "activity_summary" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"cusip" text,
	"ticker" text,
	"quarter" text NOT NULL,
	"opened" integer DEFAULT 0,
	"closed" integer DEFAULT 0,
	"added" integer DEFAULT 0,
	"reduced" integer DEFAULT 0,
	"held" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"cusip" text NOT NULL,
	"name" text NOT NULL,
	"sector" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assets_code_unique" UNIQUE("code"),
	CONSTRAINT "assets_cusip_unique" UNIQUE("cusip")
);
--> statement-breakpoint
CREATE TABLE "cik_quarterly" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"cik" text NOT NULL,
	"quarter" text NOT NULL,
	"quarter_end_date" date,
	"total_value" numeric(20, 2),
	"total_value_prc_chg" numeric(10, 4),
	"num_assets" integer
);
--> statement-breakpoint
CREATE TABLE "drilldown_activity" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"cusip" text NOT NULL,
	"ticker" text NOT NULL,
	"quarter" text NOT NULL,
	"cik" text NOT NULL,
	"cik_name" text,
	"action" text,
	"shares" numeric(20, 0),
	"value" numeric(20, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "action_check" CHECK ("drilldown_activity"."action" IN ('open', 'add', 'reduce', 'close', 'hold'))
);
--> statement-breakpoint
CREATE TABLE "investor_flow" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"ticker" text NOT NULL,
	"quarter" text NOT NULL,
	"inflow" numeric(20, 2),
	"outflow" numeric(20, 2)
);
--> statement-breakpoint
CREATE TABLE "searches" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	CONSTRAINT "category_check" CHECK ("searches"."category" IN ('assets', 'superinvestors'))
);
--> statement-breakpoint
CREATE TABLE "superinvestors" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"cik" text NOT NULL,
	"name" text NOT NULL,
	"ticker" text,
	"active_periods" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "superinvestors_cik_unique" UNIQUE("cik")
);
--> statement-breakpoint
CREATE INDEX "idx_activity_summary_cusip" ON "activity_summary" USING btree ("cusip");--> statement-breakpoint
CREATE INDEX "idx_activity_summary_quarter" ON "activity_summary" USING btree ("quarter");--> statement-breakpoint
CREATE INDEX "idx_activity_summary_ticker" ON "activity_summary" USING btree ("ticker");--> statement-breakpoint
CREATE INDEX "idx_assets_code" ON "assets" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_assets_cusip" ON "assets" USING btree ("cusip");--> statement-breakpoint
CREATE INDEX "idx_assets_name" ON "assets" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_cik_quarterly_cik" ON "cik_quarterly" USING btree ("cik");--> statement-breakpoint
CREATE INDEX "idx_cik_quarterly_quarter" ON "cik_quarterly" USING btree ("quarter");--> statement-breakpoint
CREATE INDEX "idx_drilldown_cusip" ON "drilldown_activity" USING btree ("cusip");--> statement-breakpoint
CREATE INDEX "idx_drilldown_quarter" ON "drilldown_activity" USING btree ("quarter");--> statement-breakpoint
CREATE INDEX "idx_drilldown_cik" ON "drilldown_activity" USING btree ("cik");--> statement-breakpoint
CREATE INDEX "idx_drilldown_cusip_quarter" ON "drilldown_activity" USING btree ("cusip","quarter");--> statement-breakpoint
CREATE INDEX "idx_investor_flow_ticker" ON "investor_flow" USING btree ("ticker");--> statement-breakpoint
CREATE INDEX "idx_investor_flow_quarter" ON "investor_flow" USING btree ("quarter");--> statement-breakpoint
CREATE INDEX "idx_searches_code" ON "searches" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_searches_name" ON "searches" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_searches_category" ON "searches" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_superinvestors_cik" ON "superinvestors" USING btree ("cik");--> statement-breakpoint
CREATE INDEX "idx_superinvestors_name" ON "superinvestors" USING btree ("name");