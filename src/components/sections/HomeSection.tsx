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
  MousePointer,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Parallax } from 'react-scroll-parallax';
import CountUp from 'react-countup';

// Fancy typing effect with cursor blink animation
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

// Enhanced feature card with hover effects and animations
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
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="flex-1 bg-secondary/40 backdrop-blur rounded-lg p-6 border border-border hover:shadow-xl transition-all duration-300 hover:bg-secondary/60"
    >
      <div className="flex items-center mb-4">
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4"
        >
          {icon}
        </motion.div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-sm text-muted-foreground">
        {description}
      </div>
    </motion.div>
  );
};

// Interactive track badge with pulse effect on hover
const TrackBadge: React.FC<{ name: string; index: number }> = ({ name, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--primary-rgb), 0.2)" }}
      className="inline-flex items-center px-3 py-1 m-1 rounded-full bg-primary/10 border border-primary/20 text-sm hover:bg-primary/20 transition-colors cursor-pointer"
    >
      <span className="text-primary font-medium">{name}</span>
    </motion.div>
  );
};

// Animated code display with typing effect
const CodeAnimation: React.FC = () => {
  const codeLines = [
    { text: "const hackathon = new Hackathon('SemiColon 2025');", delay: 0 },
    { text: "hackathon.setPrize('$20,000+');", delay: 1 },
    { text: "hackathon.setDuration('48 hours');", delay: 2 },
    { text: "hackathon.setTracks(['Web/Mobile', 'AI/ML', 'Blockchain', 'AR/VR', 'Open']);", delay: 3 },
    { text: "hackathon.start();", delay: 4 },
    { text: "// Get ready to code, innovate and win!", delay: 5 },
  ];

  return (
    <div className="w-full rounded-md overflow-hidden shadow-lg bg-black bg-opacity-80 backdrop-blur-sm border border-zinc-700 transform perspective-1000 relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-primary/5 to-transparent opacity-40 pointer-events-none"></div>
      <div className="px-4 py-2 text-sm font-medium flex items-center justify-between border-b border-zinc-700 bg-zinc-900">
        <span className="text-xs text-zinc-400">semicolon.js</span>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="p-4 relative">
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
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 6, duration: 1 }}
          className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"
        />
      </div>
    </div>
  );
};

// Dynamic countdown timer with pulse animation
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
          <motion.div 
            className="text-4xl font-bold bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-lg w-16 h-16 flex items-center justify-center text-primary shadow-lg"
            animate={{ scale: value === 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.5, repeat: value === 0 ? Infinity : 0 }}
          >
            {value}
          </motion.div>
          <div className="text-xs uppercase mt-2 text-muted-foreground font-medium">
            {key}
          </div>
        </div>
      ))}
    </div>
  );
};

// Floating particle animation for background
const ParticleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{ 
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          }}
          transition={{ 
            duration: Math.random() * 20 + 20, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          style={{ width: `${Math.random() * 8 + 2}px`, height: `${Math.random() * 8 + 2}px` }}
        />
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with dynamic background effects */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-b from-primary/5 to-transparent pt-28 pb-24 px-4"
      >
        <ParticleBackground />
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm border border-primary/20 shadow-lg">
              <span className="text-sm font-medium">August 20-22, 2025</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary"
          >
            SemiColon 2025
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto mb-6 rounded-full"
          />
          
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
          >
            48-Hour Global Hackathon with $20,000+ in Prizes
          </motion.p>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrackIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mb-8 h-8"
            >
              <span className="text-lg text-primary-foreground bg-primary/80 px-3 py-1 rounded-md">
                <span className="opacity-80 mr-2">#</span>
                {tracks[currentTrackIndex]}
              </span>
            </motion.div>
          </AnimatePresence>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="group bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-primary/25 hover:shadow-2xl transition-all duration-300"
            >
              Register Now
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                className="ml-2 inline-flex"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.span>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="group px-8 py-6 text-lg font-medium rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all"
            >
              Learn More
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                className="ml-2 inline-flex"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.span>
            </Button>
          </motion.div>
          
          {/* Countdown Timer with enhanced visuals */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <p className="text-lg mb-2 text-muted-foreground font-medium flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Registration Closes In:
            </p>
            <CountdownTimer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-muted-foreground"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MousePointer className="h-6 w-6" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Code Animation Section with parallax effect */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/30 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto">
          <Parallax translateY={[-20, 20]} className="mb-12">
            <CodeAnimation />
          </Parallax>
        </div>
      </section>
      
      {/* Features Section with improved cards */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-50"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium bg-primary/10 px-4 py-1 rounded-full text-sm mb-4 inline-block">
              BENEFITS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Participate?</h2>
            <motion.div 
              className="w-24 h-1 bg-primary mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            ></motion.div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of developers from around the world in this exciting 
              48-hour coding marathon and showcase your skills.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <FeatureCard 
              icon={<Award className="h-6 w-6 text-primary" />}
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
              icon={<Calendar className="h-6 w-6 text-primary" />}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <FeatureCard 
              icon={<Code className="h-6 w-6 text-primary" />}
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
              icon={<Users className="h-6 w-6 text-primary" />}
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
      
      {/* Global Participation with animated stats */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/20 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium bg-primary/10 px-4 py-1 rounded-full text-sm mb-4 inline-block">
                COMMUNITY
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Global Community</h2>
              <motion.div 
                className="w-24 h-1 bg-primary mx-auto mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              ></motion.div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join participants from over 50 countries in this global coding event.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-secondary/40 backdrop-blur rounded-lg p-6 border border-border text-center hover:border-primary/30 transition-all duration-300"
            >
              <Terminal className="h-8 w-8 mx-auto mb-2 text-primary" />
              <motion.h3 
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <CountUp end={500} suffix="+" duration={1.5} delay={0.2} />
              </motion.h3>
              <p className="text-sm text-muted-foreground">Teams</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-secondary/40 backdrop-blur rounded-lg p-6 border border-border text-center hover:border-primary/30 transition-all duration-300"
            >
              <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
              <motion.h3 
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <CountUp end={50} suffix="+" duration={1.5} delay={0.4} />
              </motion.h3>
              <p className="text-sm text-muted-foreground">Countries</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-secondary/40 backdrop-blur rounded-lg p-6 border border-border text-center hover:border-primary/30 transition-all duration-300"
            >
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <motion.h3 
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <CountUp end={48} duration={1.5} delay={0.6} />
              </motion.h3>
              <p className="text-sm text-muted-foreground">Hours</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-secondary/40 backdrop-blur rounded-lg p-6 border border-border text-center hover:border-primary/30 transition-all duration-300"
            >
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <motion.h3 
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <CountUp end={100} suffix="+" duration={1.5} delay={0.8} />
              </motion.h3>
              <p className="text-sm text-muted-foreground">Projects</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 to-secondary/30 rounded-2xl p-8 border border-primary/10 shadow-lg shadow-primary/5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">Global Collaboration</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with developers from around the world to form teams, share ideas, and create innovative solutions 
                  to real-world problems. SemiColon 2025 brings together diverse perspectives and skill sets.
                </p>
                <Button 
                  className="group text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground"
                  variant="outline"
                >
                  Find Team Members
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="relative">
                <div className="absolute -inset-4">
                  <div className="w-full h-full max-w-sm mx-auto bg-gradient-to-r from-primary/20 to-purple-500/20 blur-lg filter opacity-70 rounded-full"></div>
                </div>
                <div className="relative overflow-hidden rounded-full aspect-square border-primary-foreground">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ ease: "linear", duration: 30, repeat: Infinity }}
                    className="absolute inset-0 scale-[1.3]"
                    style={{ 
                      backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Simple_world_map.svg/1280px-Simple_world_map.svg.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.3
                    }}
                  />
                  <motion.div 
                    className="absolute"
                    animate={{ rotate: -360 }}
                    transition={{ ease: "linear", duration: 30, repeat: Infinity }}
                  >
                    <Globe className="h-20 w-20 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Previous Winners with gallery preview */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-secondary/40 backdrop-blur rounded-xl p-12 border border-border hover:shadow-xl transition-all duration-300 shadow-lg"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                viewport={{ once: true }}
                className="mx-auto mb-6 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center"
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-3">Previous Winners</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Check out the winning projects from last year's hackathon for inspiration and see what 
                kind of innovative solutions make it to the top!
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
                  whileHover={{ scale: 1.03, y: -5 }}
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
              <Button variant="outline" className="group text-lg px-8 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <span>View All Winners</span>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="inline-flex ml-2"
                >
                  <ExternalLink className="h-4 w-4" />
                </motion.div>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action with animated elements */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent"></div>
        <ParticleBackground />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-background/80 to-background/60 backdrop-blur-sm rounded-2xl p-12 border border-primary/10 shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6"
            >
              <Code className="h-8 w-8" />
            </motion.div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Code?
            </motion.h2>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground mb-8"
            >
              Limited slots available. Registration closes on May 10, 2025.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button 
                size="lg" 
                className="group bg-primary hover:bg-primary/90 text-white px-10 py-7 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
              >
                Register Now
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="ml-2 inline-flex"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              viewport={{ once: true }}
              className="mt-8 text-sm text-muted-foreground"
            >
              Join 500+ teams from 50+ countries
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;
