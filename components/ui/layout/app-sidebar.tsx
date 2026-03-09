import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarNavLink } from "./sidebar-nav-link";
import { SignOutButton } from "./sign-out-button";

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
    <aside className="hidden border-r bg-white lg:flex lg:flex-col">
      <div className="border-b px-6 py-5">
        <Link href="/dashboard" className="block">
          <div className="text-xl font-bold tracking-tight text-slate-900">
            Visita Técnica
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Controle operacional
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 py-5">
        <nav className="space-y-1">
          <SidebarNavLink href="/dashboard" icon="dashboard">
            Dashboard
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

          <SidebarNavLink href="/visits" icon="visits">
            Visitas
          </SidebarNavLink>

          <SidebarNavLink href="/technicians" icon="technicians">
            Técnicos
          </SidebarNavLink>
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
          <p className="truncate text-xs text-slate-500">{userEmail}</p>
          <p className="mt-2 text-xs font-medium text-slate-600">
            {roleLabelMap[userRole] ?? userRole}
          </p>

          <div className="mt-4">
            <SignOutButton className={cn("w-full")} />
          </div>
        </div>
      </div>
    </aside>
  );
}