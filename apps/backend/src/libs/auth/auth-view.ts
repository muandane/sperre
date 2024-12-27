import type { Context } from "elysia";
import { auth } from "./auth";

const betterAuthView = async (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET", "OPTIONS"];
  const { method, url} = context.request;

  // Log the incoming request details
  console.log(`[betterAuthView] Incoming request: ${method} ${url}`);

  if (BETTER_AUTH_ACCEPT_METHODS.includes(method)) {
    const clonedRequest = context.request.clone();

    try {
      const body = await clonedRequest.json();
      console.log(`[betterAuthView] Request body: ${JSON.stringify(body)}`);

      const newRequest = new Request(clonedRequest.url, {
        method: clonedRequest.method,
        headers: clonedRequest.headers,
        body: JSON.stringify(body),
      });

      return auth.handler(newRequest);
    } catch (error) {
      if (error.name === "SyntaxError" && error.message.includes("Unexpected end of JSON input")) {
        console.warn(`[betterAuthView] Ignoring SyntaxError: ${error.message}`);
        return auth.handler(clonedRequest);
      }

      console.error(`[betterAuthView] Error parsing JSON body: ${error.message}`);
      context.error(400, "Invalid JSON body");
      return;
    }
  }

  console.warn(`[betterAuthView] Method not allowed: ${method}`);
  context.error(405, "Method Not Allowed");
};

export default betterAuthView;
