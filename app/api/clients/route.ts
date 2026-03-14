import { NextRequest, NextResponse } from "next/server";
import { getClients } from "@/app/dashboard/clients/actions";

export async function GET(req: NextRequest) {
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json([], { status: 400 });
  }
  const clients = await getClients(workspaceId);
  return NextResponse.json(clients);
}