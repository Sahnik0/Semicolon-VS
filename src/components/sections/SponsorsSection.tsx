
import React from "react";

const SponsorsSection = () => {
  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Our Sponsors</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Gold Sponsors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-lg p-6 flex items-center justify-center h-28">
                <div className="text-center">
                  <div className="text-lg font-medium">Sponsor {i}</div>
                  <div className="text-sm text-muted-foreground">Gold Tier</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Silver Sponsors</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-border rounded-lg p-4 flex items-center justify-center h-20">
                <div className="text-center">
                  <div className="text-base font-medium">Sponsor {i}</div>
                  <div className="text-xs text-muted-foreground">Silver Tier</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Bronze Sponsors</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-border rounded-lg p-3 flex items-center justify-center h-16">
                <div className="text-center text-sm font-medium">Sponsor {i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Become a Sponsor</h3>
        <p className="mb-4">
          Interested in sponsoring our hackathon? Reach out to us for sponsorship opportunities.
        </p>
        <button className="bg-primary text-white px-4 py-2 rounded">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default SponsorsSection;
