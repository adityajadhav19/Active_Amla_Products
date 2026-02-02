import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}