import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { VisitForm } from "@/components/ui/forms/visit-form";
import {
  getEquipmentForVisitSelect,
  getTechniciansForVisitSelect,
  getVisitById,
} from "@/server/queries/visit-queries";

type EditVisitPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditVisitPage({ params }: EditVisitPageProps) {
  const { id } = await params;
  const session = await auth();

  const [visit, equipment, technicians] = await Promise.all([
    getVisitById(id),
    getEquipmentForVisitSelect(session?.user),
    getTechniciansForVisitSelect(),
  ]);

  if (!visit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Editar visita
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Atualize os dados do atendimento técnico.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <VisitForm visit={visit} equipment={equipment} technicians={technicians} />
      </div>
    </div>
  );
}