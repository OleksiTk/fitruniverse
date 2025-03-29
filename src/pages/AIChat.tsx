
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your FitRun AI assistant. Ask me anything about running, fitness, or how to use the app!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample responses based on keywords
  const sampleResponses = [
    {
      keywords: ["run", "running", "jog", "jogging"],
      response: "Running is a great way to improve cardiovascular health and build endurance. For beginners, I recommend starting with a run/walk approach - alternate between 1-2 minutes of running and 1 minute of walking. Gradually increase your running intervals as you build stamina.",
    },
    {
      keywords: ["injury", "pain", "hurt"],
      response: "If you're experiencing pain while running, it's important to rest and assess the situation. Common running injuries include shin splints, runner's knee, and plantar fasciitis. Remember RICE: Rest, Ice, Compression, and Elevation. If pain persists, consult with a healthcare professional.",
    },
    {
      keywords: ["pace", "speed", "faster"],
      response: "To improve your running pace, incorporate interval training and tempo runs into your routine. Interval training involves alternating between high-intensity running and recovery periods. Tempo runs are sustained efforts at a challenging but manageable pace.",
    },
    {
      keywords: ["diet", "nutrition", "eat", "food"],
      response: "Proper nutrition is crucial for runners. Focus on complex carbohydrates for energy, lean proteins for muscle repair, and healthy fats for hormone production. Stay hydrated before, during, and after your runs. Consider carb-loading before longer runs (10K+) for optimal performance.",
    },
    {
      keywords: ["stretch", "stretching", "flexibility"],
      response: "Dynamic stretching before a run helps prepare your muscles for activity. Try leg swings, walking lunges, and arm circles. Static stretching after your run helps improve flexibility and reduce muscle tension. Hold each stretch for 20-30 seconds without bouncing.",
    },
    {
      keywords: ["app", "feature", "use"],
      response: "FitRun offers features like GPS tracking for your runs, detailed performance metrics, personalized training plans, and progress tracking. To start a run, go to the Training screen and tap 'Start Run'. You can view your history and achievements in the Progress and Profile sections.",
    },
    {
      keywords: ["goal", "target", "aim"],
      response: "Setting realistic goals is important for running progress. Consider the SMART framework: Specific, Measurable, Achievable, Relevant, and Time-bound. For example, 'Run a 5K in under 30 minutes within 8 weeks' is a SMART goal that gives you clear direction.",
    },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      generateResponse(input);
      setIsLoading(false);
    }, 1000);
  };

  const generateResponse = (userInput: string) => {
    const lowerCaseInput = userInput.toLowerCase();
    
    // Check if any keywords match
    let responseText = "I'm not sure about that. Could you ask something related to running, fitness, or how to use the FitRun app?";
    
    for (const item of sampleResponses) {
      if (item.keywords.some(keyword => lowerCaseInput.includes(keyword))) {
        responseText = item.response;
        break;
      }
    }

    // Add AI response
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      text: responseText,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-20 pb-6">
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            FitRun AI Assistant
          </h1>
          
          <Card className="flex-1 border border-gray-200 bg-white/80 backdrop-blur-sm mb-4 shadow-md">
            <CardContent className="p-0 h-full flex flex-col">
              <ScrollArea className="flex-1 p-4 h-[calc(100vh-16rem)]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-start max-w-[80%] ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white rounded-l-lg rounded-tr-lg"
                            : "bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg"
                        } p-3 shadow-sm`}
                      >
                        <div className="mr-2 mt-1">
                          {message.sender === "user" ? (
                            <User className="h-5 w-5" />
                          ) : (
                            <Bot className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex items-center">
                  <Input
                    placeholder="Ask something about running or fitness..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 mr-2"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || input.trim() === ""}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-gray-500">
            <p>This is a simulated AI assistant with predefined responses.</p>
            <p>Ask about running techniques, injury prevention, nutrition, or how to use the app.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChat;
