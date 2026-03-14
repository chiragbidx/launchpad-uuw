"use client";

import { addClient, editClient } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";

function AddEditClientForm({ client, workspaceId, onDone }: { client?: any, workspaceId: string, onDone: () => void }) {
  const [formState, formAction] = useFormState(
    client ? editClient : addClient,
    null
  );
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState === null && !pending) {
      formRef.current?.reset();
      onDone();
    }
  }, [formState, pending, onDone]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4"
      autoComplete="off"
    >
      {client && (
        <input type="hidden" name="id" value={client.id} />
      )}
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={client?.name || ""} required minLength={1} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={client?.email || ""} />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={client?.phone || ""} />
      </div>
      <div>
        <Label htmlFor="contactName">Contact Name</Label>
        <Input id="contactName" name="contactName" defaultValue={client?.contactName || ""} />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={client?.notes || ""} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : client ? "Update Client" : "Add Client"}
      </Button>
      {formState?.error && (
        <p className="text-sm text-red-600">{formState.error}</p>
      )}
    </form>
  );
}

function ClientList({ clients, onEdit }: { clients: any[], onEdit: (client: any) => void }) {
  return (
    <div className="space-y-2">
      {clients.length === 0 && <p className="text-muted-foreground">No clients yet.</p>}
      {clients.map((client) => (
        <Card key={client.id}>
          <CardHeader className="flex flex-row items-center gap-3">
            <Users className="size-4" />
            <CardTitle className="flex-1 text-lg">{client.name}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div><b>Email:</b> {client.email || <span className="text-muted-foreground">N/A</span>}</div>
            {client.phone && <div><b>Phone:</b> {client.phone}</div>}
            {client.contactName && <div><b>Contact:</b> {client.contactName}</div>}
            {client.notes && <div className="mt-2 text-muted-foreground text-sm">{client.notes}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ClientsClient({
  initialClients,
  workspaceId,
}: {
  initialClients: any[];
  workspaceId: string;
}) {
  const [clients, setClients] = useState(initialClients);
  const [editingClient, setEditingClient] = useState<any>(null);

  // Optionally refresh clients from the server with SWR or optimistic update after add/edit

  return (
    <>
      <AddEditClientForm
        client={editingClient}
        workspaceId={workspaceId}
        onDone={() => setEditingClient(null)}
      />

      <hr className="my-8" />

      <ClientList
        clients={clients}
        onEdit={setEditingClient}
      />
    </>
  );
}