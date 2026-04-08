import { UserCircle, Building2, MapPin, ShieldCheck } from "lucide-react";

interface ProfileDetailsProps {
  user: {
    name: string;
    email: string;
    role: string;
    customer?: {
      tradeName: string | null;
      legalName: string;
    } | null;
    unit?: {
      name: string;
    } | null;
  };
}

const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  TECHNICIAN: "Técnico",
  CUSTOMER: "Cliente",
};

export function ProfileDetails({ user }: ProfileDetailsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Nome e Cargo */}
      <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100/50 text-blue-600">
          <UserCircle className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">Identidade</p>
          <h3 className="truncate text-lg font-bold text-foreground font-heading">{user.name}</h3>
          <div className="mt-2 flex">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100">
              <ShieldCheck className="h-3 w-3" />
              {roleLabelMap[user.role] ?? user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Empresa Vinculada */}
      <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100/50 text-orange-600">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">Empresa</p>
          <h3 className="truncate text-lg font-bold text-foreground font-heading">
            {user.customer?.tradeName || user.customer?.legalName || "Acesso Interno"}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {user.customer ? "Vínculo de Comodato" : "Equipe Própria"}
          </p>
        </div>
      </div>

      {/* Unidade */}
      <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:col-span-2 lg:col-span-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100/50 text-green-600">
          <MapPin className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">Unidade / Polo</p>
          <h3 className="truncate text-lg font-bold text-foreground font-heading">
            {user.unit?.name || "Global / Todas"}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {user.unit ? "Acesso Restrito" : "Acesso Amplo"}
          </p>
        </div>
      </div>
    </div>
  );
}
