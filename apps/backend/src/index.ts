import { t, Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { db } from './db';
import { invoices, products } from './db/schema';
import { eq } from 'drizzle-orm';
import { swagger } from '@elysiajs/swagger';
import { InvoiceBodySchema , type UpdateInvoiceBody, convertToDBType, type InvoiceBody} from './types';
import { createInvoiceWithProducts } from './handler/transactions';

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: 'Invoice API Documentation',
        version: '1.0.0',
        description: 'API for managing invoices'
      }
    }
  }))
  
  // Create new product
  .post('/products', async ({ body }: { body: {
    name: string;
    description?: string;
    price: number;
    quantity: number;
  } }) => {
    try {
      const { name, description, price, quantity } = body;
      const createdProduct = await db.insert(products).values({
        name: name.toString(),
        description,
        price,
        quantity
      }).returning();
      return { success: true, data: createdProduct[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, {
    body: t.Object({
      name: t.String({
        description: 'Product name',
        example: 'Product 1'
      }),
      description: t.Optional(t.String({
        description: 'Product description',
        example: 'This is a product description'
      })),
      price: t.Number({
        description: 'Product price',
        example: 10.99
      }),
      quantity: t.Number({
        description: 'Product quantity',
        example: 10
      })
    }),
    detail: {
      summary: 'Create product',
      tags: ['Products']
    }
  })
  // Create new invoice
  .post('/invoices', async ({ body }: { body: InvoiceBody }) => {
    try {
      const { items, ...invoiceData } = body;
      const invoice = await createInvoiceWithProducts(invoiceData, items);
      return { success: true, data: invoice };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, {
      body: InvoiceBodySchema,
      detail: {
        summary: 'Create invoice with products',
        tags: ['Invoices']
      }
  })
  
  // Get all invoices
  .get('/invoices', async () => {
    try {
      const allInvoices = await db.select().from(invoices);
      return { success: true, data: allInvoices };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, {
    detail: {
      summary: 'Get all invoices',
      tags: ['Invoices']
    }
  })
  
  // Get single invoice
  .get('/invoices/:id', async ({ params: { id } }) => {
    try {
      const invoice = await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, Number.parseInt(id)))
        .limit(1);
      
      if (!invoice.length) {
        return { success: false, error: 'Invoice not found' };
      }
      
      return { success: true, data: invoice[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, {
    params: t.Object({
      id: t.String({
        description: 'Invoice ID',
        example: '1'
      })
    }),
    detail: {
      summary: 'Get invoice by ID',
      tags: ['Invoices']
    }
  })
  
 // Update invoice
  .put('/invoices/:id', async ({ params: { id }, body }: { params: { id: string }, body: UpdateInvoiceBody }) => {
    try {
      const updateData = {
        ...convertToDBType(body),
        updatedAt: new Date()
      };
      
      const updatedInvoice = await db
        .update(invoices)
        .set(updateData)
        .where(eq(invoices.id, Number.parseInt(id)))
        .returning();
      
      if (!updatedInvoice.length) {
        return { success: false, error: 'Invoice not found' };
      }
      
      return { success: true, data: updatedInvoice[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, {
    params: t.Object({
      id: t.String({
        description: 'Invoice ID',
        example: '1'
      })
    }),
    body: t.Partial(InvoiceBodySchema),
    detail: {
      summary: 'Update invoice by ID',
      tags: ['Invoices']
    }
  })
  
  // Delete invoice
  .delete('/invoices/:id', async ({ params: { id } }) => {
    try {
      const deletedInvoice = await db
        .delete(invoices)
        .where(eq(invoices.id, Number.parseInt(id)))
        .returning();
      
      if (!deletedInvoice.length) {
        return { success: false, error: 'Invoice not found' };
      }
      
      return { success: true, data: deletedInvoice[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, {
    params: t.Object({
      id: t.String({
        description: 'Invoice ID',
        example: '1'
      })
    }),
    detail: {
      summary: 'Delete invoice by ID',
      tags: ['Invoices']
    }
  })
  
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);