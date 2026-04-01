"use client";

import Link from "next/link";
import { ShieldAlert, Settings, Wrench, Building2 } from "lucide-react";

type UserRow = {
  id: string;
  name: string;
  email: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  technician?: { id: string } | null;
  customer?: { tradeName: string | null; legalName: string; id: string } | null;
};

type UsersTableProps = {
  users: UserRow[];
};

export function UsersTable({ users }: UsersTableProps) {
  function RoleBadge({ role }: { role: string }) {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <ShieldAlert className="h-3 w-3" />
            Administrador
          </span>
        );
      case "MANAGER":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Settings className="h-3 w-3" />
            Gestor
          </span>
        );
      case "TECHNICIAN":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <Wrench className="h-3 w-3" />
            Técnico
          </span>
        );
      case "CUSTOMER":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Building2 className="h-3 w-3" />
            Cliente
          </span>
        );
      default:
        return <span>{role}</span>;
    }
  }

  return (
    <div className="overflow-x-auto w-full rounded-2xl border border-border bg-card shadow-sm">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Usuário Principal
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Acesso
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Perfil Técnico / Empresa
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id} className="group hover:bg-muted/50 transition-colors">
              <td className="px-4 py-4">
                <div className="font-semibold text-foreground">
                  {user.name}
                </div>
                <div className="text-sm text-muted-foreground/80 mt-0.5">
                  {user.email || "-"}
                </div>
              </td>

              <td className="px-4 py-4">
                <RoleBadge role={user.role} />
              </td>

              <td className="px-4 py-4 text-sm text-muted-foreground">
                {user.role === "CUSTOMER" ? (
                  user.customer ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5 opacity-70" />
                      {user.customer.tradeName || user.customer.legalName}
                    </span>
                  ) : (
                    <span className="text-xs text-destructive opacity-80">Empresa não vinculada</span>
                  )
                ) : user.technician ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                    Sincronizado
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/50 opacity-60">Não aplicável</span>
                )}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    user.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive/80"
                  }`}
                >
                  {user.isActive ? "Ativo" : "Suspenso"}
                </span>
              </td>

              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/users/${user.id}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Editar
                  </Link>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-12 text-center text-sm text-muted-foreground"
              >
                Nenhum usuário cadastrado.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
