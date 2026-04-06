import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechnicianById } from "@/server/queries/technician-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";
import { TechnicianDetailsCard } from "@/components/ui/technicians/technician-details-card";
import { TechnicianVisitsList } from "@/components/ui/technicians/technician-visits-list";

type TechnicianDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TechnicianDetailPage({
  params,
}: TechnicianDetailPageProps) {
  const { id } = await params;
  const technician = await getTechnicianById(id);

  if (!technician) {
    notFound();
  }
  await requireMasterDataAccess();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {technician.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {technician.email || "Sem e-mail cadastrado"}
          </p>
        </div>

        <Link
          href={`/technicians/${technician.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <TechnicianDetailsCard technician={technician} />

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Resumo</h2>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Últimas visitas carregadas</span>
              <strong className="text-slate-900">
                {technician.visits.length}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <TechnicianVisitsList visits={technician.visits} />
    </div>
  );
}