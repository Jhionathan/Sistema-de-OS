export const EQUIPMENT_STATUS_MAP: Record<string, string> = {
  ACTIVE: "Ativo",
  IN_MAINTENANCE: "Em manutenção",
  REMOVED: "Retirado",
  REPLACED: "Substituído",
  INACTIVE: "Inativo",
};

export const VISIT_STATUS_MAP: Record<string, string> = {
  SCHEDULED: "Agendada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
  PENDING_RETURN: "Pendente retorno",
};

export const VISIT_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "bg-[#6b7747]/15 text-[#6b7747]",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELED: "bg-rose-100 text-rose-700",
  PENDING_RETURN: "bg-purple-100 text-purple-700",
};

export const VISIT_TYPE_MAP: Record<string, string> = {
  PREVENTIVE: "Preventiva",
  CORRECTIVE: "Corretiva",
  INSTALLATION: "Instalação",
  REPLACEMENT: "Troca",
  REMOVAL: "Retirada",
  INSPECTION: "Inspeção",
};
