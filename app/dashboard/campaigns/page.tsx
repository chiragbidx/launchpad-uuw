"use client";
import {
  FolderKanban,
  Circle,
  CheckCircle2,
  Clock3,
  User,
  Plus,
  Pencil
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  Thead,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef, useState, useCallback } from "react";
import { getCampaigns, addCampaign, editCampaign } from "./actions";

const statusInfo: {
  [key: string]: { color: string; icon: any; text: string };
} = {
  Active: { color: "text-primary", icon: CheckCircle2, text: "Active" },
  Planned: { color: "text-muted-foreground", icon: Clock3, text: "Planned" },
  Completed: { color: "text-emerald-600", icon: Circle, text: "Completed" },
};

// Utility for live refresh - simple fetcher to API route
async function fetchCampaigns(workspaceId: string) {
  const res = await fetch(`/api/campaigns?workspaceId=${encodeURIComponent(workspaceId)}`, {
    method: "GET",
    next: { revalidate: 0 }
  });
  if (!res.ok) return [];
  return res.json();
}

function AddEditCampaignForm({
  campaign,
  workspaceId,
  onDone,
  onCancel,
  isEditing,
}: {
  campaign?: any,
  workspaceId: string,
  onDone: (newCampaign?: any) => void,
  onCancel: () => void,
  isEditing: boolean,
}) {
  const [formState, formAction] = useActionState(
    campaign ? editCampaign : addCampaign,
    null
  );
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && formState === null) {
      formRef.current?.reset();
      onDone();
    }
    // eslint-disable-next-line
  }, [formState, pending]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4"
      autoComplete="off"
    >
      {campaign && (
        <input type="hidden" name="id" value={campaign.id} />
      )}
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={campaign?.name || ""} required minLength={2} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={campaign?.status || "Planned"}
          className="block w-full rounded border px-3 py-2"
          required
        >
          <option value="Planned">Planned</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div>
        <Label htmlFor="owner">Owner</Label>
        <Input id="owner" name="owner" defaultValue={campaign?.owner || ""} />
      </div>
      <div>
        <Label htmlFor="progress">Progress (%)</Label>
        <Input
          id="progress"
          name="progress"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          defaultValue={campaign?.progress || 0}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={campaign?.description || ""} />
      </div>
      <DialogFooter className="flex gap-2 !justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : campaign ? "Update Campaign" : "Add Campaign"}
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

export default function CampaignsPage() {
  // TODO: Get workspaceId from user/session context.
  const workspaceId = "demo-workspace"; // replace with real value from context/auth
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);

  const refreshCampaigns = useCallback(async () => {
    const updated = await fetchCampaigns(workspaceId);
    setCampaigns(updated);
  }, [workspaceId]);

  useEffect(() => {
    refreshCampaigns();
  }, [refreshCampaigns]);

  const handleAddClick = () => {
    setEditingCampaign(null);
    setDialogOpen(true);
  };

  const handleEdit = (campaign: any) => {
    setEditingCampaign(campaign);
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingCampaign(null);
  };

  const handleDone = async () => {
    await refreshCampaigns();
    setDialogOpen(false);
    setEditingCampaign(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingCampaign(null);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <FolderKanban className="size-6 text-primary" />
            Campaigns
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plan and track marketing campaigns for your clients.
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          className="gap-1.5"
          onClick={handleAddClick}
        >
          <Plus className="size-4" />
          New Campaign
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Campaigns List</CardTitle>
          <CardDescription>All campaigns for active workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Owner</Th>
                <Th>Progress</Th>
                <Th>Description</Th>
                <Th>Created</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {campaigns.map((campaign) => {
                const InfoIcon = statusInfo[campaign.status]?.icon;
                return (
                  <Tr key={campaign.id}>
                    <Td>
                      <span className="font-medium">{campaign.name}</span>
                    </Td>
                    <Td>
                      <Badge variant="secondary" className={statusInfo[campaign.status]?.color}>
                        {InfoIcon ? <InfoIcon className="size-4 mr-1 inline" /> : null}
                        {statusInfo[campaign.status]?.text}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        {campaign.owner}
                      </div>
                    </Td>
                    <Td>
                      <div className="font-mono">
                        {campaign.progress}%
                      </div>
                    </Td>
                    <Td>
                      <span className="truncate max-w-xs block">{campaign.description}</span>
                    </Td>
                    <Td>
                      <span className="text-xs text-muted-foreground">{campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : ""}</span>
                    </Td>
                    <Td>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(campaign)}>
                        <Pencil className="size-4 mr-1" />
                        Edit
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? "Edit Campaign" : "Add Campaign"}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign
                ? "Update the campaign details."
                : "Fill in the details for a new campaign."}
            </DialogDescription>
          </DialogHeader>
          <AddEditCampaignForm
            campaign={editingCampaign}
            workspaceId={workspaceId}
            onDone={handleDone}
            onCancel={handleCancel}
            isEditing={!!editingCampaign}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}