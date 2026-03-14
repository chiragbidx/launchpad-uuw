"use client";

import { addClient, editClient } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef, useState, useCallback } from "react";
import { Users, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

function AddEditClientForm({
  client,
  workspaceId,
  onDone,
  onCancel,
  isEditing,
  keepOpenOnError,
}: {
  client?: any,
  workspaceId: string,
  onDone: (newClient?: any) => void,
  onCancel: () => void,
  isEditing: boolean,
  keepOpenOnError: boolean
}) {
  // Only use useActionState INSIDE the form, so parent state changes do not remount the form.
  const [formState, formAction] = useActionState(
    client ? editClient : addClient,
    null
  );
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  // Only close modal if submit succeeded (no error)
  useEffect(() => {
    if (!pending && formState === null) {
      formRef.current?.reset();
      onDone();
    }
    // eslint-disable-next-line
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
      <DialogFooter className="flex gap-2 !justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : client ? "Update Client" : "Add Client"}
        </Button>
        <Button type="button" variant="ghost" disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
      </DialogFooter>
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

async function fetchClients(workspaceId: string) {
  const res = await fetch(`/api/clients?workspaceId=${encodeURIComponent(workspaceId)}`, {
    method: "GET",
    next: { revalidate: 0 }
  });
  if (!res.ok) return [];
  return res.json();
}

export default function ClientsClient({
  initialClients,
  workspaceId,
}: {
  initialClients: any[];
  workspaceId: string;
}) {
  const [clients, setClients] = useState(initialClients ?? []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const refreshClients = useCallback(async () => {
    const updated = await fetchClients(workspaceId);
    setClients(updated);
  }, [workspaceId]);

  const handleAddClick = () => {
    setEditingClient(null);
    setDialogOpen(true);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    // Only allow manual user close (cancel or click out) to hide, otherwise open stays true on error.
    setDialogOpen(open);
    if (!open) setEditingClient(null);
  };

  const handleDone = async () => {
    // Only runs after successful add/edit (never on error/cancel).
    await refreshClients();
    setDialogOpen(false);
    setEditingClient(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingClient(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Client List</h2>
        <Button
          onClick={handleAddClick}
          variant="outline"
          size="sm"
          className="gap-1.5"
          data-testid="add-client-button"
        >
          <PlusCircle className="size-4" />
          Add Client
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Edit Client" : "Add Client"}
            </DialogTitle>
            <DialogDescription>
              {editingClient
                ? "Update the client details."
                : "Fill in the details for a new client."}
            </DialogDescription>
          </DialogHeader>
          <AddEditClientForm
            client={editingClient}
            workspaceId={workspaceId}
            onDone={handleDone}
            onCancel={handleCancel}
            isEditing={!!editingClient}
            keepOpenOnError
          />
        </DialogContent>
      </Dialog>

      <ClientList clients={clients} onEdit={handleEdit} />
    </>
  );
}