import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // Ensure this is your database instance
import { account, session, user, verification } from "@/db/schema/auth";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user,
			session,
			verification,
			account,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			clientId: process.env.GOOGLE_CLIENT_ID!,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
});
