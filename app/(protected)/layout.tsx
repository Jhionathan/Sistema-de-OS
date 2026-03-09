import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/ui/layout/app-sidebar";
import { AppHeader } from "@/components/ui/layout/app.header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <AppSidebar
          userName={session.user.name ?? "Usuário"}
          userEmail={session.user.email ?? ""}
          userRole={session.user.role ?? ""}
        />

        <div className="flex min-h-screen flex-col">
          <AppHeader
            userName={session.user.name ?? "Usuário"}
            userRole={session.user.role ?? ""}
          />

          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}