import { index, integer, pgTable, primaryKey, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth";

export const organization = pgTable("organization", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  nif: varchar("nif", { length: 50 }).unique(),
  nis: varchar("nis", { length: 50 }).unique(),
  rc: varchar("rc", { length: 50 }).unique(),
  rib: varchar("rib", { length: 50 }).unique(),
  ai: varchar("ai", { length: 50 }).unique(),
  invoiceSequence: integer("invoice_sequence").notNull().default(0),
  quotationSequence: integer("quotation_sequence").notNull().default(0),
  purchaseOrderSequence: integer("purchase_order_sequence").notNull().default(0),
  receiptSequence: integer("receipt_sequence").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  nameIdx: uniqueIndex("organization_name_idx").on(table.name),
  nifIdx: uniqueIndex("organization_nif_idx").on(table.nif),
  nisIdx: uniqueIndex("organization_nis_idx").on(table.nis),
	rcIdx: uniqueIndex("organization_rc_idx").on(table.rc),
	ribIdx: uniqueIndex("organization_rib_idx").on(table.rib),
	aiIdx: uniqueIndex("organization_ai_idx").on(table.ai),
}]);

export const userOrganizations = pgTable("user_organizations", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  organizationId: integer("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  userOrgIdx: uniqueIndex("user_organizations_user_org_idx")
    .on(table.userId, table.organizationId),
}]);

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  nis: varchar("nis", { length: 50 }),
  nif: varchar("nif", { length: 50 }),
  ai: varchar("ai", { length: 50 }),
  rc: varchar("rc", { length: 50 }),
  rib: varchar("rib", { length: 50 }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  nameIdx: index("clients_name_idx").on(table.name),
}]);

// Junction table to handle many-to-many relationship
export const clientOrganizations = pgTable("client_organizations", {
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  organizationId: integer("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  pk: primaryKey({ columns: [table.clientId, table.organizationId] }),
  clientIdx: index("client_organizations_client_idx").on(table.clientId),
  orgIdx: index("client_organizations_organization_idx").on(table.organizationId),
}]);