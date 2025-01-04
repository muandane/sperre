import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
	uniqueIndex,
	index,
	varchar,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  emailIdx: uniqueIndex("user_email_idx").on(table.email),
  nameCreatedIdx: index("user_name_created_idx").on(table.name, table.createdAt),
}]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: varchar("userAgent", { length: 255 }),
  organizationId: integer("organizationId").references(() => organization.id, { 
    onDelete: "cascade" 
  }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (table) => [{
  tokenIdx: uniqueIndex("session_token_idx").on(table.token),
  userIdIdx: index("session_user_id_idx").on(table.userId),
  organizationIdIdx: index("session_organization_id_idx").on(table.organizationId),
  expiresAtIdx: index("session_expires_at_idx").on(table.expiresAt),
}]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date" }),
  scope: varchar("scope", { length: 255 }),
  password: text("password"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  providerAccountIdx: uniqueIndex("account_provider_account_idx")
    .on(table.providerId, table.accountId),
  userIdIdx: index("account_user_id_idx").on(table.userId),
}]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  identifierValueIdx: uniqueIndex("verification_identifier_value_idx")
    .on(table.identifier, table.value),
  expiresAtIdx: index("verification_expires_at_idx").on(table.expiresAt),
}]);