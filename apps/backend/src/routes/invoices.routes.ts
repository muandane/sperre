import Elysia, { t } from "elysia";
import { db } from "@/db";
import { invoices } from "@/db/schema/invoice";
import { eq } from "drizzle-orm";
import {
	type InvoiceBody,
	InvoiceBodySchema,
	type UpdateInvoiceBody,
	convertToDBType,
} from "@/types";
import { createInvoiceWithProducts } from "@/handler/transactions";

export const invoiceRoutes = new Elysia()
	.post(
		"/invoices",
		async ({ body }: { body: InvoiceBody }) => {
			try {
				const { items, ...invoiceData } = body;
				const invoice = await createInvoiceWithProducts(invoiceData, items);
				return { success: true, data: invoice };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		{
			body: InvoiceBodySchema,
			detail: { summary: "Create invoice with products", tags: ["Invoices"] },
		},
	)

	.get(
		"/invoices",
		async () => {
			try {
				const allInvoices = await db.select().from(invoices);
				return { success: true, data: allInvoices };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		{ detail: { summary: "Get all invoices", tags: ["Invoices"] } },
	)

	.get(
		"/invoices/:id",
		async ({ params: { id } }) => {
			try {
				const invoice = await db
					.select()
					.from(invoices)
					.where(eq(invoices.id, Number.parseInt(id)))
					.limit(1);
				if (!invoice.length)
					return { success: false, error: "Invoice not found" };
				return { success: true, data: invoice[0] };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		{
			params: t.Object({
				id: t.String({ description: "Invoice ID", example: "1" }),
			}),
			detail: { summary: "Get invoice by ID", tags: ["Invoices"] },
		},
	)

	.put(
		"/invoices/:id",
		async ({
			params: { id },
			body,
		}: { params: { id: string }; body: UpdateInvoiceBody }) => {
			try {
				const updateData = { ...convertToDBType(body), updatedAt: new Date() };
				const updatedInvoice = await db
					.update(invoices)
					.set(updateData)
					.where(eq(invoices.id, Number.parseInt(id)))
					.returning();
				if (!updatedInvoice.length)
					return { success: false, error: "Invoice not found" };
				return { success: true, data: updatedInvoice[0] };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		{
			params: t.Object({
				id: t.String({ description: "Invoice ID", example: "1" }),
			}),
			body: t.Partial(InvoiceBodySchema),
			detail: { summary: "Update invoice by ID", tags: ["Invoices"] },
		},
	)

	.delete(
		"/invoices/:id",
		async ({ params: { id } }) => {
			try {
				const deletedInvoice = await db
					.delete(invoices)
					.where(eq(invoices.id, Number.parseInt(id)))
					.returning();
				if (!deletedInvoice.length)
					return { success: false, error: "Invoice not found" };
				return { success: true, data: deletedInvoice[0] };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		{
			params: t.Object({
				id: t.String({ description: "Invoice ID", example: "1" }),
			}),
			detail: { summary: "Delete invoice by ID", tags: ["Invoices"] },
		},
	);
