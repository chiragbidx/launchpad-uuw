"use client";

import { addClient, editClient } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef, useState } from "react";
import { Users, PlusCircle, X } from "lucide-react";

function AddEditClientForm({
  client,
  workspaceId,
  onDone,
  onCancel,
  isEditing,
}: {
  client?: any,
  workspaceId: string,
  onDone: (newClient?: any) => void,
  onCancel: () => void,
  isEditing: boolean,
}) {
  const [formState, formAction] = useActionState(
    client ? editClient : addClient,
    null
  );
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState === null && !pending) {
      // onDone expects to request a refresh/close, but newClient is not available unless returned from server. Here, just close the form.
      formRef.current?.reset();
      onDone();
    }
  }, [formState, pending, onDone]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 bg-muted/50 border p-4 rounded-lg mb-4"
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
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : client ? "Update Client" : "Add Client"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
      </div>
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
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const handleAddClick = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleDone = (/* newClient */) => {
    setShowForm(false);
    setEditingClient(null);
    // Optionally re-fetch clients or optimistically update state
    // setClients(...)
    // If you have real-time or polling update, hook in here
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Client List</h2>
        {!showForm && (
          <Button onClick={handleAddClick} variant="outline" size="sm" className="gap-1.5">
            <PlusCircle className="size-4" />
            Add Client
          </Button>
        )}
      </div>

      {showForm && (
        <AddEditClientForm
          client={editingClient}
          workspaceId={workspaceId}
          onDone={handleDone}
          onCancel={handleCancel}
          isEditing={!!editingClient}
        />
      )}

      <ClientList
        clients={clients}
        onEdit={handleEdit}
      />
    </>
  );
}