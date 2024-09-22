import { signIn } from "@/lib/auth";
import { providerFortyTwo } from "@/lib/auth";
import Image from "next/image";

export default function Layout() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <form
        action={async () => {
          "use server";
          await signIn(providerFortyTwo.id, {
            redirectTo: "/dashboard",
          });
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-6 font-bold bg-white text-black px-4 py-1 rounded"
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
            width={40}
            height={40}
            alt="42"
          />
          Sign in with 42
        </button>
      </form>
    </main>
  );
}
