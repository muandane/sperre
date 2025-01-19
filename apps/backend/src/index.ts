import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { invoiceRoutes } from "./routes/invoices.routes";
import { productsRoutes } from "./routes/products.routes";
import betterAuthView from "@/libs/auth/auth-view";
import { userMiddleware } from "@/libs/auth/auth-middleware";
import { config } from "./config/config";

const app = new Elysia()
	.use(cors({
    origin: config.corsOrigins,
    credentials: true
  }))
	.derive(({ request }) => userMiddleware(request))
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
	.all("/api/auth/*", betterAuthView)
	.use(invoiceRoutes)
	.use(productsRoutes)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
