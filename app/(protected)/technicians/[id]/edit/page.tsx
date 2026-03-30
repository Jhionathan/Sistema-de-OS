import { notFound } from "next/navigation";
import { getTechnicianById } from "@/server/queries/techbician-queries";
import { TechnicianForm } from "@/components/ui/forms/technican-form";

type EditTechnicianPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTechnicianPage({
  params,
}: EditTechnicianPageProps) {
  const { id } = await params;
  const technician = await getTechnicianById(id);

  if (!technician) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Editar técnico
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Atualize os dados do técnico.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <TechnicianForm technician={technician} />
      </div>
    </div>
  );
}