import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarNavLink } from "./sidebar-nav-link";
import { SignOutButton } from "./sign-out-button";
import { canManageMasterData } from "@/lib/permissions";
import { ShieldCheck, UserCircle } from "lucide-react";

type AppSidebarProps = {
  userName: string;
  userEmail: string;
  userRole: string;
};

const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  TECHNICIAN: "Técnico",
};

export function AppSidebar({
  userName,
  userEmail,
  userRole,
}: AppSidebarProps) {
  return (
    <aside className="hidden border-r border-border bg-card/60 backdrop-blur-lg lg:flex lg:flex-col shadow-sm">
      <div className="border-b border-border px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-foreground font-heading">
              SISTEMA<span className="text-primary/80">.OS</span>
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Controle Operacional
            </div>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 py-6">
        <nav className="space-y-1.5">
          <SidebarNavLink href="/dashboard" icon="dashboard">
            Dashboard
          </SidebarNavLink>

          {canManageMasterData(userRole) ? (
            <>
              <SidebarNavLink href="/customers" icon="customers">
                Clientes
              </SidebarNavLink>

              <SidebarNavLink href="/units" icon="units">
                Unidades
              </SidebarNavLink>

              <SidebarNavLink href="/equipment" icon="equipment">
                Equipamentos
              </SidebarNavLink>

              <SidebarNavLink href="/technicians" icon="technicians">
                Técnicos
              </SidebarNavLink>
              
              <SidebarNavLink href="/users" icon="users">
                Usuários
              </SidebarNavLink>
            </>
          ) : null}

          <SidebarNavLink href="/visits" icon="visits">
            Visitas
          </SidebarNavLink>
        </nav>
      </div>

      <div className="border-t border-border p-4">
        <div className="rounded-2xl border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 hover:border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <UserCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Perfil</span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold border border-primary/20">
              {roleLabelMap[userRole] ?? userRole}
            </span>
          </div>

          <SignOutButton className={cn("w-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]")} />
        </div>
      </div>
    </aside>
  );
}