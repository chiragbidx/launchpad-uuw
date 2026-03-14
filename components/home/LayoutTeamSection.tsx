import GithubIcon from "@/components/icons/github-icon";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import XIcon from "@/components/icons/x-icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}
interface SocialNetworkProps {
  name: string;
  url: string;
}

// Marketraze branding: Chirag Dodiya as founder, update team for transparency
export const LayoutTeamSection = () => {
  const teamList: TeamProps[] = [
    {
      imageUrl: "/team1.jpg",
      firstName: "Chirag",
      lastName: "Dodiya",
      positions: ["Founder", "Product", "Engineering"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/chiragdodiya/",
        },
        {
          name: "Github",
          url: "https://github.com/chiragdodiya",
        },
        {
          name: "X",
          url: "https://x.com/chiragdodiya",
        },
      ],
    },
    {
      imageUrl: "/team2.jpg",
      firstName: "Maya",
      lastName: "Singh",
      positions: ["Customer Success"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/",
        }
      ],
    },
    {
      imageUrl: "/team3.jpg",
      firstName: "Tom",
      lastName: "Lee",
      positions: ["Lead Developer"],
      socialNetworks: [
        {
          name: "Github",
          url: "https://github.com/",
        }
      ],
    },
    {
      imageUrl: "/team1.jpg",
      firstName: "Priya",
      lastName: "Nair",
      positions: ["Marketing Partnerships"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/",
        },
        {
          name: "X",
          url: "https://x.com/",
        },
      ],
    }
  ];
  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "Github":
        return <GithubIcon />;
      case "X":
        return <XIcon />;
    }
  };

  return (
    <section id="team" className="container mx-auto lg:w-[75%] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Team
        </h2>
        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Meet the Marketraze team
        </h2>
        <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground my-4">
          Built and operated by Chirag Dodiya and a network of expert advisors & engineers.
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {teamList.map(
          (
            { imageUrl, firstName, lastName, positions, socialNetworks },
            index
          ) => (
            <Card
              key={index}
              className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg"
            >
              <CardHeader className="p-0 gap-0">
                <div className="h-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`${firstName} ${lastName}`}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-linear size-full group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                  />
                </div>
                <CardTitle className="py-6 pb-4 px-6">
                  {firstName}
                  <span className="text-primary ml-2">{lastName}</span>
                </CardTitle>
              </CardHeader>
              {positions.map((position, idx) => (
                <CardContent
                  key={idx}
                  className={`pb-0 text-muted-foreground ${
                    idx === positions.length - 1 && "pb-6"
                  }`}
                >
                  {position}
                  {idx < positions.length - 1 && <span>,</span>}
                </CardContent>
              ))}

              <CardFooter className="space-x-4 mt-auto">
                {socialNetworks.map(({ name, url }, idx) => (
                  <Link
                    key={idx}
                    href={url}
                    target="_blank"
                    className="hover:opacity-80 transition-all"
                  >
                    {socialIcon(name)}
                  </Link>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};