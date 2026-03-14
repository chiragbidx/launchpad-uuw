"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { clients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const ClientSchema = z.object({
  id: z.string().optional(),
  workspaceId: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  contactName: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type ClientFormState = {
  error?: string;
} | null;

export async function getClients(workspaceId: string) {
  return await db
    .select()
    .from(clients)
    .where(eq(clients.workspaceId, workspaceId));
}

export async function addClient(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const data = Object.fromEntries(formData.entries());
  const parsed = ClientSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.errors.map((e) => e.message).join(", ") };
  }

  const clientInput = {
    workspaceId: parsed.data.workspaceId,
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    contactName: parsed.data.contactName || null,
    notes: parsed.data.notes || null,
  };

  await db.insert(clients).values(clientInput);
  revalidatePath("/dashboard/clients");
  return null;
}

export async function editClient(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const data = Object.fromEntries(formData.entries());
  const parsed = ClientSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.errors.map((e) => e.message).join(", ") };
  }

  if (!parsed.data.id) {
    return { error: "Client ID required" };
  }

  const clientInput = {
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    contactName: parsed.data.contactName || null,
    notes: parsed.data.notes || null,
    updatedAt: new Date(),
  };

  await db
    .update(clients)
    .set(clientInput)
    .where(eq(clients.id, parsed.data.id));
  revalidatePath("/dashboard/clients");
  return null;
}
