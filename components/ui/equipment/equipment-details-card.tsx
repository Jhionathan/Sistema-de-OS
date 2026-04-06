import { EQUIPMENT_STATUS_MAP } from "@/lib/constants";

interface InfoProps {
  label: string;
  value: string | null;
}

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-sm text-slate-600">{value || "-"}</p>
    </div>
  );
}

interface EquipmentDetailsCardProps {
  equipment: any;
}

export function EquipmentDetailsCard({ equipment }: EquipmentDetailsCardProps) {
  return (
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
          value={EQUIPMENT_STATUS_MAP[equipment.status] ?? equipment.status}
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
  );
}
