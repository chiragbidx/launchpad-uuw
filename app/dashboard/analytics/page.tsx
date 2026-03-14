import { BarChart2, PieChart, TrendingUp, Users, FolderKanban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const demoStats = [
  { label: "Active Clients", value: 8, icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Live Campaigns", value: 17, icon: FolderKanban, color: "bg-cyan-600/10 text-cyan-600" },
];

const demoCharts = [
  {
    title: "Client Campaign Breakdown",
    CardIcon: PieChart,
    description: "Distribution of live campaigns across clients",
    // For visual: Pie-baked in, value is demo
    data: [
      { label: "Acme Brands", value: 7, color: "#f87171" },
      { label: "Shipwell Logistics", value: 5, color: "#60a5fa" },
      { label: "FinIQ Digital", value: 5, color: "#34d399" },
    ],
  },
  {
    title: "Monthly Campaign Growth",
    CardIcon: BarChart2,
    description: "Growth in new campaigns, last 12 months",
    data: [
      { month: "Jan", value: 2 },
      { month: "Feb", value: 3 },
      { month: "Mar", value: 4 },
      { month: "Apr", value: 4 },
      { month: "May", value: 5 },
      { month: "Jun", value: 6 },
      { month: "Jul", value: 8 },
      { month: "Aug", value: 12 },
    ],
  },
];

function DemoPieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  // For demo: static SVG pie
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let cumulative = 0;
  const radius = 40;
  const cx = 50;
  const cy = 50;

  function getCoords(angle: number) {
    const rads = (angle - 90) * (Math.PI / 180.0);
    return {
      x: cx + radius * Math.cos(rads),
      y: cy + radius * Math.sin(rads),
    };
  }
  let paths: any[] = [];
  data.forEach((slice, idx) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += slice.value;
    const endAngle = (cumulative / total) * 360;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const start = getCoords(startAngle);
    const end = getCoords(endAngle);
    const d = [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      `Z`,
    ].join(" ");
    paths.push(<path key={idx} d={d} fill={slice.color} />);
  });

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto my-2">
      {paths}
    </svg>
  );
}

function DemoBarChart({ data }: { data: { month: string; value: number }[] }) {
  const maxVal = Math.max(...data.map((d) => d.value));
  return (
    <svg viewBox="0 0 130 60" height="60" width="130" className="w-full my-2">
      {data.map((d, idx) => (
        <rect
          key={d.month}
          x={10 + idx * 15}
          y={60 - (d.value / maxVal) * 50}
          width={8}
          height={(d.value / maxVal) * 50}
          fill="hsl(var(--primary))"
        />
      ))}
      {data.map((d, idx) => (
        <text
          key={d.month}
          x={10 + idx * 15 + 4}
          y={58}
          textAnchor="middle"
          fontSize={8}
          fill="#888"
        >
          {d.month[0]}
        </text>
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <BarChart2 className="size-6 text-primary" />
            Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visualize campaign performance and client account metrics.
          </p>
        </div>
        <Badge variant="default" className="gap-1.5">
          <TrendingUp className="size-4 mr-1" />
          Demo Data
        </Badge>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {demoStats.map(stat => (
          <Card key={stat.label}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className={`rounded-lg p-2 ${stat.color}`}>
                  <stat.icon className="size-5" />
                </span>
                <CardTitle className="text-lg">{stat.value}</CardTitle>
                <CardDescription>{stat.label}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 mt-8 sm:grid-cols-2">
        {demoCharts.map(chart => (
          <Card key={chart.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <chart.CardIcon className="size-5 text-primary" />
                <CardTitle className="text-base">{chart.title}</CardTitle>
              </div>
              <CardDescription className="mb-2">{chart.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {chart.CardIcon === PieChart ? (
                <DemoPieChart data={chart.data} />
              ) : (
                <DemoBarChart data={chart.data} />
              )}
              {/* Mini legend */}
              {chart.CardIcon === PieChart && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {chart.data.map(slice => (
                    <Badge
                      key={slice.label}
                      variant="outline"
                      className="gap-1.5"
                      style={{ borderColor: slice.color, color: slice.color }}
                    >
                      <span className="inline-block w-2 h-2 rounded-full" style={{ background: slice.color }} />
                      {slice.label} ({slice.value})
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}