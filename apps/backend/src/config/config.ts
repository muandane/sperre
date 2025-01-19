export const config = {
	connectionString:
		process.env.POSTGRES_CONNECTION_STRING ??
		"postgres://postgres:postgres@localhost:5432/invoice_db",
	corsOrigins: process.env.CORS_ORIGINS?.split(",") ?? ["http://localhost:4321"],
};
