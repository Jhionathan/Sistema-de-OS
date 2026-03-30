import { TechnicianForm } from "@/components/ui/forms/technican-form";

export default function NewTechnicianPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Novo técnico
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cadastre um novo técnico para operação.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <TechnicianForm />
      </div>
    </div>
  );
}