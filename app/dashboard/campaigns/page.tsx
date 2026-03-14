"use client";
import { FolderKanban, Circle, CheckCircle2, Clock3, User, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, Tbody, Tr, Td, Th, Thead } from "@/components/ui/table";
import Link from "next/link";
import { useState } from "react";

// Demo: sample campaigns for active client
const campaigns = [
  {
    id: "cmp01",
    name: "Holiday ROI Sprint",
    status: "Active",
    owner: "Priya Patel",
    progress: 72,
    created: "2024-05-11",
  },
  {
    id: "cmp02",
    name: "Product Launch Q2",
    status: "Planned",
    owner: "Alex Li",
    progress: 0,
    created: "2024-05-09",
  },
  {
    id: "cmp03",
    name: "Influencer Activation",
    status: "Completed",
    owner: "Maya Singh",
    progress: 100,
    created: "2024-04-20",
  },
];

const statusInfo: {
  [key: string]: { color: string; icon: any; text: string };
} = {
  Active: { color: "text-primary", icon: CheckCircle2, text: "Active" },
  Planned: { color: "text-muted-foreground", icon: Clock3, text: "Planned" },
  Completed: { color: "text-emerald-600", icon: Circle, text: "Completed" },
};

export default function CampaignsPage() {
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
        <Button variant="default" size="sm" className="gap-1.5" disabled>
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
                <Th>Created</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {campaigns.map(campaign => {
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
                      <span className="text-xs text-muted-foreground">{campaign.created}</span>
                    </Td>
                    <Td>
                      <Button size="sm" variant="outline" disabled>
                        View
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}