import { pgTable, serial, varchar, decimal, timestamp, text, integer } from 'drizzle-orm/pg-core';

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  description: text('description'),
  type: varchar('type', { length: 10 }).notNull().default('allow'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const rolePermissions = pgTable('role_permissions', {
  id: serial('id').primaryKey(),
  roleId: integer('role_id').references(() => roles.id).notNull(),
  permissionId: integer('permission_id').references(() => permissions.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});


export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  roleId: integer('role_id').references(() => roles.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatar: text('avatar'),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  nis: varchar('nis', { length: 50 }),
  nif: varchar('nif', { length: 50 }),
  ai: varchar('ai', { length: 50 }),
  rc: varchar('rc', { length: 50 }),
  rib: varchar('rib', { length: 50 }),
  organizationId: integer('organization_id').references(() => organization.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  organizationId: integer('organization_id').references(() => organization.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
  clientId: integer('client_id').references(() => clients.id),
  organizationId: integer('organization_id').references(() => organization.id), 
  description: text('description'),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  validationDate: timestamp('validation_date'),
  total: decimal('total', { precision: 10, scale: 2 }).default('0'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentTerms: varchar('payment_terms', { length: 50 }),
  discount: decimal('discount', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 20 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const invoiceProducts = pgTable('invoice_products', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 5, scale: 2 }).default('0'),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const organization = pgTable('organization', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  address: text('address'),
  nif: varchar('nif', { length: 50 }),
  nis: varchar('nis', { length: 50 }),
  rc: varchar('rc', { length: 50 }),
  rib: varchar('rib', { length: 50 }),
  ai: varchar('ai', { length: 50 }),
  invoiceSequence: integer('invoice_sequence').default(0),
  quotationSequence: integer('quotation_sequence').default(0),
  purchaseOrderSequence: integer('purchase_order_sequence').default(0),
  receiptSequence: integer('receipt_sequence').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const userOrganizations = pgTable('user_organizations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  organizationId: integer('organization_id').references(() => organization.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
