import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { invoiceRoutes } from "./routes/invoices.routes";
import { productsRoutes } from "./routes/products.routes";
import { logger } from "@bogeychan/elysia-logger";
import betterAuthView from "@/libs/auth/auth-view";
import { userMiddleware } from "./middlewares/auth-middleware";

const app = new Elysia()
	.use(cors({
    origin: ['http://localhost:4321'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  }))
	// .use(
	// 	logger({
	// 		transport: {
	// 			target: "pino-pretty",
	// 			options: {
	// 				colorize: true,
	// 			},
	// 		},
	// 	}),
	// )
	.use(
		swagger({
			documentation: {
				info: {
					title: "Invoice API Documentation",
					version: "1.0.0",
					description: "API for managing invoices",
				},
			},
		}),
	)
	.derive(userMiddleware)
	.all("/api/auth/*", betterAuthView)
	.use(invoiceRoutes)
	.use(productsRoutes)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
