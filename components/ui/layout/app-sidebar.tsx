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
  CUSTOMER: "Cliente",
};

export function AppSidebar({
  userName,
  userEmail,
  userRole,
}: AppSidebarProps) {
  return (
    <aside className="hidden sticky top-0 h-screen overflow-hidden border-r border-border bg-card/60 backdrop-blur-lg lg:flex lg:flex-col shadow-sm">
      <div className="border-b border-border px-6 py-4 flex items-center h-[82px]">
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

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-1.5">
          <SidebarNavLink href="/dashboard" icon="dashboard">
            Dashboard
          </SidebarNavLink>

          {canManageMasterData(userRole) ? (
            <>
              <SidebarNavLink href="/tickets" icon="dashboard">
                Chamados (Triagem)
              </SidebarNavLink>

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

          {userRole === "CUSTOMER" ? (
            <SidebarNavLink href="/equipment" icon="equipment">
              Meus Equipamentos
            </SidebarNavLink>
          ) : null}

          <SidebarNavLink href="/visits" icon="visits">
            {userRole === "CUSTOMER" ? "Minhas Visitas" : "Visitas"}
          </SidebarNavLink>
        </nav>
      </div>

      <div className="border-t border-border p-4">
        <div className="rounded-2xl border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 hover:border-border">
          <Link 
            href="/profile"
            className="flex items-center gap-3 mb-4 rounded-xl p-2 -m-2 transition-colors hover:bg-primary/5 group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/20 transition-all">
              <UserCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{userName}</p>
              <p className="truncate text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Ver Perfil</p>
            </div>
          </Link>
          
          <div className="flex items-center justify-between mt-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cargo</span>
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