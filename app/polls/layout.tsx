import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getSession } from "@/lib/auth/client/get-session";
import { redirect } from "next/navigation";

export default async function PollsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  return <DashboardLayout user={session.user}>{children}</DashboardLayout>;
}
