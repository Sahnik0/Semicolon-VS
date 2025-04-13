
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkedinIcon, TwitterIcon, GlobeIcon } from "lucide-react";

interface JudgeCardProps {
  name: string;
  role: string;
  company: string;
  bio: string;
  imageSrc: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

const JudgeCard: React.FC<JudgeCardProps> = ({
  name,
  role,
  company,
  bio,
  imageSrc,
  linkedin,
  twitter,
  website,
}) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-col items-center text-center pb-2">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={imageSrc} alt={name} />
          <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
        </Avatar>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="text-primary font-medium">
          {role}
        </CardDescription>
        <CardDescription>{company}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">{bio}</p>
        <div className="flex justify-center gap-4">
          {linkedin && (
            <a 
              href={linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
          )}
          {twitter && (
            <a 
              href={twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <TwitterIcon className="h-5 w-5" />
            </a>
          )}
          {website && (
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <GlobeIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const JudgesSection: React.FC = () => {
  const judges = [
    {
      name: "Dr. Sarah Chen",
      role: "AI Research Lead",
      company: "TechInnovate Inc.",
      bio: "Dr. Chen leads AI research at TechInnovate with over 15 years of experience in machine learning and neural networks.",
      imageSrc: "/placeholder.svg",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      website: "https://example.com",
    },
    {
      name: "James Wilson",
      role: "CTO",
      company: "DevSecOps Solutions",
      bio: "James is an expert in cloud infrastructure and security with a passion for mentoring young developers.",
      imageSrc: "/placeholder.svg",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
    {
      name: "Maria Rodriguez",
      role: "Senior Product Designer",
      company: "UX Collective",
      bio: "Maria has designed award-winning interfaces for startups and Fortune 500 companies for over a decade.",
      imageSrc: "/placeholder.svg",
      linkedin: "https://linkedin.com",
      website: "https://example.com",
    },
    {
      name: "David Kim",
      role: "Blockchain Engineer",
      company: "Crypto Innovations",
      bio: "David is a blockchain pioneer who has contributed to several major cryptocurrency projects and protocols.",
      imageSrc: "/placeholder.svg",
      twitter: "https://twitter.com",
      website: "https://example.com",
    },
    {
      name: "Priya Sharma",
      role: "VP of Engineering",
      company: "GlobalTech Solutions",
      bio: "Priya leads engineering teams at GlobalTech and has successfully scaled multiple startups to acquisition.",
      imageSrc: "/placeholder.svg",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Michael Johnson",
      role: "Venture Capitalist",
      company: "Future Fund Ventures",
      bio: "Michael invests in early-stage tech startups and has a keen eye for disruptive technologies and innovative business models.",
      imageSrc: "/placeholder.svg",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  ];

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Meet Our Judges</h2>
      
      <p className="mb-8">
        Our panel of industry experts will evaluate your projects based on innovation, technical complexity, 
        design, and real-world applicability. They bring decades of experience from leading companies and will 
        provide valuable feedback on your work.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {judges.map((judge, index) => (
          <JudgeCard 
            key={index}
            name={judge.name}
            role={judge.role}
            company={judge.company}
            bio={judge.bio}
            imageSrc={judge.imageSrc}
            linkedin={judge.linkedin}
            twitter={judge.twitter}
            website={judge.website}
          />
        ))}
      </div>
    </div>
  );
};

export default JudgesSection;
