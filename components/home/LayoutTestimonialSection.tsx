"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "/demo-img.jpg",
    name: "Riya Mehra",
    userName: "MD, PixelSprint Agency",
    comment:
      "Marketraze lets us handle 12+ client brands—analytics, campaigns, and asset approvals—in a single, polished dashboard.",
    rating: 5.0,
  },
  {
    image: "/demo-img.jpg",
    name: "Alex Li",
    userName: "Growth Lead, DeltaFuse",
    comment:
      "The campaign timeline and AI writer save hours every week. Clients love the clarity, our team loves the speed.",
    rating: 4.9,
  },
  {
    image: "/demo-img.jpg",
    name: "Samantha Torres",
    userName: "Partner, Advantum Collective",
    comment:
      "Marketraze brings the accountability our agency needed—transparent reporting, asset library, and pro branding.",
    rating: 5.0,
  },
  {
    image: "/demo-img.jpg",
    name: "Yash Patel",
    userName: "Founder, MetaMakers",
    comment:
      "Highly recommend for any consultancy juggling multiple brands and client expectations!",
    rating: 4.8,
  },
  {
    image: "/demo-img.jpg",
    name: "Priya Anand",
    userName: "Director, Marquix Labs",
    comment:
      "AI automations elevate our campaigns while keeping everything organized. Marketraze is the new standard.",
    rating: 5.0,
  }
];

export const LayoutTestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Testimonials
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Agencies shipping faster with Marketraze
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="bg-muted/50 dark:bg-card">
                <CardContent className="pt-6 pb-0">
                  <div className="flex gap-1 pb-6">
                    {Array.from({ length: Math.round(review.rating) }).map((_, i) => (
                      <Star key={i} className="size-4 fill-primary text-primary" />
                    ))}
                  </div>
                  {`"${review.comment}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={review.image} alt={review.name} />
                      <AvatarFallback>{review.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};