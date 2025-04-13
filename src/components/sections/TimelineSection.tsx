
import React from "react";
import { Calendar, Clock } from "lucide-react";

interface TimelineEventProps {
  time: string;
  date: string;
  title: string;
  description: string;
  isLeft?: boolean;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ time, date, title, description, isLeft = false }) => {
  return (
    <div className={`flex items-center gap-4 mb-10 ${isLeft ? 'flex-row-reverse' : ''}`}>
      <div className={`w-1/2 ${isLeft ? 'text-right' : ''}`}>
        <div className="flex items-center gap-2 text-primary mb-1">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{time}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{date}</span>
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="relative flex flex-col items-center">
        <div className="h-full w-0.5 bg-border absolute" />
        <div className="w-5 h-5 rounded-full bg-primary z-10" />
      </div>
      
      <div className="w-1/2" />
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
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-10 text-center">Hackathon Timeline</h2>
      
      <div className="relative mx-auto max-w-3xl px-6">
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
