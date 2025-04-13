
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamMemberProps {
  name: string;
  role: string;
  imageSrc: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, imageSrc }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow text-center">
      <CardHeader className="pb-2 pt-6">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={imageSrc} alt={name} />
            <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-base">{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const TeamSection: React.FC = () => {
  const organizers = [
    { name: "Alex Johnson", role: "Event Director", imageSrc: "/placeholder.svg" },
    { name: "Sophia Chen", role: "Operations Lead", imageSrc: "/placeholder.svg" },
    { name: "Mark Williams", role: "Marketing Director", imageSrc: "/placeholder.svg" },
    { name: "Zara Ahmed", role: "Sponsorship Coordinator", imageSrc: "/placeholder.svg" },
  ];

  const technical = [
    { name: "Ryan Garcia", role: "Technical Director", imageSrc: "/placeholder.svg" },
    { name: "Priya Patel", role: "Platform Engineer", imageSrc: "/placeholder.svg" },
    { name: "David Kim", role: "Infrastructure Lead", imageSrc: "/placeholder.svg" },
    { name: "Emma Torres", role: "UX/UI Designer", imageSrc: "/placeholder.svg" },
  ];

  const mentors = [
    { name: "Dr. Lisa Brown", role: "AI/ML Mentor", imageSrc: "/placeholder.svg" },
    { name: "Sam Davis", role: "Web Dev Mentor", imageSrc: "/placeholder.svg" },
    { name: "Jessica Wu", role: "Blockchain Mentor", imageSrc: "/placeholder.svg" },
    { name: "Michael Smith", role: "AR/VR Mentor", imageSrc: "/placeholder.svg" },
    { name: "Olivia Jones", role: "UX Design Mentor", imageSrc: "/placeholder.svg" },
    { name: "Carlos Ruiz", role: "DevOps Mentor", imageSrc: "/placeholder.svg" },
  ];

  const volunteers = [
    { name: "Aiden Lee", role: "Event Support", imageSrc: "/placeholder.svg" },
    { name: "Mia Wilson", role: "Registration Desk", imageSrc: "/placeholder.svg" },
    { name: "Noah Martinez", role: "Technical Support", imageSrc: "/placeholder.svg" },
    { name: "Ava Rodriguez", role: "Social Media", imageSrc: "/placeholder.svg" },
    { name: "Ethan Taylor", role: "Participant Support", imageSrc: "/placeholder.svg" },
    { name: "Sophie Baker", role: "Logistics Support", imageSrc: "/placeholder.svg" },
  ];

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Our Team</h2>
      
      <p className="mb-8">
        Meet the dedicated individuals who are working tirelessly to make SemiColon 2025 an unforgettable experience. 
        Our diverse team brings together expertise from various technical backgrounds and event management experience.
      </p>
      
      <Tabs defaultValue="organizers" className="mb-6">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="organizers">Organizers</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="organizers">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {organizers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                imageSrc={member.imageSrc}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="technical">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {technical.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                imageSrc={member.imageSrc}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mentors">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mentors.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                imageSrc={member.imageSrc}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="volunteers">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {volunteers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                imageSrc={member.imageSrc}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamSection;
