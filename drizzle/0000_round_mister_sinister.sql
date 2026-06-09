CREATE TABLE "gifts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"price" numeric(10, 2) NOT NULL,
	"product_link" text,
	"category" text,
	"is_reserved" boolean DEFAULT false NOT NULL,
	"is_purchased" boolean DEFAULT false NOT NULL,
	"reserved_by" text,
	"reserved_by_phone" text,
	"reserved_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
