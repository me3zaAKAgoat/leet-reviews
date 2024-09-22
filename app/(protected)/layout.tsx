import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/signin");
  console.log(session);

  return (
    <>
      <header className="flex items-center justify-between p-4">
        <Link href="/">
          <Image src="/logo.png" width={24} height={24} alt="home" />
        </Link>
        <div className="flex items-center gap-4">
          <Button className="font-bold">Add A Review</Button>
          <Avatar>
            <AvatarImage
              src={session.user?.image ?? undefined}
              alt={session.user?.name ?? undefined}
            />
            <AvatarFallback>{session.user?.name}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      {children}
    </>
  );
}
