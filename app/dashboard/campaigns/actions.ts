"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { campaigns } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const CampaignSchema = z.object({
  id: z.string().optional(),
  workspaceId: z.string(),
  name: z.string().min(2, "Campaign name is required"),
  status: z.enum(["Planned", "Active", "Completed"]),
  owner: z.string().optional().or(z.literal("")),
  progress: z.coerce.number().min(0).max(100).default(0),
  description: z.string().optional().or(z.literal("")),
});

export type CampaignFormState = {
  error?: string;
} | null;

export async function getCampaigns(workspaceId: string) {
  return await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.workspaceId, workspaceId));
}

export async function addCampaign(
  _prevState: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  const data = Object.fromEntries(formData.entries());
  const parsed = CampaignSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues.map((issue) => issue.message).join(", ") };
  }

  const campaignInput = {
    workspaceId: parsed.data.workspaceId,
    name: parsed.data.name,
    status: parsed.data.status,
    owner: parsed.data.owner || null,
    progress: parsed.data.progress?.toString() || "0",
    description: parsed.data.description || null,
  };

  await db.insert(campaigns).values(campaignInput);
  revalidatePath("/dashboard/campaigns");
  return null;
}

export async function editCampaign(
  _prevState: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  const data = Object.fromEntries(formData.entries());
  const parsed = CampaignSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues.map((issue) => issue.message).join(", ") };
  }

  if (!parsed.data.id) {
    return { error: "Campaign ID required" };
  }

  const campaignInput = {
    name: parsed.data.name,
    status: parsed.data.status,
    owner: parsed.data.owner || null,
    progress: parsed.data.progress?.toString() || "0",
    description: parsed.data.description || null,
    updatedAt: new Date(),
  };

  await db
    .update(campaigns)
    .set(campaignInput)
    .where(eq(campaigns.id, parsed.data.id));
  revalidatePath("/dashboard/campaigns");
  return null;
}