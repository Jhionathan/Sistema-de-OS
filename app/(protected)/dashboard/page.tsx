import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/server/queries/dashboard-queries";
import { AdminDashboard } from "@/components/ui/dashboard/admin-dashboard";
import { TechnicianDashboard } from "@/components/ui/dashboard/technician-dashboard";
import { CustomerDashboard } from "@/components/ui/dashboard/customer-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardStats(session?.user);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Olá, <span className="text-primary">{session?.user?.name}</span>
        </h1>

        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          {data.isTechnician
            ? "Aqui está o resumo das suas visitas e atendimentos operacionais de hoje."
            : data.isCustomer
            ? "Bem-vindo ao seu painel de controle operacional."
            : "Aqui está o panorama operacional atualizado do seu sistema."}
        </p>
      </section>

      {data.isTechnician ? (
        <TechnicianDashboard data={data} />
      ) : data.isCustomer ? (
        <CustomerDashboard data={data} />
      ) : (
        <AdminDashboard data={data} />
      )}
    </div>
  );
}