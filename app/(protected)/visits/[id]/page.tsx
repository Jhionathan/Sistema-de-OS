import Link from "next/link";
import { notFound } from "next/navigation";
import { getVisitById } from "@/server/queries/visit-queries";
import { VISIT_TYPE_MAP } from "@/lib/constants";
import { VisitDetailsCard } from "@/components/ui/visits/visit-details-card";
import { VisitOperationalSummary } from "@/components/ui/visits/visit-operational-summary";

type VisitDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VisitDetailPage({ params }: VisitDetailPageProps) {
  const { id } = await params;
  const visit = await getVisitById(id);

  if (!visit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {VISIT_TYPE_MAP[visit.visitType] ?? visit.visitType}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {visit.customer.tradeName || visit.customer.legalName} • {visit.unit.name}
          </p>
        </div>

        <Link
          href={`/visits/${visit.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <VisitDetailsCard visit={visit} />
        <VisitOperationalSummary visit={visit} />
      </div>
    </div>
  );
}