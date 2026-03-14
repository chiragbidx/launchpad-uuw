import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Who is Marketraze for?",
    answer: "Marketraze is built for marketing agencies, freelance consultants, and teams managing multiple clients or brands.",
    value: "item-1",
  },
  {
    question: "How does Marketraze use AI in marketing?",
    answer:
      "AI agents in Marketraze automate research, content creation, workflow suggestions, analytics, and reporting—speeding up execution and improving outcomes.",
    value: "item-2",
  },
  {
    question: "Can I manage unlimited clients?",
    answer:
      "Yes, you can onboard and manage as many clients and brands as your team serves. Each workspace is fully segregated.",
    value: "item-3",
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. Marketraze uses enterprise-grade security patterns. All assets are isolated and access is role-based.",
    value: "item-4",
  },
  {
    question: "Does Marketraze support collaboration?",
    answer: "Yes, teams and client stakeholders can collaborate, share assets, assign tasks, and leave feedback—all in one place.",
    value: "item-5",
  },
];

export const LayoutFaqSection = () => {
  return (
    <section id="faq" className="container mx-auto md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          FAQ
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Common Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};