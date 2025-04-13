
import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, X } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Here we would normally call the Gemini API
      // Since we don't have a backend integration yet, we'll simulate a response
      const simulatedResponse = await simulateGeminiResponse(input);
      
      // Add assistant message
      const assistantMessage: Message = { role: "assistant", content: simulatedResponse };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "Could not get a response. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This is a temporary simulation of the Gemini API response
  // In a real implementation, this would be replaced with actual API calls
  const simulateGeminiResponse = async (prompt: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response patterns
    if (prompt.toLowerCase().includes("hello") || prompt.toLowerCase().includes("hi")) {
      return "Hello! How can I help you with your coding today?";
    } else if (prompt.toLowerCase().includes("feature") || prompt.toLowerCase().includes("function")) {
      return "I can help you implement that feature. What specific programming language or framework are you using?";
    } else {
      return "I'm your coding assistant. I can help you write code, debug issues, and explain programming concepts. What would you like help with?";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-md"
          aria-label="AI Assistant"
        >
          <Bot className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 max-h-96 flex flex-col"
        align="end"
        sideOffset={10}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="text-sm font-medium">AI Assistant</h3>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-4 min-h-[200px] max-h-[300px]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="h-8 w-8 mb-2" />
              <p className="text-sm">How can I help you today?</p>
              <p className="text-xs">Ask me coding questions or help with your project.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-accent"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <Separator />
        
        <form onSubmit={handleSubmit} className="flex items-center p-2 gap-2">
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AIChatbot;