import { createAuthClient } from "better-auth/react"

export const { signIn, signOut, signUp, useSession } =  createAuthClient({
  baseURL: `${import.meta.env.PUBLIC_API_URL}`,
  credentials: "include",
  trustedOrigins: [import.meta.env.PUBLIC_BASE_URL, import.meta.env.PUBLIC_API_URL],
})
