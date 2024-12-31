import { Elysia, t } from "elysia";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { products } from "@/db/schema/invoice";

export const productsRoutes = new Elysia()
	.post(
		"/products",
		async ({
			body,
		}: {
			body: {
				name: string;
				description?: string;
				price: number;
				quantity: number;
			};
		}) => {
			try {
				const { name, description, price, quantity } = body;
				const createdProduct = await db
					.insert(products)
					.values({
						name: name.toString(),
						description,
						price: price.toString(),
						quantity,
					})
					.returning();
				return { success: true, data: createdProduct[0] };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		{
			body: t.Object({
				name: t.String(),
				description: t.Optional(t.String()),
				price: t.Number(),
				quantity: t.Number(),
			}),
			detail: { summary: "Create product", tags: ["Products"] },
		},
	)
	.get(
		"/products",
		async () => {
			try {
				const allProducts = await db.select().from(products);
				return { success: true, data: allProducts };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		{ detail: { summary: "Get all products", tags: ["Products"] } },
	)
	.get(
		"/products/:id",
		async ({ params: { id } }) => {
			try {
				const product = await db
					.select()
					.from(products)
					.where(eq(products.id, Number.parseInt(id)))
					.limit(1);
				if (!product.length)
					return { success: false, error: "Product not found" };
				return { success: true, data: product[0] };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		{
			params: t.Object({
				id: t.String({ description: "Product ID", example: "1" }),
			}),
			detail: { summary: "Get product by ID", tags: ["Products"] },
		},
	)
	.delete(
		"/products/:id",
		async ({ params: { id } }) => {
			try {
				const deletedProduct = await db
					.delete(products)
					.where(eq(products.id, Number.parseInt(id)))
					.returning();
				if (!deletedProduct.length)
					return { success: false, error: "Product not found" };
				return { success: true, data: deletedProduct[0] };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		{
			params: t.Object({
				id: t.String({ description: "Product ID", example: "1" }),
			}),
			detail: { summary: "Delete product by ID", tags: ["Products"] },
		},
	);
