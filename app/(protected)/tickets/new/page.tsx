import { TicketForm } from "@/components/ui/forms/ticket-form";
import { auth } from "@/lib/auth";
import { getEquipmentForVisitSelect } from "@/server/queries/visit-queries";
import { LifeBuoy } from "lucide-react";

export default async function NewTicketPage(props: {
  searchParams?: Promise<{ equipmentId?: string }>;
}) {
  const session = await auth();
  const equipment = await getEquipmentForVisitSelect(session?.user);
  
  const resolvedParams = (await props.searchParams) || {};
  const initialEquipmentId = resolvedParams.equipmentId;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex bg-primary/10 p-3 rounded-2xl items-center justify-center">
            <LifeBuoy className="text-primary w-8 h-8"/>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Abrir Chamado
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium max-w-sm">
            Relate o problema da sua máquina. Uma ordem de serviço será gerada imediatamente para análise técnica.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <TicketForm 
          equipment={equipment} 
          initialEquipmentId={initialEquipmentId} 
        />
      </div>
    </div>
  );
}
