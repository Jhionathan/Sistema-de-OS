import Link from "next/link";
import { getUsers } from "@/server/queries/user-queries";
import { UsersTable } from "@/components/ui/tables/users-table";
import { requireMasterDataAccess } from "@/lib/auth-guards";

export default async function UsersPage() {
  await requireMasterDataAccess();
  const users = await getUsers();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">
            Gestão de Usuários
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Gerencie os acessos ao sistema. Adicione técnicos, gestores ou administradores e defina suas credenciais.
          </p>
        </div>

        <Link
          href="/users/new"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          Novo usuário
        </Link>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
