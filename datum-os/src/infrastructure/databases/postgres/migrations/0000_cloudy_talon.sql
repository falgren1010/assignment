CREATE TABLE "file_details" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_name" text NOT NULL,
	"storage_path" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"mime_type" text NOT NULL,
	"geometry" jsonb,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"data_base64" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "material_prices" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"material_code" text NOT NULL,
	"material_price" numeric NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_to" timestamp
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"price" numeric NOT NULL,
	"lead_time" integer NOT NULL,
	"properties" jsonb NOT NULL,
	"available" boolean NOT NULL,
	CONSTRAINT "materials_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_id" varchar(36) NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_company" text,
	"payment_method" text NOT NULL,
	"payment_status" text NOT NULL,
	"purchase_order_file_id" varchar(36),
	"total_amount" numeric NOT NULL,
	"currency" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" varchar(36) NOT NULL,
	"material_id" varchar(36) NOT NULL,
	"material_name" text NOT NULL,
	"material_price_factor" numeric NOT NULL,
	"quantity" integer NOT NULL,
	"volume_cm3" numeric NOT NULL,
	"unit_price" numeric NOT NULL,
	"quantity_discount" numeric NOT NULL,
	"total_price" numeric NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "material_prices" ADD CONSTRAINT "material_prices_material_code_materials_code_fk" FOREIGN KEY ("material_code") REFERENCES "public"."materials"("code") ON DELETE cascade ON UPDATE no action;