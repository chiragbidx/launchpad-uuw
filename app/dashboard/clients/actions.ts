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

export async function getClients(workspaceId: string) {
  return await db
    .select()
    .from(clients)
    .where(eq(clients.workspaceId, workspaceId));
}

export async function addClient(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = ClientSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map(e => e.message).join(", "));
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
}

export async function editClient(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = ClientSchema.safeParse(data);

  if (!parsed.success || !parsed.data.id) {
    throw new Error(parsed.error.errors.map(e => e.message).join(", ") || "Client ID required");
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
}