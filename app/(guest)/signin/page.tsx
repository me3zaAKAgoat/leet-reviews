// "use client";
// import { signIn } from "next-auth/react";
// import { signIn } from "@/lib/auth";
import { signIn } from "@/lib/auth";
import { providerMap } from "@/lib/auth";

export default function Layout() {
  return (
    <main>
      <h1>Log in</h1>
      {Object.values(providerMap).map((provider) => (
        <form
          action={async () => {
            "use server";
            try {
              await signIn(provider.id, {
                redirectTo: "/dashboard",
              });
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              //   if (error instanceof AuthError) {
              //     return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
              //   }

              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error;
            }
          }}
        >
          <button type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
    </main>
  );
}
