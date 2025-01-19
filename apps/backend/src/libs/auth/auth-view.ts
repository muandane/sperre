import type { Context } from "elysia";
import { auth } from "./auth";

const betterAuthView = async (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET", "OPTIONS"];

  // console.log(`[betterAuthView] Incoming request: ${context.request.method} ${context.request.url}`);
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    const requestClone = context.request.clone();
    try {
      const requestBody = await requestClone.json();
      // console.log(`[betterAuthView] Request body: ${JSON.stringify(requestBody)}`);
      const newRequest = new Request(requestClone.url, {
        method: requestClone.method,
        headers: requestClone.headers,
        body: JSON.stringify(requestBody),
      });
      return auth.handler(newRequest);
    } catch (error) {
      if (error.name === "SyntaxError" && error.message.includes("Unexpected end of JSON input")) {
        // console.warn(`[betterAuthView] Ignoring SyntaxError: ${error.message}`);
        return auth.handler(requestClone);
      }
      // console.error(`Error parsing JSON body: ${error.message}`);
      context.error(400, "Invalid JSON body");
      return;
    }
  }
  // console.warn(`[betterAuthView] Method not allowed: ${method}`);
  context.error(405, "Method Not Allowed");
};

export default betterAuthView;