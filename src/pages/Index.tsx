
import React, { useState } from "react";
import VSCodeLayout from "../components/VSCodeLayout";
import AboutSection from "../components/sections/AboutSection";
import TimelineSection from "../components/sections/TimelineSection";
import TracksSection from "../components/sections/TracksSection";
import JudgesSection from "../components/sections/JudgesSection";
import TeamSection from "../components/sections/TeamSection";
import FAQSection from "../components/sections/FAQSection";
import SponsorsSection from "../components/sections/SponsorsSection";
import HomeSection from "../components/sections/HomeSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection />;
      case "about":
        return <AboutSection />;
      case "timeline":
        return <TimelineSection />;
      case "tracks":
        return <TracksSection />;
      case "judges":
        return <JudgesSection />;
      case "team":
        return <TeamSection />;
      case "faq":
        return <FAQSection />;
      case "sponsors":
        return <SponsorsSection />;
      case "search-results":
      case "changes":
      case "commits":
      case "debug-console":
      case "installed":
      case "marketplace":
        // Adding dummy content for the additional sidebar options
        return (
          <div className="p-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">{activeSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
            <p className="mb-4">
              This is a placeholder for the {activeSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} section.
              In a real VS Code environment, this would contain actual content.
            </p>
            <div className="bg-secondary/40 p-6 rounded-lg border border-border">
              <pre className="text-sm">
                <code>
                  // Example content for {activeSection}
                  console.log("Hello from {activeSection}!");
                </code>
              </pre>
            </div>
          </div>
        );
      default:
        return <HomeSection />;
    }
  };

  return (
    <VSCodeLayout 
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </VSCodeLayout>
  );
};

export default Index;
