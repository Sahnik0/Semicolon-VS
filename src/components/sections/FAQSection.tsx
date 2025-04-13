
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger className="text-left">{question}</AccordionTrigger>
      <AccordionContent>
        <div className="text-muted-foreground">{answer}</div>
      </AccordionContent>
    </AccordionItem>
  );
};

const FAQSection: React.FC = () => {
  const generalFaqs = [
    {
      question: "What is SemiColon?",
      answer: "SemiColon is a 48-hour hackathon where participants work in teams to develop innovative solutions to real-world problems. It's an opportunity to learn, collaborate, and showcase your skills while competing for exciting prizes."
    },
    {
      question: "When and where will the hackathon take place?",
      answer: "SemiColon 2025 will be held from April 20-22, 2025. The event will take place at the Tech Innovation Center, 123 Developer Avenue, Silicon Valley. We also offer limited virtual participation options for international participants."
    },
    {
      question: "Who can participate?",
      answer: "The hackathon is open to students, professionals, and tech enthusiasts of all skill levels. Whether you're a coding novice or an experienced developer, there's a place for you at SemiColon."
    },
    {
      question: "Is there a registration fee?",
      answer: "No, participation in SemiColon is completely free. However, registration is required, and spots are limited, so we encourage early registration."
    },
  ];

  const teamFaqs = [
    {
      question: "What is the team size requirement?",
      answer: "Teams should consist of 2-5 members. You can come with your own team or join our team formation session to find teammates with complementary skills."
    },
    {
      question: "Can I participate as an individual?",
      answer: "While we strongly encourage team participation for the collaborative experience, we do have a limited number of spots for individual participants. Individual participants will be assessed separately."
    },
    {
      question: "Do all team members need to be present?",
      answer: "Yes, all team members should be present throughout the hackathon. However, we understand that emergencies may arise, and we'll handle such situations on a case-by-case basis."
    },
  ];

  const projectFaqs = [
    {
      question: "Do we need to build the entire project during the hackathon?",
      answer: "Yes, all coding and development must be done during the 48-hour hackathon period. You can come with ideas and plans, but no pre-written code is allowed."
    },
    {
      question: "Can we use open-source libraries or frameworks?",
      answer: "Absolutely! You're encouraged to use open-source libraries, frameworks, and APIs. Just make sure to properly attribute and comply with their licenses."
    },
    {
      question: "What are the judging criteria?",
      answer: "Projects will be evaluated based on innovation, technical complexity, design and user experience, practicality and real-world applicability, and presentation quality."
    },
    {
      question: "Do we retain intellectual property rights to our project?",
      answer: "Yes, you retain all rights to your project. However, we encourage participants to consider open-sourcing their projects to benefit the wider community."
    },
  ];

  const logisticsFaqs = [
    {
      question: "Will food be provided?",
      answer: "Yes, we'll provide meals, snacks, and beverages throughout the hackathon to keep you fueled and focused."
    },
    {
      question: "Should I bring my own computer?",
      answer: "Yes, participants should bring their own laptops and any special hardware needed for their projects. We'll provide power strips, internet, and common hardware components."
    },
    {
      question: "Will there be sleeping arrangements?",
      answer: "We'll have designated quiet areas for rest, but we don't provide sleeping accommodations. Many participants prefer to work through the night with short breaks."
    },
    {
      question: "What about COVID-19 safety measures?",
      answer: "We follow all local health guidelines. Participants may be required to show proof of vaccination or negative test results. Masks may be required in certain areas. We'll provide detailed safety protocols closer to the event date."
    },
  ];

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-4">General</h3>
        <Accordion type="single" collapsible className="mb-6">
          {generalFaqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </Accordion>
        
        <h3 className="font-semibold text-lg mb-4">Teams</h3>
        <Accordion type="single" collapsible className="mb-6">
          {teamFaqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </Accordion>
        
        <h3 className="font-semibold text-lg mb-4">Projects</h3>
        <Accordion type="single" collapsible className="mb-6">
          {projectFaqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </Accordion>
        
        <h3 className="font-semibold text-lg mb-4">Logistics</h3>
        <Accordion type="single" collapsible>
          {logisticsFaqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </Accordion>
      </div>
      
      <div className="text-center mt-10">
        <p className="text-muted-foreground">
          Still have questions? Contact us at{" "}
          <a href="mailto:info@SemiColon.com" className="text-primary hover:underline">
            info@SemiColon.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default FAQSection;
