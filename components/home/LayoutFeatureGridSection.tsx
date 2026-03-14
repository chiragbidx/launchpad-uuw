import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "Briefcase",
    title: "Workspace Switching",
    description:
      "Effortlessly switch between client accounts. Segregated data, assets, and permissions.",
  },
  {
    icon: "CalendarClock",
    title: "Timeline Campaigns",
    description:
      "Visual campaign planning: schedule, assign, and monitor marketing campaigns from a unified dashboard.",
  },
  {
    icon: "UserCog",
    title: "Custom Roles & Permissions",
    description:
      "Fine-grained access controls for teams, clients, and collaborators.",
  },
  {
    icon: "BrainCircuit",
    title: "AI Automations",
    description:
      "Integrate AI-powered assistants for copywriting, content suggestions, task routing, and reporting.",
  },
  {
    icon: "BarChartBig",
    title: "Unified Analytics",
    description:
      "All your analytics in one place: performance, spend, trends, and campaign ROI.",
  },
  {
    icon: "Image",
    title: "Asset Library & Content Hub",
    description:
      "Centralized and searchable—upload, manage, and share creative assets across all clients.",
  },
];

export const LayoutFeatureGridSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Platform Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Everything to accelerate your agency growth
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Marketraze is purpose-built for client-centric agencies, growth marketers, and results-driven teams.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};