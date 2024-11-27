import NotSignIn from "@/components/NotSignIn";
import { signIn } from "@/lib/auth";
import { providerFortyTwo } from "@/lib/auth";
import Image from "next/image";

export default function Layout() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <NotSignIn />
    </main>
  );
}
