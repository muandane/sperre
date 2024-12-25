import { db } from '../db';
import { invoices, invoiceProducts, products } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { InvoiceBody } from '../types';

interface InvoiceProduct {
  productId: number;
  quantity: number;
  price?: number;
  discount?: number;
  name?: string;
}

export async function createInvoiceWithProducts(
  invoiceData: Omit<InvoiceBody, 'items'>, 
  productsData: InvoiceBody['items']
) {
  return await db.transaction(async (transaction) => {
    const [createdInvoice] = await transaction
      .insert(invoices)
      .values({ ...invoiceData, total: '0' })
      .returning();

    let totalAmount = 0;

    for (const item of productsData) {
      const [fetchedProduct] = await transaction
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (!fetchedProduct) {
        throw new Error(`Product with id ${item.productId} not found`);
      }

      const productPrice = item.price ?? Number(fetchedProduct.price);
      const productName = item.name ?? fetchedProduct.name;
      const productDiscount = item.discount ?? 0;

      await transaction.insert(invoiceProducts).values({
        price: productPrice.toString(),
        quantity: item.quantity,
        name: productName,
        discount: productDiscount.toString(),
        productId: item.productId,
        invoiceId: createdInvoice.id
      });

      totalAmount += item.quantity * productPrice * (1 - productDiscount / 100);
    }

    const [updatedInvoice] = await transaction
      .update(invoices)
      .set({ total: totalAmount.toString() })
      .where(eq(invoices.id, createdInvoice.id))
      .returning();

    return updatedInvoice;
  });
}
