import { t, Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { db } from './db';
import { invoices } from './db/schema';
import { eq } from 'drizzle-orm';
import { swagger } from '@elysiajs/swagger';
import { InvoiceBodySchema, type InvoiceBody, type UpdateInvoiceBody, convertToDBType} from './types';

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Invoice API is running')
  .use(swagger({
    documentation: {
      info: {
        title: 'Invoice API Documentation',
        version: '1.0.0',
        description: 'API for managing invoices'
      }
    }
  }))
  // Create new invoice
  .post('/invoices', async ({ body }: { body: InvoiceBody }) => {
    try {
      const invoiceData = {
        ...body,
        amount: body.amount.toString(), // Convert number to string for database
        dueDate: new Date(body.dueDate), // Convert string to Date
      };
      const newInvoice = await db.insert(invoices).values(invoiceData).returning();
      return { success: true, data: newInvoice[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },{
    body: InvoiceBodySchema,
    detail: {
      summary: 'Create a new invoice',
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