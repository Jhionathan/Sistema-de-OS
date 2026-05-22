"use client";

import { updateSystemSettings, type SystemSettingInput } from "@/server/actions/settings-action";
import { Button } from "@/components/ui/button";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SystemSetting } from "@prisma/client";

interface SettingsFormProps {
  initialData: SystemSetting;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    companyName: initialData.companyName || "",
    companyDocument: initialData.companyDocument || "",
    contactEmail: initialData.contactEmail || "",
    contactPhone: initialData.contactPhone || "",
    slaLowHours: initialData.slaLowHours,
    slaMediumHours: initialData.slaMediumHours,
    slaHighHours: initialData.slaHighHours,
    slaUrgentHours: initialData.slaUrgentHours,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await updateSystemSettings(formData as SystemSettingInput);
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar configurações.");
    } finally {
      setIsPending(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const labelClass = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Seção Empresa */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Dados da Empresa</h3>
          <p className="text-sm text-muted-foreground">Informações que aparecerão em relatórios e ordens de serviço.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="companyName" className={labelClass}>Nome da Empresa</label>
            <input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="companyDocument" className={labelClass}>CNPJ</label>
            <input id="companyDocument" name="companyDocument" value={formData.companyDocument} onChange={handleChange} placeholder="00.000.000/0000-00" className={inputClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="contactEmail" className={labelClass}>E-mail de Contato</label>
            <input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} className={inputClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="contactPhone" className={labelClass}>Telefone de Contato</label>
            <input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Seção SLA */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Parâmetros de SLA (Horas)</h3>
          <p className="text-sm text-muted-foreground">Tempo máximo de resposta estipulado para cada nível de prioridade.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <label htmlFor="slaLowHours" className={`${labelClass} text-muted-foreground`}>Prioridade Baixa</label>
            <input id="slaLowHours" name="slaLowHours" type="number" min="1" value={formData.slaLowHours} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="slaMediumHours" className={`${labelClass} text-primary`}>Prioridade Média</label>
            <input id="slaMediumHours" name="slaMediumHours" type="number" min="1" value={formData.slaMediumHours} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="slaHighHours" className={`${labelClass} text-orange-500`}>Prioridade Alta</label>
            <input id="slaHighHours" name="slaHighHours" type="number" min="1" value={formData.slaHighHours} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="slaUrgentHours" className={`${labelClass} text-destructive font-bold`}>Urgente</label>
            <input id="slaUrgentHours" name="slaUrgentHours" type="number" min="1" value={formData.slaUrgentHours} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Salvar Configurações
      </Button>
    </form>
  );
}
