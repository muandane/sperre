import { t } from "elysia";

export const InvoiceProductSchema = t.Object({
	productId: t.Number({
		description: "Product ID",
		example: 1,
	}),
	quantity: t.Number({
		description: "Product quantity",
		example: 2,
	}),
	price: t.Optional(
		t.Number({
			description: "Product price",
			format: "decimal",
			example: 10.99,
		}),
	),
	discount: t.Optional(
		t.Number({
			description: "Product discount percentage",
			format: "decimal",
			example: 10.5,
		}),
	),
	name: t.Optional(
		t.String({
			description: "Product name",
			example: "Product 1",
		}),
	),
});

export const InvoiceBodySchema = t.Object({
	invoiceNumber: t.String({
		description: "Invoice number",
		format: "uuid",
		example: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
	}),
	clientName: t.String({
		description: "Client name",
		example: "John Doe",
	}),
	clientEmail: t.String({
		description: "Client email",
		format: "email",
		example: "john.doe@example.com",
	}),
	amount: t.Number({
		description: "Invoice amount",
		example: 100.99,
	}),
	status: t.Optional(
		t.String({
			description: "Invoice status",
			enum: ["pending", "paid", "canceled"],
			example: "pending",
		}),
	),
	dueDate: t.String({
		description: "Due date",
		format: "date-time",
		example: "2023-03-15T00:00:00.000Z",
	}),
	items: t.Array(InvoiceProductSchema),
});

export const CreateInvoiceSchema = t.Object({
	...InvoiceBodySchema.properties,
	products: t.Array(InvoiceProductSchema),
});