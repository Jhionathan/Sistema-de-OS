"use server";
import { requireMasterDataPermission } from "@/lib/action-guards";
import { logActivity } from "./activity-log-action";
import { prisma } from "@/lib/prisma";
import { customerSchema, type CustomerInput } from "@/lib/validations/customer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function normalizeOptional(value?: string) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function createCustomer(input: CustomerInput) {
  const session = await requireMasterDataPermission();
  const parsed = customerSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  const customer = await prisma.customer.create({
    data: {
      legalName: data.legalName.trim(),
      tradeName: normalizeOptional(data.tradeName),
      document: normalizeOptional(data.document),
      email: normalizeOptional(data.email),
      phone: normalizeOptional(data.phone),
      notes: normalizeOptional(data.notes),
      purchaseFrequencyDays: data.purchaseFrequencyDays,
      maintenanceFrequencyDays: data.maintenanceFrequencyDays,
      lastPurchaseDate: data.lastPurchaseDate,
      isActive: data.isActive,
    },
  });

  await logActivity(
    session.user.id,
    "CUSTOMER",
    customer.id,
    "CREATE",
    `Cliente ${customer.legalName} criado.`
  );

  revalidatePath("/customers");
}

export async function updateCustomer(id: string, input: CustomerInput) {
  const session = await requireMasterDataPermission();
  const parsed = customerSchema.safeParse(input);


  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  await prisma.customer.update({
    where: { id },
    data: {
      legalName: data.legalName.trim(),
      tradeName: normalizeOptional(data.tradeName),
      document: normalizeOptional(data.document),
      email: normalizeOptional(data.email),
      phone: normalizeOptional(data.phone),
      notes: normalizeOptional(data.notes),
      purchaseFrequencyDays: data.purchaseFrequencyDays,
      maintenanceFrequencyDays: data.maintenanceFrequencyDays,
      lastPurchaseDate: data.lastPurchaseDate,
      isActive: data.isActive,
    },
  });

  await logActivity(
    session.user.id,
    "CUSTOMER",
    id,
    "UPDATE",
    `Cliente ${data.legalName} atualizado.`
  );

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
}

export async function recordCustomerPurchase(id: string, notes?: string, amount?: number, purchasedAt?: Date) {
  const session = await requireMasterDataPermission();
  
  const date = purchasedAt || new Date();

  await prisma.$transaction([
    prisma.customerPurchase.create({
      data: {
        customerId: id,
        notes,
        amount,
        purchasedAt: date,
      }
    }),
    prisma.customer.update({
      where: { id },
      data: {
        lastPurchaseDate: date,
      },
    })
  ]);

  await logActivity(
    session.user.id,
    "CUSTOMER",
    id,
    "CREATE_PURCHASE",
    `Compra registrada no valor de ${amount || 'N/A'}.`
  );

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  revalidatePath("/dashboard");
}
    
export async function toggleCustomerStatus(id: string, isActive: boolean) {
  const session = await requireMasterDataPermission();
  await prisma.customer.update({
    where: { id },
    data: {
      isActive,
    },
  });

  await logActivity(
    session.user.id,
    "CUSTOMER",
    id,
    "TOGGLE_STATUS",
    `Status alterado para ${isActive ? 'Ativo' : 'Inativo'}.`
  );

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
}