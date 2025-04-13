
import React from "react";
import { 
  Globe, 
  Cpu, 
  Database, 
  Glasses, 
  Lightbulb 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TrackCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  challenges: string[];
}

const TrackCard: React.FC<TrackCardProps> = ({ title, description, icon, challenges }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 text-primary rounded-full">
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-medium mb-2">Challenges:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {challenges.map((challenge, index) => (
            <li key={index} className="text-sm">{challenge}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const TracksSection: React.FC = () => {
  const tracks = [
    {
      title: "Web/Mobile Development",
      description: "Create innovative web or mobile applications",
      icon: <Globe className="h-6 w-6" />,
      challenges: [
        "Develop a progressive web app that works offline",
        "Build an accessible mobile app addressing social issues",
        "Create a productivity tool for remote teams",
        "Design a web platform for education"
      ]
    },
    {
      title: "AI/ML Solutions",
      description: "Leverage artificial intelligence and machine learning",
      icon: <Cpu className="h-6 w-6" />,
      challenges: [
        "Create an AI tool that helps with content creation",
        "Develop a machine learning solution for healthcare",
        "Build a natural language processing application",
        "Design an AI-powered recommendation system"
      ]
    },
    {
      title: "Blockchain Innovation",
      description: "Explore applications of blockchain technology",
      icon: <Database className="h-6 w-6" />,
      challenges: [
        "Create a decentralized finance (DeFi) application",
        "Build a blockchain solution for supply chain tracking",
        "Develop a smart contract for automated governance",
        "Design a blockchain-based identity verification system"
      ]
    },
    {
      title: "AR/VR Experiences",
      description: "Create immersive augmented or virtual reality solutions",
      icon: <Glasses className="h-6 w-6" />,
      challenges: [
        "Build an AR app for education or training",
        "Develop a VR experience addressing mental health",
        "Create an interactive AR shopping experience",
        "Design an immersive VR game with a social impact theme"
      ]
    },
    {
      title: "Open Innovation",
      description: "Any other creative technical solutions",
      icon: <Lightbulb className="h-6 w-6" />,
      challenges: [
        "Develop IoT solutions for smart cities",
        "Build green technology applications",
        "Create accessibility tools for people with disabilities",
        "Design innovative solutions for local community challenges"
      ]
    }
  ];

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Hackathon Tracks</h2>
      
      <p className="mb-8">
        Choose from five exciting tracks based on your interests and expertise. Each track offers 
        unique challenges designed to test your skills and creativity. You can select any challenge 
        from any track or propose your own idea within these domains.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track, index) => (
          <TrackCard 
            key={index}
            title={track.title}
            description={track.description}
            icon={track.icon}
            challenges={track.challenges}
          />
        ))}
      </div>
    </div>
  );
};

export default TracksSection;
