'use client'

import { signIn } from "../lib/auth-client"

export default function SignIn(){

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem"}}>
      <button type="button" onClick={ async () => {
        await signIn.social({
          provider: "github"
        })
      }}>
        Sign In with github
      </button>
      <button type="button" onClick={ async () => {
        await signIn.social({
          provider: "google"
        })
      }}>
        Sign In with google
      </button>
    </div>
  )

}