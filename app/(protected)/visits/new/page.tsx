import { VisitForm } from "@/components/ui/forms/visit-form";
import {
  getEquipmentForVisitSelect,
  getTechniciansForVisitSelect,
} from "@/server/queries/visit-queries";

export default async function NewVisitPage() {
  const [equipment, technicians] = await Promise.all([
    getEquipmentForVisitSelect(),
    getTechniciansForVisitSelect(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Nova visita
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cadastre um novo atendimento técnico.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <VisitForm equipment={equipment} technicians={technicians} />
      </div>
    </div>
  );
}