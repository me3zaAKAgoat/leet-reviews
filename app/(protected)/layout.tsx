import { ReviewModalComponent } from "@/components/review-modal";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, signOut } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CompanyType } from "@/lib/types";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/signin");
  let companies: CompanyType[] = [];
  let hasError = false;
  try {
    companies = await prisma.company.findMany();
  } catch (e) {
    hasError = true;
    console.error(e);
  }
  return (
    <>
      <header className="flex items-center justify-between p-4">
        <Link href="/">
          {/* <Image src="/logo.png" width={24} height={24} alt="home" /> */}
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {" "}
            Leet Reviews
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Toaster />
          <ReviewModalComponent companies={companies} hasError={hasError} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={session.user?.image ?? undefined}
                  alt={session.user?.name ?? undefined}
                />
                <AvatarFallback>{session.user?.name}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
                className="w-full"
              >
                <DropdownMenuItem>
                  <button>Sign Out</button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {children}
    </>
  );
}
