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
	session: {
			expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
	},
	emailAndPassword: {
		enabled: true,
		// ? implement sendEmail function
		// requireEmailVerification: true,
    // sendVerificationEmail: async ( { user, url, token }, request) => {
    //   await sendEmail({
    //     to: user.email,
    //     subject: "Verify your email address",
    //     text: `Click the link to verify your email: ${url}`,
    //   });
    // },
		// sendResetPassword: async ({user,url,token}) => {
		// 	await sendEmail({
    //     to: user.email,
    //     subject: "Reset your password",
    //     text: `Click the link to reset your password: ${url}`,
    //   });
		// }
	},
	trustedOrigins: [process.env.BASE_URL as string, process.env.APP_URL as string],
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			redirectURI: `${process.env.BASE_URL}/api/auth/callback/google`,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			redirectURI: `${process.env.BASE_URL}/api/auth/callback/github`,
		}
	},
});
