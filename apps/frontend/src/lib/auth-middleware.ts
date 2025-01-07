import { getSession } from "@/lib/auth-client";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	const isAuthed = await getSession({
			fetchOptions: {
				headers: context.request.headers,
			},
		})
		.catch((e) => {
			return null;
		});
	if (context.url.pathname === "/" && !isAuthed) {
		return context.redirect("/signin");
	}
	return next();
});