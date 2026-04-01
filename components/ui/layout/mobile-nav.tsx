"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck, UserCircle } from "lucide-react";
import { SidebarNavLink } from "./sidebar-nav-link";
import { canManageMasterData } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  userName: string;
  userEmail: string;
  userRole: string;
  signOutButton: React.ReactNode;
};

const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  TECHNICIAN: "Técnico",
  CUSTOMER: "Cliente",
};

export function MobileNav({ userName, userEmail, userRole, signOutButton }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fecha o menu ao trocar de rota
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Previne rolagem no body quando menu está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-foreground hover:bg-accent rounded-xl transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {mounted && createPortal(
        <>
          {/* Overlay */}
          {isOpen && (
            <div 
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Drawer */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-[110] w-[85vw] max-w-[280px] bg-card shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight text-foreground font-heading">
                    SISTEMA<span className="text-primary/80">.OS</span>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
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

            <div className="border-t border-border p-4 bg-muted/20">
              <div className="flex items-center gap-3 mb-4 p-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                  <UserCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
                  <p className="truncate text-xs text-muted-foreground">{roleLabelMap[userRole] ?? userRole}</p>
                </div>
              </div>
              {signOutButton}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
