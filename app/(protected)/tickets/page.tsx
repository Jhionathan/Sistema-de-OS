import { getVisits } from "@/server/queries/visit-queries";
import { VisitsTable } from "@/components/ui/tables/visits-table";
import { requireOperationalAccess } from "@/lib/auth-guards";
import { canManageMasterData } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { InboxIcon } from "lucide-react";

export default async function TicketsPage() {
  const session = await requireOperationalAccess();

  // Apenas gestores/admins acessam a central de triagem geral
  if (!canManageMasterData(session.user.role)) {
    redirect("/dashboard");
  }

  // Busca apenas visitas com status REQUESTED
  const pendingVisits = await getVisits({ status: "REQUESTED" }, session.user);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex bg-orange-100 p-3 rounded-2xl items-center justify-center">
            <InboxIcon className="text-orange-600 w-8 h-8"/>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Triagem de Chamados
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-lg">
            Solicitações de manutenção abertas pelos clientes. Atribua um técnico para iniciar o atendimento.
          </p>
        </div>
      </div>

      <VisitsTable visits={pendingVisits} userRole={session.user.role} />
    </div>
  );
}
