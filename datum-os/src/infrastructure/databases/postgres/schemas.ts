import { pgTable, varchar, text, numeric, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const fileDetails = pgTable("file_details", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    originalName: text("original_name").notNull(),
    storagePath: text("storage_path").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    mimeType: text("mime_type").notNull(),
    geometry: jsonb("geometry").$type<{
        boundingBox: {
            x: number;
            y: number;
            z: number;
        };
        volume: number;
        volumeCm3: number;
        surfaceArea: number;
    } | null>(),
    uploadedAt: timestamp("uploaded_at", { withTimezone: false })
        .notNull()
        .defaultNow(),
});

export const files = pgTable("files", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    dataBase64: text("data_base64").notNull(),
});

export const materials = pgTable("materials", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    code: text("code").notNull().unique(),
    price: numeric("price").notNull(),
    leadTime: integer("lead_time").notNull(),
    properties: jsonb("properties").$type<string[]>().notNull(),
    available: boolean("available").notNull()
});

export const materialPrices = pgTable("material_prices", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    materialCode: text("material_code")
        .notNull()
        .references(() => materials.code, { onDelete: "cascade" }),
    materialPrice: numeric("material_price").notNull(),
    validFrom: timestamp("valid_from", { withTimezone: false })
        .notNull(),
    validTo: timestamp("valid_to", { withTimezone: false }),
});

export const quotes = pgTable("quotes", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    fileId: varchar("file_id", { length: 36 })
        .notNull(),
    materialId: varchar("material_id", { length: 36 }).notNull(),
    materialName: text("material_name").notNull(),
    materialPriceFactor: numeric("material_price_factor").notNull(), // €/cm³
    quantity: integer("quantity").notNull(),
    volumeCm3: numeric("volume_cm3").notNull(),
    unitPrice: numeric("unit_price").notNull(),
    quantityDiscount: numeric("quantity_discount").notNull(),
    totalPrice: numeric("total_price").notNull(),
    status: text("status", {
        enum: ["draft", "ready", "ordered", "expired"],
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: false }).notNull(),
});

export const orders = pgTable("orders", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    quoteId: varchar("quote_id", { length: 36 })
        .notNull(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerCompany: text("customer_company"),
    paymentMethod: text("payment_method", {
        enum: ["card", "purchase_order"],
    }).notNull(),
    paymentStatus: text("payment_status", {
        enum: ["pending", "paid", "failed"],
    }).notNull(),
    purchaseOrderFileId: varchar("purchase_order_file_id", { length: 36 }),
    totalAmount: numeric("total_amount").notNull(),
    currency: text("currency", {
        enum: ["EUR"],
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: false })
        .notNull()
        .defaultNow(),
});
