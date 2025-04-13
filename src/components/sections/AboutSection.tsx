
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Code, Terminal, FlaskConical } from "lucide-react";

const AboutSection: React.FC = () => {
  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">About SemiColon</h2>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          Welcome to SemiColon 2025, the premier hackathon where innovation meets coding excellence. 
          Our 48-hour coding marathon brings together the brightest minds in technology to solve real-world 
          problems and push the boundaries of what's possible.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <GitBranch className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Collaborative Innovation</CardTitle>
                <CardDescription>
                  Form teams and tackle challenges together
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              Connect with like-minded developers, designers, and entrepreneurs to build
              something extraordinary. Our hackathon emphasizes teamwork and cross-disciplinary
              collaboration.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Code className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Cutting-Edge Technology</CardTitle>
                <CardDescription>
                  Experiment with the latest frameworks and tools
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              Get hands-on experience with emerging technologies. Whether it's AI, blockchain,
              AR/VR, or web development, SemiColon provides the platform to turn your
              innovative ideas into reality.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Terminal className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Mentorship & Support</CardTitle>
                <CardDescription>
                  Learn from industry experts throughout the event
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              Our experienced mentors from leading tech companies will be available
              to guide you, provide feedback, and help you overcome technical challenges
              during the hackathon.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <FlaskConical className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Amazing Prizes</CardTitle>
                <CardDescription>
                  Win recognition and valuable rewards
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              Compete for exciting prizes including cash awards, internship opportunities,
              developer tools, and more. The total prize pool for SemiColon 2025
              exceeds $20,000!
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
        <p className="mb-6">
          At SemiColon, we believe in the power of technology to transform lives. Our mission
          is to foster innovation, encourage collaboration, and create a community of problem-solvers
          who are passionate about making a positive impact through code.
        </p>
        
        <h3 className="text-xl font-semibold mb-4">Why Participate?</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Network with industry professionals and fellow developers</li>
          <li>Enhance your technical skills and learn new technologies</li>
          <li>Add impressive projects to your portfolio</li>
          <li>Win attractive prizes and potential job opportunities</li>
          <li>Develop solutions that can make a real difference</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutSection;
