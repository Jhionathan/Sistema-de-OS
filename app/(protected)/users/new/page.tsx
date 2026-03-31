import { UserForm } from "@/components/ui/forms/user-form";
import { requireMasterDataAccess } from "@/lib/auth-guards";

export default async function NewUserPage() {
  await requireMasterDataAccess();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">
          Criar Acesso
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Preencha os dados abaixo para criar credenciais para um novo membro da equipe.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <UserForm />
      </div>
    </div>
  );
}
