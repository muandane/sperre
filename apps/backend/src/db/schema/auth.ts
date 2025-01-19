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
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  emailIdx: uniqueIndex("user_email_idx").on(table.email),
  nameCreatedIdx: index("user_name_created_idx").on(table.name, table.createdAt),
}]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (table) => [{
  tokenIdx: uniqueIndex("session_token_idx").on(table.token),
  userIdIdx: index("session_user_id_idx").on(table.userId),
  expiresAtIdx: index("session_expires_at_idx").on(table.expiresAt),
}]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
}, (table) => [{
  providerAccountIdx: uniqueIndex("account_provider_account_idx")
    .on(table.providerId, table.accountId),
  userIdIdx: index("account_user_id_idx").on(table.userId),
}]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [{
  identifierValueIdx: uniqueIndex("verification_identifier_value_idx")
    .on(table.identifier, table.value),
  expiresAtIdx: index("verification_expires_at_idx").on(table.expiresAt),
}]);

export const passkey = pgTable("passkey", {
	id: text("id").primaryKey(),
	name: text("name"),
	publicKey: text("public_key").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	credentialID: text("credential_i_d").notNull(),
	counter: integer("counter").notNull(),
	deviceType: text("device_type").notNull(),
	backedUp: boolean("backed_up").notNull(),
	transports: text("transports"),
	createdAt: timestamp("created_at"),
});
