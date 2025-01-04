import { sql } from "drizzle-orm";
import {  pgTable, integer , serial, varchar, text, timestamp, check, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).unique().notNull(),
  description: text("description"),
  type: varchar("type", { length: 10 })
    .notNull()
    .default("allow"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  typeConstraint: check("type_check", sql`${table.type} IN ('allow', 'deny')`),
  nameIdx: uniqueIndex("permissions_name_idx").on(table.name),
}]);

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  nameIdx: uniqueIndex("roles_name_idx").on(table.name),
}]);

export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id")
    .references(() => roles.id, { onDelete: "cascade" })
    .notNull(),
  permissionId: integer("permission_id")
    .references(() => permissions.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  rolePermissionIdx: uniqueIndex("role_permissions_role_permission_idx")
    .on(table.roleId, table.permissionId),
}]);

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  roleId: integer("role_id")
    .references(() => roles.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  userRoleIdx: uniqueIndex("user_roles_user_role_idx").on(table.userId, table.roleId),
}]);
