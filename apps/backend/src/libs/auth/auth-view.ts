import type { Context } from "elysia";
import { auth } from "./auth";

const betterAuthView = async (context: Context) => {
	const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
	if (!BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    context.error(405,"Method Not Allowed");
    return;
  }

	try {
    const response = await auth.handler(context.request);
    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    context.error(500,"Internal Server Error");
  }

};

export default betterAuthView;
