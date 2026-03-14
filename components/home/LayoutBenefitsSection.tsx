import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Users",
    title: "Multi-Client Management",
    description:
      "Seamlessly manage campaigns, assets, reporting, and permissions for unlimited clients—no more logging in and out.",
  },
  {
    icon: "Rocket",
    title: "Campaign Orchestration",
    description:
      "Map, schedule, and track campaign execution visually for all your brands.",
  },
  {
    icon: "Sparkles",
    title: "AI Marketing Agents",
    description:
      "Let Marketraze's built-in AI automate content, research, workflow, and reporting at scale.",
  },
  {
    icon: "ChartBar",
    title: "Analytics & Reporting",
    description:
      "Unify campaign analytics, asset performance, spend, and results—presented cleanly for clients and teams.",
  },
];

export const LayoutBenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Why Marketraze</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The platform made for marketing agencies & consultants
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Marketraze streamlines campaign management, centralizes every asset, and brings AI into your workflow—helping you exceed client expectations, every time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};