import { Building2, UserPlus, Pencil, Users, ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";

// Demo: in-memory client/brand data
const demoClients = [
  {
    id: "c1",
    name: "Acme Brands",
    owner: "Priya Patel",
    members: 5,
    campaigns: 7,
    active: true,
    tagline: "Consumer Lifestyle Campaigns",
  },
  {
    id: "c2",
    name: "Shipwell Logistics",
    owner: "Alex Li",
    members: 4,
    campaigns: 5,
    active: false,
    tagline: "Global Logistics Launches",
  },
  {
    id: "c3",
    name: "FinIQ Digital",
    owner: "Maya Singh",
    members: 9,
    campaigns: 12,
    active: false,
    tagline: "Fintech Growth Activation",
  },
];

export default function WorkspacesPage() {
  const [query, setQuery] = useState("");
  const filteredClients = demoClients.filter(client =>
    client.name.toLowerCase().includes(query.toLowerCase()) ||
    client.owner.toLowerCase().includes(query.toLowerCase()) ||
    client.tagline.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Building2 className="size-6 text-primary" />
            Client Workspaces
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your agency’s clients and switch workspaces.</p>
        </div>
        <Button variant="default" size="sm" className="gap-1.5" disabled>
          <UserPlus className="size-4" />
          Add Client
        </Button>
      </div>

      <div className="mb-4 max-w-md relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search clients, brands, owners..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map(client => (
          <Card
            key={client.id}
            className={client.active ? "ring-2 ring-primary shadow-lg" : ""}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{client.name}</div>
                <Badge variant={client.active ? "default" : "secondary"}>
                  {client.active ? "Active" : "Switch"}
                </Badge>
              </div>
              <CardDescription>
                <span className="italic text-muted-foreground">{client.tagline}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Users className="size-4 text-muted-foreground" />
                <span>{client.members} Members</span>
                <Separator orientation="vertical" className="h-4 mx-2" />
                <Pencil className="size-4 text-muted-foreground" />
                <span>{client.campaigns} Campaigns</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Owner: {client.owner}</div>
                <Button size="sm" variant="outline" disabled={client.active}>
                  <ArrowRight className="size-3.5 mr-1" />
                  {client.active ? "Current" : "Switch"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredClients.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 flex flex-col items-center text-center">
              <Building2 className="size-7 mb-3 text-muted-foreground" />
              <p className="font-medium text-sm">No matching clients found.</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search or add a new client.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}