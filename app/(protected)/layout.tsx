import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/ui/layout/app-sidebar";
import { MobileNav } from "@/components/ui/layout/mobile-nav";
import { SignOutButton } from "@/components/ui/layout/sign-out-button";
import { InactivityHandler } from "@/components/auth/InactivityHandler";

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
    <div className="min-h-screen bg-background text-foreground">
      <InactivityHandler />
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <AppSidebar
          userName={session.user.name ?? "Usuário"}
          userEmail={session.user.email ?? ""}
          userRole={session.user.role ?? ""}
        />

        <div className="flex min-h-screen flex-col w-full min-w-0">
          {/* Barra Mobile Flutuante - Exibida apenas abaixo de LG */}
          <div className="lg:hidden sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <MobileNav
                userName={session.user.name ?? "Usuário"}
                userEmail={session.user.email ?? ""}
                userRole={session.user.role ?? ""}
                signOutButton={<SignOutButton className="w-full justify-center bg-background" />}
              />
              <span className="text-sm font-bold tracking-tight text-foreground font-heading">
                SISTEMA.OS
              </span>
            </div>
          </div>

          <main className="flex-1 px-4 py-8 md:px-10 lg:px-14">{children}</main>
        </div>
      </div>
    </div>
  );
}