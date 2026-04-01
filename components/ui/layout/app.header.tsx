import { Calendar } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { SignOutButton } from "./sign-out-button";

type AppHeaderProps = {
  userName: string;
  userEmail: string;
  userRole: string;
};

const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  TECHNICIAN: "Técnico",
  CUSTOMER: "Cliente",
};

export function AppHeader({ userName, userEmail, userRole }: AppHeaderProps) {
  const today = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex flex-col gap-3 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MobileNav 
              userName={userName} 
              userEmail={userEmail} 
              userRole={userRole} 
              signOutButton={<SignOutButton className="w-full justify-center bg-background" />}
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold font-heading tracking-tight text-foreground">
                Visão Geral
              </h1>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="capitalize">{today}</span>
              </div>
            </div>
            {/* Título simples no mobile */}
            <div className="sm:hidden">
              <h1 className="text-lg font-bold font-heading tracking-tight text-foreground">
                SISTEMA.OS
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex flex-col rounded-xl border border-border/50 bg-secondary/20 px-4 py-2 text-right transition-colors hover:bg-secondary/40 cursor-default">
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {roleLabelMap[userRole] ?? userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}