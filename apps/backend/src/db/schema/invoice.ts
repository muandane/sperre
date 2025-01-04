import {
	pgTable,
	serial,
	varchar,
	decimal,
	timestamp,
	text,
	integer,
	index,
	uniqueIndex,
	check,
} from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth";
import { clients, organization } from "./organization";
import { sql } from "drizzle-orm";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  organizationId: integer("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  nameIdx: index("products_name_idx").on(table.name),
  orgIdx: index("products_organization_idx").on(table.organizationId),
  quantityIdx: index("products_quantity_idx").on(table.quantity),
}]);

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "set null" }),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "set null" }),
  organizationId: integer("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  description: text("description"),
  periodStart: timestamp("period_start", { mode: "date" }),
  periodEnd: timestamp("period_end", { mode: "date" }),
  validationDate: timestamp("validation_date", { mode: "date" }),
  total: decimal("total", { precision: 10, scale: 2 }).notNull().default("0"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentTerms: varchar("payment_terms", { length: 50 }),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 })
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
	statusCheck: check("status_check", sql`${table.status} IN ('pending', 'paid', 'cancelled', 'overdue')`),
  invoiceNumberIdx: uniqueIndex("invoices_number_org_idx")
    .on(table.invoiceNumber, table.organizationId),
  clientIdx: index("invoices_client_idx").on(table.clientId),
  orgIdx: index("invoices_organization_idx").on(table.organizationId),
  statusIdx: index("invoices_status_idx").on(table.status),
  dateIdx: index("invoices_date_idx").on(table.createdAt),
}]);

export const invoiceProducts = pgTable("invoice_products", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  invoiceIdx: index("invoice_products_invoice_idx").on(table.invoiceId),
  productIdx: index("invoice_products_product_idx").on(table.productId),
}]);
