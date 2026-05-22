import { auth } from "@/lib/auth";
import { getSystemSettings } from "@/server/queries/settings-queries";
import { redirect } from "next/navigation";
import { canManageMasterData } from "@/lib/permissions";
import { SettingsForm } from "@/components/ui/forms/settings-form";

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session || !canManageMasterData(session.user.role)) {
    redirect("/dashboard");
  }

  const settings = await getSystemSettings();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Configurações Globais
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os dados da empresa e as regras de negócio padrão do sistema.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
