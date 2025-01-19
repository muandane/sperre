import { auth } from "@/libs/auth/auth";

// user middleware (compute user and session and pass to routes)
export const userMiddleware = async (request: Request) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return {
      user: null,
      session: null
    }
  }
  return {
    user: session.user,
    session: session.session
  }
}