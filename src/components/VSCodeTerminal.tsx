import React, { useState, useEffect, useRef } from "react";
import { X, Minimize, Maximize, ChevronRight, TerminalSquare, GripHorizontal } from "lucide-react";

interface TerminalCommand {
  command: string;
  output: string;
  loading?: boolean;
  id: string;
}

interface VSCodeTerminalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const VSCodeTerminal: React.FC<VSCodeTerminalProps> = ({ isOpen, setIsOpen }) => {
  const [height, setHeight] = useState(250);
  const [input, setInput] = useState("");
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [history, setHistory] = useState<TerminalCommand[]>([
    { 
      command: "hackathon --info", 
      output: "SemiColon - A 48-hour hackathon focused on innovative solutions.",
      id: "initial" 
    }
  ]);
  const [startDragging, setStartDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [loadingFrame, setLoadingFrame] = useState(0);
  const [showStartupAnimation, setShowStartupAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Terminal spinner animation frames
  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  // Improved airplane animation frames (with trail)
  const airplaneFrames = [
    "                                            ",
    "✈                                           ",
    "═✈                                          ",
    "══✈                                         ",
    "═══✈                                        ",
    "════✈                                       ",
    "═════✈                                      ",
    "══════✈                                     ",
    "═══════✈                                    ",
    "════════✈                                   ",
    "═════════✈                                  ",
    "══════════✈                                 ",
    "═══════════✈                                ",
    "════════════✈                               ",
    "═════════════✈                              ",
    "══════════════✈                             ",
    "═══════════════✈                            ",
    "════════════════✈                           ",
    "═════════════════✈                          ",
    "══════════════════✈                         ",
    "═══════════════════✈                        ",
    "════════════════════✈                       ",
    "═════════════════════✈                      ",
    "══════════════════════✈                     ",
    "═══════════════════════✈                    ",
    "════════════════════════✈                   ",
    "═════════════════════════✈                  ",
    "══════════════════════════✈                 ",
    "═══════════════════════════✈                ",
    "════════════════════════════✈               ",
    "═════════════════════════════✈              ",
    "══════════════════════════════✈             ",
    "═══════════════════════════════✈            ",
    "════════════════════════════════✈           ",
    "═════════════════════════════════✈          ",
    "══════════════════════════════════✈         ",
  ];
  // SemiColon stylized text animation (appears character by character)
  const semiColonText = [
    " ███████╗███████╗███╗   ███╗██╗ ██████╗ ██████╗ ██╗      ██████╗ ███╗   ██╗ ",
    " ██╔════╝██╔════╝████╗ ████║██║██╔════╝██╔═══██╗██║     ██╔═══██╗████╗  ██║ ",
    " ███████╗█████╗  ██╔████╔██║██║██║     ██║   ██║██║     ██║   ██║██╔██╗ ██║ ",
    " ╚════██║██╔══╝  ██║╚██╔╝██║██║██║     ██║   ██║██║     ██║   ██║██║╚██╗██║ ",
    " ███████║███████╗██║ ╚═╝ ██║██║╚██████╗╚██████╔╝███████╗╚██████╔╝██║ ╚████║ ",
    " ╚══════╝╚══════╝╚═╝     ╚═╝╚═╝ ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ ",
    "",
    " ⚡️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡️ ",
    "       INNOVATE  •  CREATE  •  COLLABORATE  •  CODE  •  CONNECT           ",
    " 🔥━━━━━━━━━━━━━━━━━━━━━━━━━ HACKATHON 2025 ━━━━━━━━━━━━━━━━━━━━━━━━━━━🔥 ",
    ""
  ];
  
  // Color assignments for each line for gradient effect during animation
  const lineColors = [
    'text-cyan-400 font-bold',
    'text-blue-400 font-bold',
    'text-indigo-500 font-bold',
    'text-violet-500 font-bold',
    'text-purple-400 font-bold',
    'text-cyan-400 font-bold',
    'text-transparent',
    'text-yellow-400',
    'text-emerald-400 font-bold',
    'text-yellow-400',
    'text-transparent'
  ];
// Handle startup animation when terminal is first opened
useEffect(() => {
  if (isOpen && !animationComplete) {
    setShowStartupAnimation(true);
    setAnimationStep(0);
    
    // Run airplane animation
    const runAirplaneAnimation = () => {
      animationRef.current = setTimeout(() => {
        setAnimationStep(prev => {
          if (prev < airplaneFrames.length - 1) {
            animationRef.current = setTimeout(runAirplaneAnimation, 60);
            return prev + 1;
          } else {
            // Move to SemiColon text animation
            animationRef.current = setTimeout(runSemiColonAnimation, 200);
            return 0;
          }
        });
      }, 60);
    };
    
    // Run SemiColon text animation
    const runSemiColonAnimation = () => {
      let charIndex = 0;
      const maxChars = semiColonText.join('').length;
      
      const typeCharacter = () => {
        animationRef.current = setTimeout(() => {
          charIndex++;
          setAnimationStep(charIndex);
          
          if (charIndex < maxChars) {
            // Gradually slow down the animation as it progresses
            const speedFactor = Math.max(1, 5 - Math.floor(charIndex / (maxChars / 5)));
            animationRef.current = setTimeout(typeCharacter, 5 * speedFactor);
          } else {
            // Complete animation and show command prompt
            setTimeout(() => {
              setAnimationComplete(true);
              setShowStartupAnimation(false);
              // Clear history and add welcome message
              setHistory([
                { 
                  command: "welcome", 
                  output: "Welcome to SemiColon Terminal! Type 'help' for available commands.",
                  id: "welcome" 
                }
              ]);
              // Focus the input field
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 800);
          }
        }, 5);
      };
      
      typeCharacter();
    };
    
    runAirplaneAnimation();
  }
  
  // Cleanup animation timeouts
  return () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };
}, [isOpen, animationComplete]);

useEffect(() => {
  // Handle loading animation
  const animateLoading = () => {
    const hasLoadingCommand = history.some(cmd => cmd.loading);
    
    if (hasLoadingCommand) {
      setLoadingFrame(prev => (prev + 1) % spinnerFrames.length);
      loadingRef.current = setTimeout(animateLoading, 80);
    } else if (loadingRef.current) {
      clearTimeout(loadingRef.current);
      loadingRef.current = null;
    }
  };

  if (history.some(cmd => cmd.loading) && !loadingRef.current) {
    animateLoading();
  }

  return () => {
    if (loadingRef.current) {
      clearTimeout(loadingRef.current);
    }
  };
}, [history, loadingFrame, spinnerFrames.length]);

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (startDragging) {
      const delta = startY - e.clientY;
      setHeight((prevHeight) => Math.min(Math.max(prevHeight + delta, 150), 500));
      setStartY(e.clientY);
    } else if (isGrabbing && !isOpen) {
      // When grabbing the collapsed terminal handle
      if (e.clientY < window.innerHeight - 60) {
        setIsOpen(true);
        setHeight(250);
      }
    }
  };

  const handleMouseUp = () => {
    setStartDragging(false);
    setIsGrabbing(false);
    document.body.style.cursor = "default";
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}, [startDragging, startY, isGrabbing, isOpen, setIsOpen]);

useEffect(() => {
  if (isOpen && terminalRef.current && !showStartupAnimation) {
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    
    // Focus the input when terminal is opened and animation is complete
    if (inputRef.current && animationComplete) {
      inputRef.current.focus();
    }
  }
}, [history, isOpen, showStartupAnimation, animationComplete]);

const handleMouseDown = (e: React.MouseEvent) => {
  setStartDragging(true);
  setStartY(e.clientY);
  e.preventDefault();
};

const handleGripMouseDown = (e: React.MouseEvent) => {
  setIsGrabbing(true);
  document.body.style.cursor = "ns-resize";
  e.preventDefault();
};

const handleInputSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!input.trim()) return;

  const commandId = `cmd-${Date.now()}`;
  
  // Add command to history with loading state
  setHistory((prev) => [
    ...prev, 
    { command: input, output: "", loading: true, id: commandId }
  ]);
  
  setInput("");

  // Simulate command execution with random delay (300-1500ms)
  const executionTime = Math.random() * 1200 + 300;
  
  setTimeout(() => {
    setHistory((prev) => 
      prev.map(cmd => 
        cmd.id === commandId 
          ? { ...cmd, output: getCommandOutput(cmd.command), loading: false } 
          : cmd
      )
    );
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, executionTime);
};

const getCommandOutput = (cmd: string): string => {
  const command = cmd.trim().toLowerCase();
  
  if (command === "help" || command === "--help") {
    return `Available commands:
help             - Show this help message
clear            - Clear the terminal
hackathon --info - Show hackathon information
tracks           - List all hackathon tracks
timeline         - Show hackathon timeline
team             - Show hackathon team`;
  } else if (command === "clear") {
    setTimeout(() => {
      setHistory([]);
    }, 0);
    return "";
  } else if (command === "hackathon --info") {
    return "SemiColon 2025 - A 48-hour hackathon focused on innovative solutions.";
  } else if (command === "tracks") {
    return `Available tracks:
1. Web/Mobile Development
2. AI/ML Solutions
3. Blockchain Innovation
4. AR/VR Experiences
5. Open Innovation`;
  } else if (command === "timeline") {
    return `Hackathon Timeline:
Day 1 - April 20, 2025:
  10:00 AM - Opening Ceremony
  11:00 AM - Team Formation
  12:00 PM - Hacking Begins

Day 2 - April 21, 2025:
  Continues Hacking
  2:00 PM - Midway Check-in

Day 3 - April 22, 2025:
  12:00 PM - Hacking Ends
  2:00 PM - Presentations
  5:00 PM - Awards Ceremony`;
  } else if (command === "team") {
    return `Hackathon Team:
Organizers: Jane Doe, John Smith
Technical Support: Alex Johnson, Sam Brown
Mentors: Dr. Lisa Chen, Prof. Michael Williams`;
  } else {
    return `Command not found: ${command}. Type 'help' for available commands.`;
  }
};

// Render airplane animation frame
const renderAirplaneAnimation = () => {
  return (
    <div className="text-cyan-400 my-2">
      <pre className="m-0 p-0 font-mono" style={{ lineHeight: '1', letterSpacing: '0px' }}>
        {airplaneFrames[animationStep]}
      </pre>
    </div>
  );
};

// Render SemiColon text animation with text highlighting effects
const renderSemiColonText = () => {
  let totalChars = 0;
  const animatedText = semiColonText.map(line => {
    const chars = line.split('');
    const renderedLine = chars.map((char, i) => {
      const charIndex = totalChars + i;
      return charIndex <= animationStep ? char : ' ';
    }).join('');
    totalChars += chars.length;
    return renderedLine;
  });

  return (
    <div className="my-2 font-mono">
      {animatedText.map((line, i) => (
        <pre key={i} className={`m-0 p-0 ${lineColors[i]}`} style={{ lineHeight: '1', letterSpacing: '0px' }}>
          {line}
        </pre>
      ))}
    </div>
  );
};

// Function to apply text rainbow effect
const applyRainbowEffect = (text: string) => {
  const colors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-blue-400', 'text-indigo-400', 'text-purple-400'];
  return text.split('').map((char, i) => (
    <span key={i} className={colors[i % colors.length]}>
      {char}
    </span>
  ));
};

return (
  <>
    {/* Terminal grip handle - always visible */}
    <div 
      className={`absolute bottom-0 left-0 right-0 h-1 bg-border/50 cursor-ns-resize flex items-center justify-center ${isOpen ? 'z-40' : 'z-30'}`}
      onMouseDown={isOpen ? handleMouseDown : handleGripMouseDown}
    >
      <div className="h-1 w-20 flex items-center justify-center hover:bg-primary/20">
        <GripHorizontal className="h-3 w-3 text-muted-foreground" />
      </div>
    </div>

    {/* Terminal panel */}
    {isOpen && (
      <div
        ref={terminalContainerRef}
        className="absolute bottom-0 left-0 right-0 bg-vscode-terminal border-t border-border z-30"
        style={{ height: `${height}px` }}
      >
        {/* Terminal header */}
        <div 
          className="flex items-center justify-between p-1 bg-secondary border-b border-border cursor-ns-resize"
          onMouseDown={handleMouseDown}
        >
          <div className="text-xs px-2 text-foreground">TERMINAL</div>
          <div className="flex">
            <button className="p-1 hover:bg-accent rounded-sm text-foreground" onClick={() => setHeight(250)}>
              <Minimize className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-accent rounded-sm text-foreground" onClick={() => setHeight(400)}>
              <Maximize className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-accent rounded-sm text-foreground" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal content */}
        <div ref={terminalRef} className="h-[calc(100%-30px)] p-2 overflow-y-auto text-foreground font-mono text-sm">
          {/* Startup animation */}
          {showStartupAnimation && (
            <div className="mb-4">
              {animationStep < airplaneFrames.length ? (
                renderAirplaneAnimation()
              ) : (
                renderSemiColonText()
              )}
            </div>
          )}
          
          {/* Regular terminal content */}
          {!showStartupAnimation && history.map((entry) => (
            <div key={entry.id} className="mb-1">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">$</span>
                <span className="text-foreground">{entry.command}</span>
              </div>
              {entry.loading ? (
                <div className="ml-4 flex items-center">
                  <span className="text-primary mr-2">{spinnerFrames[loadingFrame]}</span>
                  <span className="text-muted-foreground">Running...</span>
                </div>
              ) : entry.output && (
                <div className="ml-4 whitespace-pre-line text-muted-foreground">
                  {entry.output}
                </div>
              )}
            </div>
          ))}
          
          {/* Command input - only show when animation is complete */}
          {!showStartupAnimation && (
            <form onSubmit={handleInputSubmit} className="flex items-center mt-1">
              <span className="text-green-500 mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground"
                autoFocus
                spellCheck="false"
                autoComplete="off"
              />
            </form>
          )}
        </div>
      </div>
    )}
  </>
);
};

export default VSCodeTerminal;