import { notFound } from "next/navigation";
import { getUserById } from "@/server/queries/user-queries";
import { UserForm } from "@/components/ui/forms/user-form";
import { requireMasterDataAccess } from "@/lib/auth-guards";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  await requireMasterDataAccess();
  
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">
          Editar credenciais
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Modifique o perfil de acesso e os dados pessoais do usuário.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <UserForm user={user} />
      </div>
    </div>
  );
}
