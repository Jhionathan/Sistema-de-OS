import { auth } from "@/lib/auth";
import { getActivityLogs } from "@/server/queries/log-queries";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { canManageMasterData } from "@/lib/permissions";
import Link from "next/link";
type LogWithUser = Awaited<ReturnType<typeof getActivityLogs>>["logs"][number];

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  
  if (!session || !canManageMasterData(session.user.role)) {
    redirect("/dashboard");
  }

  const resolvedParams = await searchParams;
  const page = resolvedParams?.page ? parseInt(resolvedParams.page, 10) : 1;
  const { logs, totalPages, total } = await getActivityLogs(page, 20);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Logs de Auditoria
        </h1>
        <p className="text-muted-foreground mt-2">
          Histórico de ações e alterações realizadas no sistema.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">Últimas atividades ({total})</h3>
          <p className="text-sm text-muted-foreground">Visualizando página {page} de {totalPages}</p>
        </div>
        <div className="p-6 pt-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Data/Hora</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Usuário</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Ação</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Entidade</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Descrição</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {logs.map((log: LogWithUser) => (
                  <tr key={log.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-2 align-middle whitespace-nowrap">
                      {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </td>
                    <td className="p-2 align-middle">
                      {log.user ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{log.user.name}</span>
                          <span className="text-xs text-muted-foreground">{log.user.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Sistema</span>
                      )}
                    </td>
                    <td className="p-2 align-middle">
                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        {log.action}
                      </div>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="inline-flex items-center rounded-md border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        {log.entityType}
                      </div>
                    </td>
                    <td className="p-2 align-middle max-w-xs truncate" title={log.description || ""}>
                      {log.description || "-"}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-2 h-24 text-center align-middle text-muted-foreground">
                      Nenhum log encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação simples */}
          {totalPages > 1 && (
             <div className="flex justify-end space-x-2 mt-4">
                {page > 1 && (
                  <Link href={`/logs?page=${page - 1}`} className="text-sm font-medium hover:underline text-primary">Anterior</Link>
                )}
                {page < totalPages && (
                  <Link href={`/logs?page=${page + 1}`} className="text-sm font-medium hover:underline text-primary">Próxima</Link>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
