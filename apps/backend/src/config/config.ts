export const config = {
	connectionString: process.env.POSTGRES_CONNECTION_STRING ?? 'postgres://postgres:postgres@localhost:5432/invoice_db',
};