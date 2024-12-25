import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { invoiceRoutes } from './routes/invoices.routes';
import { productsRoutes } from './routes/products.routes';

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
  .use(invoiceRoutes)
  .use(productsRoutes)
  
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);