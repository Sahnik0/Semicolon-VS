import React, { useState, useEffect, useRef } from "react";
import { Calendar, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface TimelineEventProps {
  time: string;
  date: string;
  title: string;
  description: string;
  isLeft?: boolean;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ 
  time, 
  date, 
  title, 
  description, 
  isLeft = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const eventRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (eventRef.current) {
      observer.observe(eventRef.current);
    }

    return () => {
      if (eventRef.current) {
        observer.unobserve(eventRef.current);
      }
    };
  }, []);

  const toggleDescription = () => {
    setIsOpen(!isOpen);
  };

  const animationClass = isInView 
    ? isLeft 
      ? "opacity-100 translate-x-0" 
      : "opacity-100 translate-x-0" 
    : isLeft 
      ? "opacity-0 -translate-x-16" 
      : "opacity-0 translate-x-16";

  return (
    <div 
      ref={eventRef}
      className={`relative mb-16 ${isLeft ? 'ml-auto mr-0' : 'ml-0 mr-auto'} max-w-md transition-all duration-700 ease-out transform ${animationClass}`}
    >
      {/* Card content */}
      <div className={`bg-card border border-border rounded-lg shadow-md p-4 relative z-10 ${isLeft ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center gap-2 text-primary mb-1">
          {isLeft ? (
            <>
              <span className="text-sm">{time}</span>
              <Clock className="h-4 w-4" />
            </>
          ) : (
            <>
              <Clock className="h-4 w-4" />
              <span className="text-sm">{time}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          {isLeft ? (
            <>
              <span className="text-sm">{date}</span>
              <Calendar className="h-4 w-4" />
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{date}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={toggleDescription}
            aria-label={isOpen ? "Hide description" : "Show description"}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {/* Timeline marker */}
      <div className={`absolute top-6 ${isLeft ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'} z-20`}>
        <div className={`w-5 h-5 rounded-full bg-primary transition-all duration-700 delay-300 ${isInView ? 'scale-100' : 'scale-0'}`}></div>
      </div>
      
      {/* Timeline line */}
      <div className="absolute h-full top-0 w-px bg-border z-0 left-1/2 transform -translate-x-1/2"></div>
    </div>
  );
};

const TimelineSection: React.FC = () => {
  const events = [
    {
      time: "10:00 AM",
      date: "April 20, 2025",
      title: "Opening Ceremony",
      description: "Welcome address, introduction to tracks and rules, keynote speaker session",
    },
    {
      time: "11:30 AM",
      date: "April 20, 2025",
      title: "Team Formation",
      description: "Find team members, register your team, and brainstorm ideas",
      isLeft: true,
    },
    {
      time: "12:00 PM",
      date: "April 20, 2025",
      title: "Hacking Begins",
      description: "Start coding your projects. Mentors available for guidance",
    },
    {
      time: "7:00 PM",
      date: "April 20, 2025",
      title: "Workshop Session I",
      description: "AI/ML Workshop: Building Intelligent Applications",
      isLeft: true,
    },
    {
      time: "10:00 AM",
      date: "April 21, 2025",
      title: "Workshop Session II",
      description: "Blockchain Workshop: Creating Your First Smart Contract",
    },
    {
      time: "2:00 PM",
      date: "April 21, 2025",
      title: "Midway Check-in",
      description: "Project progress review with mentors and initial feedback",
      isLeft: true,
    },
    {
      time: "8:00 PM",
      date: "April 21, 2025",
      title: "Gaming Break",
      description: "Take a break from coding and join our mini gaming tournament",
    },
    {
      time: "12:00 PM",
      date: "April 22, 2025",
      title: "Hacking Ends",
      description: "Code freeze and final submission of projects",
      isLeft: true,
    },
    {
      time: "1:00 PM",
      date: "April 22, 2025",
      title: "Lunch Break",
      description: "Networking lunch before presentations",
    },
    {
      time: "2:00 PM",
      date: "April 22, 2025",
      title: "Project Presentations",
      description: "Teams present their projects to judges and participants",
      isLeft: true,
    },
    {
      time: "5:00 PM",
      date: "April 22, 2025",
      title: "Awards Ceremony",
      description: "Announcement of winners, prize distribution and closing remarks",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-10 text-center">Hackathon Timeline</h2>
      
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border transform -translate-x-1/2"></div>
        
        {events.map((event, index) => (
          <TimelineEvent
            key={index}
            time={event.time}
            date={event.date}
            title={event.title}
            description={event.description}
            isLeft={event.isLeft}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineSection;