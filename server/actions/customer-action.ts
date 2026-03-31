"use server";
import { requireMasterDataPermission } from "@/lib/action-guards";
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
  await requireMasterDataPermission();
  const parsed = customerSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  await prisma.customer.create({
    data: {
      legalName: data.legalName.trim(),
      tradeName: normalizeOptional(data.tradeName),
      document: normalizeOptional(data.document),
      email: normalizeOptional(data.email),
      phone: normalizeOptional(data.phone),
      notes: normalizeOptional(data.notes),
      isActive: data.isActive,
    },
  });

  revalidatePath("/customers");
  redirect("/customers");
}

export async function updateCustomer(id: string, input: CustomerInput) {
  await requireMasterDataPermission();
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
      isActive: data.isActive,
    },
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect("/customers");
}
    
export async function toggleCustomerStatus(id: string, isActive: boolean) {
  await requireMasterDataPermission();
  await prisma.customer.update({
    where: { id },
    data: {
      isActive,
    },
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
}