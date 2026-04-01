"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Equipment, Customer, CustomerUnit } from "@prisma/client";
import { createTicket } from "@/server/actions/visit-action";
import { toast } from "sonner";
import { FormSelect } from "./form-select";
import { FormTextarea } from "./form-textarea";
import { FormInput } from "./form-input";
import { Loader2 } from "lucide-react";

type EquipmentOption = Equipment & {
  customer: Customer;
  unit: CustomerUnit;
};

type TicketFormProps = {
  equipment: EquipmentOption[];
  initialEquipmentId?: string;
};

const ticketSchema = z.object({
  equipmentId: z.string().min(1, "Selecione o equipamento que apresenta o defeito"),
  reportedIssue: z.string().min(5, "Por favor, descreva o problema com mais detalhes"),
  scheduledAt: z.string().min(1, "Informe a data sugerida para a visita"),
});

type TicketInput = z.infer<typeof ticketSchema>;

function getDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  return tomorrow.toISOString().slice(0, 16);
}

const EQUIPMENT_OPTIONS = (equipment: EquipmentOption[]) =>
  equipment.map((item) => ({
    value: item.id,
    label: `${item.equipmentType} ${item.brand ? `(${item.brand})` : ""} - ${item.unit.name}${item.assetTag ? ` [${item.assetTag}]` : ""}`,
  }));

export function TicketForm({ equipment, initialEquipmentId }: TicketFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      equipmentId: initialEquipmentId || "",
      reportedIssue: "",
      scheduledAt: getDefaultDate(),
    },
  });

  const equipmentId = watch("equipmentId");

  const selectedEquipment = useMemo(() => {
    return equipment.find((item) => item.id === equipmentId);
  }, [equipment, equipmentId]);

  async function onSubmit(data: TicketInput) {
    setLoading(true);
    try {
      await createTicket(data);
      toast.success("Seu chamado foi aberto com sucesso!", {
        description: "Nossa equipe técnica avaliará a designação o mais rápido possível."
      });
      router.push("/visits"); // Retorna para a aba de visitas (que é onde o cliente acompanha)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao abrir o chamado.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <FormSelect
          {...register("equipmentId")}
          label="Em qual equipamento ocorreu o problema?"
          options={EQUIPMENT_OPTIONS(equipment)}
          placeholder="Selecione um equipamento..."
          error={errors.equipmentId?.message}
          required
        />

        {selectedEquipment && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-inner">
            <div className="flex justify-between items-center mb-1">
              <strong className="text-slate-900">{selectedEquipment.equipmentType}</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                {selectedEquipment.unit.name}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              {selectedEquipment.customer.tradeName || selectedEquipment.customer.legalName}
              {selectedEquipment.serialNumber && ` • Num. Série: ${selectedEquipment.serialNumber}`}
            </div>
          </div>
        )}

        <FormTextarea
          {...register("reportedIssue")}
          label="Qual o defeito percebido?"
          placeholder="Descreva com detalhes o que está acontecendo com a máquina..."
          className="min-h-32 text-base"
          error={errors.reportedIssue?.message}
          required
        />

        <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl mt-6">
          <h3 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wider">Disponibilidade</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Em qual data e horário você precisa que o técnico realize o serviço?
          </p>
          <FormInput
            {...register("scheduledAt")}
            type="datetime-local"
            error={errors.scheduledAt?.message}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-6 border-t border-border mt-8">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-wait transition-colors shadow-sm shadow-primary/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processando Chamado...
            </>
          ) : (
            "Abrir Chamado"
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/visits")}
          disabled={loading}
          className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
