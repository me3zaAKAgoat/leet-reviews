import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default function Page() {
  const session = auth();
  if (!session) redirect("/signin");
  else redirect("/dashboard");
}
