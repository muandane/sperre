import { t } from 'elysia';

export const InvoiceBodySchema = t.Object({
  invoiceNumber: t.String({
    description: 'Unique invoice identifier',
    example: 'INV-2024-001'
  }),
  clientName: t.String({
    description: 'Name of the client',
    example: 'John Doe'
  }),
  clientEmail: t.String({
    format: 'email',
    description: 'Email address of the client',
    example: 'john@example.com'
  }),
  amount: t.Number({
    description: 'Total amount of the invoice',
    example: 1299.99
  }),
  status: t.Optional(t.String({
    description: 'Current status of the invoice',
    example: 'pending',
    default: 'pending'
  })),
  dueDate: t.String({
    format: 'date-time',
    description: 'Due date for the invoice',
    example: '2024-01-20T00:00:00.000Z'
  }),
  items: t.Array(t.String(), {
    description: 'List of invoice items',
    example: ['Website Design - $800', 'Logo Design - $499.99']
  })
});

export type InvoiceBody = {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status?: string;
  dueDate: string;
  items: string[];
};

export type UpdateInvoiceBody = Partial<InvoiceBody>;

export const convertToDBType = (body: Partial<InvoiceBody>) => {
  // biome-ignore lint/suspicious/noExplicitAny: ignore
  const converted: Record<string, any> = {};

  if (body.amount !== undefined) {
    converted.amount = body.amount.toString();
  }
  if (body.dueDate !== undefined) {
    converted.dueDate = new Date(body.dueDate);
  }
  
  // Copy other fields without conversion
  for (const [key, value] of Object.entries(body)) {
    if (key !== 'amount' && key !== 'dueDate' && value !== undefined) {
      converted[key] = value;
    }
  }

  return converted;
};