import { useEffect } from 'react'
import { useSession } from "@/lib/auth-client"

export function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data: session, isPending } = useSession()
  
  useEffect(() => {
    if (!isPending && !session) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
    }
  }, [session, isPending])

  if (isPending) {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function WrappedComponent(props: T) {
    return (
      <AuthGuard>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

export function useAuth() {
  const { data: session, isPending, error } = useSession()
  
  return {
    isAuthenticated: !!session,
    user: session?.user,
    isPending,
    error
  }
}