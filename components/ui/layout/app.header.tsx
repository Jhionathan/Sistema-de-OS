type AppHeaderProps = {
  userName: string;
  userRole: string;
};

const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  TECHNICIAN: "Técnico",
};

export function AppHeader({ userName, userRole }: AppHeaderProps) {
  const today = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(new Date());

  return (
    <header className="border-b bg-white">
      <div className="flex flex-col gap-3 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Sistema de Visitas Técnicas
            </h1>
            <p className="text-sm text-slate-500">{today}</p>
          </div>

          <div className="rounded-2xl border bg-slate-50 px-4 py-2 text-right">
            <p className="text-sm font-medium text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">
              {roleLabelMap[userRole] ?? userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}