import React, { useState, useEffect } from "react";
import VSCodeLayout from "../components/VSCodeLayout";
import AboutSection from "../components/sections/AboutSection";
import TimelineSection from "../components/sections/TimelineSection";
import TracksSection from "../components/sections/TracksSection";
import JudgesSection from "../components/sections/JudgesSection";
import TeamSection from "../components/sections/TeamSection";
import FAQSection from "../components/sections/FAQSection";
import SponsorsSection from "../components/sections/SponsorsSection";
import HomeSection from "../components/sections/HomeSection";
import MarketplaceSection from "../components/sections/MarketplaceSection";
import InstalledExtensionsSection from "../components/sections/InstalledExtensionsSection";
import { ExtensionProvider, useExtensions } from "../contexts/ExtensionContext";
import { ThemeProvider } from "../hooks/useTheme";

// Content wrapper component that applies theme colors from extensions
const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getActiveThemeColors } = useExtensions();
  const themeColors = getActiveThemeColors();
  
  // Apply theme styles from active extensions to root element
  useEffect(() => {
    const root = document.documentElement;
    
    // Reset any previously set theme variables
    const customProps = Array.from(root.style).filter(prop => prop.startsWith('--'));
    customProps.forEach(prop => {
      root.style.removeProperty(prop);
    });
    
    // Apply new theme colors
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    return () => {
      // Cleanup function to reset custom properties when unmounting
      customProps.forEach(prop => {
        root.style.removeProperty(prop);
      });
    };
  }, [themeColors]);
  
  return <>{children}</>;
};

const IndexContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");

  // Listen for custom navigation events from other components
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      setActiveSection(event.detail);
    };
    
    document.addEventListener('navigate-section', handleNavigate as EventListener);
    
    return () => {
      document.removeEventListener('navigate-section', handleNavigate as EventListener);
    };
  }, []);

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
      case "marketplace":
        return <MarketplaceSection />;
      case "installed":
        return <InstalledExtensionsSection />;
      case "search-results":
      case "changes":
      case "commits":
      case "debug-console":
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
      <ContentWrapper>
        {renderContent()}
      </ContentWrapper>
    </VSCodeLayout>
  );
};

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <ExtensionProvider>
        <IndexContent />
      </ExtensionProvider>
    </ThemeProvider>
  );
};

export default Index;
