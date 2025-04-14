import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Code, 
  Users, 
  Award, 
  ExternalLink, 
  ChevronRight,
  Terminal,
  Clock,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Parallax } from 'react-scroll-parallax';
import CountUp from 'react-countup';

// Typing effect with cursor animation
const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 70);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);
  
  return (
    <span className="inline-block">
      {displayedText}
      <span className="animate-blink">|</span>
    </span>
  );
};

// Feature card with subtle hover effect
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  delay?: number;
}> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="flex-1 bg-card shadow-md rounded-lg p-6 border border-border transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-sm text-muted-foreground">
        {description}
      </div>
    </motion.div>
  );
};

// Track badge with minimal hover effect
const TrackBadge: React.FC<{ name: string; index: number }> = ({ name, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="inline-flex items-center px-3 py-1 m-1 rounded-full bg-secondary text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
    >
      <span className="font-medium">{name}</span>
    </motion.div>
  );
};

// Code animation with clean styling
const CodeAnimation: React.FC = () => {
  const codeLines = [
    { text: "const hackathon = new Hackathon('SemiColon 2025');", delay: 0 },
    { text: "hackathon.setPrize('$20,000+');", delay: 1 },
    { text: "hackathon.setDuration('48 hours');", delay: 2 },
    { text: "hackathon.setTracks(['Web/Mobile', 'AI/ML', 'Blockchain', 'AR/VR', 'Open']);", delay: 3 },
    { text: "hackathon.start();", delay: 4 },
  ];

  return (
    <div className="w-full rounded-md overflow-hidden shadow-md bg-black bg-opacity-90 border border-zinc-700">
      <div className="px-4 py-2 text-sm font-medium flex items-center justify-between border-b border-zinc-700 bg-zinc-900">
        <span className="text-xs text-zinc-400">semicolon.js</span>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="p-4">
        {codeLines.map((line, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: line.delay }}
            className="text-sm font-mono mb-2"
          >
            <span className="text-blue-400">{'>'}</span>
            <span className="text-green-400 ml-2">
              <TypingEffect text={line.text} />
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Countdown timer with subtle design
const CountdownTimer: React.FC = () => {
  const targetDate = new Date("2025-08-20T00:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center space-x-4 my-8">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="flex flex-col items-center">
          <div className="text-4xl font-bold bg-card border border-border rounded-lg w-16 h-16 flex items-center justify-center shadow-sm">
            {value}
          </div>
          <div className="text-xs uppercase mt-2 text-muted-foreground font-medium">
            {key}
          </div>
        </div>
      ))}
    </div>
  );
};

const HomeSection: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const tracks = ["Web/Mobile", "AI/ML", "Blockchain", "AR/VR", "Open Innovation"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Minimalist Clean Design */}
      <div className="relative bg-gradient-to-b from-background via-background to-background pt-20 pb-20">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="max-w-5xl mx-auto text-center px-4">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-block px-4 py-1 rounded-md bg-secondary text-foreground mb-6">
              <span className="text-sm font-medium">August 20-22, 2025</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            <span className="text-primary">Semicolon</span> 2025
          </motion.h1>
          
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            A premier 48-hour global hackathon with $20,000+ in prizes
          </motion.p>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrackIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="mb-10 h-8"
            >
              <span className="text-base bg-primary/10 px-3 py-1 rounded-md text-primary">
                #{tracks[currentTrackIndex]}
              </span>
            </motion.div>
          </AnimatePresence>
          
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-md shadow-sm"
            >
              Register Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 rounded-md border-primary/20"
            >
              Learn More
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
          
          {/* Countdown Timer */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <p className="text-lg mb-2 text-muted-foreground font-medium flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2" />
              Registration Closes In:
            </p>
            <CountdownTimer />
          </motion.div>
        </div>
      </div>
      
      {/* Code Animation Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <Parallax translateY={[-10, 10]} className="mb-12">
            <CodeAnimation />
          </Parallax>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-3">Why Participate?</h2>
              <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Join hundreds of developers from around the world in this exciting 
                48-hour coding marathon and showcase your skills.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <FeatureCard 
              icon={<Award className="h-6 w-6" />}
              title="Top Prizes"
              delay={0.1}
              description={
                <>
                  <p className="mb-3">Compete for amazing rewards worth over $20,000:</p>
                  <ul className="space-y-2 list-none">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Cash awards up to $10,000</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Latest tech gadgets</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Internship opportunities</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Cloud credits & software licenses</span>
                    </li>
                  </ul>
                </>
              }
            />
            
            <FeatureCard 
              icon={<Calendar className="h-6 w-6" />}
              title="Key Dates"
              delay={0.2}
              description={
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span>Registration Opens</span>
                    <span className="font-semibold">April 15, 2025</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span>Hackathon Kickoff</span>
                    <span className="font-semibold">August 20, 2025</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span>Project Submission</span>
                    <span className="font-semibold">August 22, 2025</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Winners Announced</span>
                    <span className="font-semibold">August 25, 2025</span>
                  </div>
                </div>
              }
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <FeatureCard 
              icon={<Code className="h-6 w-6" />}
              title="Innovation Tracks"
              delay={0.3}
              description={
                <>
                  <p className="mb-4">Choose from five exciting tracks to showcase your skills:</p>
                  <div className="flex flex-wrap">
                    <TrackBadge name="Web/Mobile" index={0} />
                    <TrackBadge name="AI/ML" index={1} />
                    <TrackBadge name="Blockchain" index={2} />
                    <TrackBadge name="AR/VR" index={3} />
                    <TrackBadge name="Open Innovation" index={4} />
                  </div>
                </>
              }
            />
            
            <FeatureCard 
              icon={<Users className="h-6 w-6" />}
              title="Expert Support"
              delay={0.4}
              description={
                <>
                  <p className="mb-3">Get guidance from industry professionals throughout the hackathon:</p>
                  <ul className="space-y-2 list-none">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>1:1 mentorship from tech leaders</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Technical workshops & resources</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Career guidance & networking</span>
                    </li>
                  </ul>
                </>
              }
            />
          </div>
        </div>
      </section>
      
      {/* Global Participation Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-3">Global Community</h2>
              <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Join participants from over 50 countries in this global coding event.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 border border-border text-center shadow-sm"
            >
              <Terminal className="h-8 w-8 mx-auto mb-2 text-primary" />
              <motion.h3 className="text-3xl font-bold mb-2">
                <CountUp end={500} suffix="+" duration={1.5} delay={0.2} />
              </motion.h3>
              <p className="text-sm text-muted-foreground">Teams</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 border border-border text-center shadow-sm"
            >
              <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
              <motion.h3 className="text-3xl font-bold mb-2">
                <CountUp end={50} suffix="+" duration={1.5} delay={0.4} />
              </motion.h3>
              <p className="text-sm text-muted-foreground">Countries</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 border border-border text-center shadow-sm"
            >
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <motion.h3 className="text-3xl font-bold mb-2">
                <CountUp end={48} duration={1.5} delay={0.6} />
              </motion.h3>
              <p className="text-sm text-muted-foreground">Hours</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 border border-border text-center shadow-sm"
            >
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <motion.h3 className="text-3xl font-bold mb-2">
                <CountUp end={100} suffix="+" duration={1.5} delay={0.8} />
              </motion.h3>
              <p className="text-sm text-muted-foreground">Projects</p>
            </motion.div>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">Global Collaboration</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with developers from around the world to form teams, share ideas, and create innovative solutions 
                  to real-world problems. SemiColon 2025 brings together diverse perspectives and skill sets.
                </p>
                <Button 
                  className="text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground"
                  variant="outline"
                >
                  Find Team Members
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="hidden md:block">
                <div className="relative overflow-hidden rounded-lg aspect-square">
                  <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
                  <Globe className="h-24 w-24 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Previous Winners Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-lg p-8 border border-border shadow-sm"
          >
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Previous Winners</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Check out the winning projects from last year's hackathon for inspiration.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((item) => (
                <motion.div 
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-lg aspect-video bg-muted"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Project {item}</h3>
                      <p className="text-sm text-muted-foreground">2024 Winner - Track {item}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline" className="px-6 py-2">
                <span>View All Winners</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-lg p-12 border border-border shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <Code className="h-6 w-6" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Ready to Code?</h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Limited slots available. Registration closes on May 10, 2025.
            </p>
            
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-md"
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="mt-6 text-sm text-muted-foreground">
              Join 500+ teams from 50+ countries
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;
