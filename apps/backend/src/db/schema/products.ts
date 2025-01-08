import {
	pgTable,
	serial,
	varchar,
	decimal,
	timestamp,
	text,
	integer,
	index,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";

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