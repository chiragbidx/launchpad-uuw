import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const LayoutHeroSection = () => {
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>Launch</Badge>
            </span>
            <span>Introducing Marketraze</span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              The all-in-one <span className="text-transparent px-2 bg-gradient-to-r from-[#F8902A] to-primary bg-clip-text">
                Marketing Agent Portal
              </span>
              for modern agencies
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            Effortlessly manage clients, campaigns, reports, assets, and AI-powered marketing workflows—all from one intuitive dashboard built for growth teams and agencies.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button asChild className="w-5/6 md:w-1/4 font-bold group/arrow">
              <Link href="#contact">
                Get Started
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link href="#features">
                Explore Features
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-orange-400/40 rounded-full blur-3xl"></div>
          <Image
            width={1200}
            height={700}
            className="w-full md:w-[1100px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary border-t-primary/30 dark:hidden"
            src="/hero-image-light.jpeg"
            alt="Marketraze dashboard"
          />
          <Image
            width={1200}
            height={700}
            className="hidden w-full md:w-[1100px] mx-auto rounded-lg relative rouded-lg leading-none border border-t-2 border-secondary border-t-primary/30 dark:block"
            src="/hero-image-dark.jpeg"
            alt="Marketraze dashboard"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};