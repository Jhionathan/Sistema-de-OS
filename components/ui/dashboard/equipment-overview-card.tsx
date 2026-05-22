type EquipmentItem = {
  id: string;
  equipmentType: string;
  assetTag: string | null;
  customer: {
    tradeName: string | null;
    legalName: string;
  };
};

type EquipmentOverviewCardProps = {
  items: EquipmentItem[];
};

export function EquipmentOverviewCard({
  items,
}: EquipmentOverviewCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Equipamentos em destaque
      </h2>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum equipamento encontrado.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <p className="font-medium text-slate-900">
                {item.equipmentType}
                {item.assetTag ? ` • ${item.assetTag}` : ""}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {item.customer.tradeName ?? item.customer.legalName}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}