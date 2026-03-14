import { Image as ImageIcon, Search, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Demo asset files
const assets = [
  {
    id: "a1",
    name: "Brand Guidelines.pdf",
    type: "PDF Document",
    preview: "/file.svg",
    updated: "2024-06-10",
  },
  {
    id: "a2",
    name: "Holiday Promo.jpg",
    type: "Image",
    preview: "/demo-img.jpg",
    updated: "2024-06-01",
  },
  {
    id: "a3",
    name: "LogoMark.png",
    type: "Image",
    preview: "/team1.jpg",
    updated: "2024-05-15",
  },
];

export default function AssetsPage() {
  const [query, setQuery] = useState("");
  const filtered = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <ImageIcon className="size-6 text-primary" />
            Assets Library
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access, preview, and manage your client&apos;s creative files.
          </p>
        </div>
        <Button variant="default" size="sm" className="gap-1.5" disabled>
          + Upload
        </Button>
      </div>
      <div className="mb-4 max-w-md relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search assets..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(asset => (
          <Card key={asset.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="size-5 text-primary" />
                <CardTitle className="text-lg">{asset.name}</CardTitle>
              </div>
              <CardDescription>{asset.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-36 w-full flex items-center justify-center bg-muted rounded-lg mb-2 overflow-hidden">
                <img
                  src={asset.preview}
                  alt={asset.name}
                  className="object-contain max-h-32 max-w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last updated: {asset.updated}</span>
                <Button size="sm" variant="outline" disabled>
                  <Eye className="size-4 mr-1" /> Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 flex flex-col items-center text-center">
              <ImageIcon className="size-7 mb-3 text-muted-foreground" />
              <p className="font-medium text-sm">No matching assets found.</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search or upload a new file.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}