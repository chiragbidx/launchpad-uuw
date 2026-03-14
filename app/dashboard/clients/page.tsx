import { getClients } from "./actions";
import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import ClientsClient from "./ClientsClient";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth/login");

  // This assumes session.workspaceId is set correctly or adjust as needed
  const workspaceId = (session as any).workspaceId || "";
  const clientsData = await getClients(workspaceId);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>

      <ClientsClient initialClients={clientsData} workspaceId={workspaceId} />
    </div>
  );
}