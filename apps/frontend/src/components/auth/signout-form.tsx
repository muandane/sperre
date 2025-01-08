import { useEffect } from 'react';
import { signOut } from "@/lib/auth-client";

export function SignOutForm() {
  useEffect(() => {
    const performSignOut = async () => {
      try {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = "/signin";
            },
          },
        });
      } catch (error) {
        console.error('Signout error:', error);
        const container = document.getElementById('signout-container');
        if (container) {
          container.innerHTML = `
            <p class="text-lg text-red-600">Error signing out</p>
            <p class="text-sm text-gray-600">Please try again</p>
            <button 
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onclick="window.location.reload()"
            >
              Retry
            </button>
          `;
        }
      }
    };

    performSignOut();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]" id="signout-container">
      <p className="text-lg">Signing you out...</p>
      <p className="text-sm text-gray-600">You will be redirected shortly.</p>
    </div>
  );
}