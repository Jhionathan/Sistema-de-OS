import Link from "next/link";
import { notFound } from "next/navigation";
import { getEquipmentById } from "@/server/queries/equipment-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";


type EquipmentDetailPageProps = {
  params: Promise<{ id: string }>;
};

const statusMap: Record<string, string> = {
  ACTIVE: "Ativo",
  IN_MAINTENANCE: "Em manutenção",
  REMOVED: "Retirado",
  REPLACED: "Substituído",
  INACTIVE: "Inativo",
};

const visitStatusMap: Record<string, string> = {
  SCHEDULED: "Agendada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
  PENDING_RETURN: "Pendente retorno",
};

export default async function EquipmentDetailPage({
  params,
}: EquipmentDetailPageProps) {
  
  await requireMasterDataAccess();
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    notFound();
  }
  

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {equipment.equipmentType}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {equipment.customer.tradeName || equipment.customer.legalName} •{" "}
            {equipment.unit.name}
          </p>
        </div>

        <Link
          href={`/equipment/${equipment.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Dados do equipamento
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Info label="Cliente" value={equipment.customer.tradeName || equipment.customer.legalName} />
            <Info label="Unidade" value={equipment.unit.name} />
            <Info label="Tipo" value={equipment.equipmentType} />
            <Info label="Marca" value={equipment.brand} />
            <Info label="Modelo" value={equipment.model} />
            <Info label="Patrimônio / Tag" value={equipment.assetTag} />
            <Info label="Número de série" value={equipment.serialNumber} />
            <Info
              label="Frequência de manutenção"
              value={
                equipment.maintenanceFrequencyDays
                  ? `${equipment.maintenanceFrequencyDays} dias`
                  : null
              }
            />
            <Info
              label="Status"
              value={statusMap[equipment.status] ?? equipment.status}
            />
            <Info
              label="Data de instalação"
              value={
                equipment.installationDate
                  ? new Intl.DateTimeFormat("pt-BR").format(
                      new Date(equipment.installationDate)
                    )
                  : null
              }
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700">Observações</p>
            <p className="mt-2 text-sm text-slate-600">
              {equipment.notes || "Nenhuma observação cadastrada."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Resumo</h2>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Últimas visitas</span>
                <strong className="text-slate-900">{equipment.visits.length}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Últimas visitas
            </h2>

            <div className="mt-4 space-y-3">
              {equipment.visits.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nenhuma visita encontrada.
                </p>
              ) : (
                equipment.visits.map((visit) => (
                  <div key={visit.id} className="rounded-xl border p-3">
                    <p className="font-medium text-slate-900">
                      {visitStatusMap[visit.status] ?? visit.status}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(visit.scheduledAt))}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {visit.technician?.name ?? "Sem técnico"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-sm text-slate-600">{value || "-"}</p>
    </div>
  );
}