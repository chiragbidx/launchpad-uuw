import { NextRequest, NextResponse } from "next/server";
import { getCampaigns } from "@/app/dashboard/campaigns/actions";

export async function GET(req: NextRequest) {
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json([], { status: 400 });
  }
  const records = await getCampaigns(workspaceId);
  return NextResponse.json(records);
}