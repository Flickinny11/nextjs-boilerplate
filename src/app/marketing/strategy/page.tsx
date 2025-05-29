"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, ArrowLeft, Sparkles, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function StrategyAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to the Marketing Strategy Assistant! I can help you brainstorm effective marketing strategies for the leads you've captured. How would you like to engage with your leads?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset copy button after 2 seconds
  useEffect(() => {
    if (copiedId) {
      const timer = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // In a real implementation, this would call your API endpoint
      // that would stream the response back from OpenAI or Anthropic
      // For now, we'll simulate a response after a short delay
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateMockResponse(inputValue),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating response:", error);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
  };

  // Mock response generator - this would be replaced by actual AI calls
  const generateMockResponse = (input: string): string => {
    if (input.toLowerCase().includes("email")) {
      return "For email marketing campaigns targeting your leads, I recommend:\n\n1. **Segmentation**: Divide your leads based on industry and interests\n2. **Personalized Subject Lines**: Use the lead's name and company\n3. **Value-First Content**: Provide useful insights relevant to their industry\n4. **Clear CTA**: One primary call-to-action per email\n5. **Optimal Timing**: Test sending at different times of day\n\nWould you like me to help create a specific email campaign for a segment of your leads?";
    } else if (input.toLowerCase().includes("social")) {
      return "For social media marketing to engage your leads:\n\n1. **Platform Selection**: Focus on platforms where your leads are active (LinkedIn for B2B, Instagram for B2C)\n2. **Content Strategy**: Mix of educational, inspirational, and promotional content\n3. **Consistent Branding**: Maintain visual consistency across platforms\n4. **Engagement Plan**: Actively respond to comments and messages\n5. **Paid Targeting**: Use custom audiences based on your leads list\n\nWhich social platforms are you currently using to engage with your leads?";
    } else {
      return "Based on your leads' profiles, here are some marketing strategy recommendations:\n\n1. **Multi-Channel Approach**: Combine email, social media, and personalized content\n2. **Problem-Solving Content**: Address specific pain points in their industry\n3. **Case Studies**: Showcase success stories relevant to their business needs\n4. **Webinar Series**: Host educational webinars on topics of interest\n5. **Follow-up Sequence**: Create a structured follow-up plan with increasing value\n\nWould you like me to elaborate on any of these strategies or suggest content ideas for a specific industry?";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      <div className="mb-8">
        <Link href="/marketing" className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketing Suite
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
          Strategy Assistant
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Brainstorm marketing strategies for your leads with our AI assistant
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col bg-black/50 backdrop-blur-lg border-gray-800">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`relative max-w-3xl rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-blue-600/20 border border-blue-800"
                          : "bg-gray-800/50 border border-gray-700"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === "user" ? "bg-blue-700" : "bg-purple-700"
                            }`}
                          >
                            {message.role === "user" ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-400 mb-1">
                            {message.role === "user" ? "You" : "Strategy Assistant"}
                          </div>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                        {message.role === "assistant" && (
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clipboard className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-3xl rounded-lg p-4 bg-gray-800/50 border border-gray-700">
                      <div className="flex items-start">
                        <div className="mr-3">
                          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Strategy Assistant</div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about marketing strategies for your leads..."
                  className="min-h-[60px] bg-gray-900/50 border-gray-700 resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              Suggested Prompts
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-2 px-3 border-gray-800 hover:border-blue-500 hover:bg-blue-900/20"
                onClick={() => setInputValue("How can I engage leads from the tech industry?")}
              >
                How can I engage leads from the tech industry?
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-2 px-3 border-gray-800 hover:border-blue-500 hover:bg-blue-900/20"
                onClick={() => setInputValue("Create an email campaign for new leads")}
              >
                Create an email campaign for new leads
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-2 px-3 border-gray-800 hover:border-blue-500 hover:bg-blue-900/20"
                onClick={() => setInputValue("What social media platforms should I focus on?")}
              >
                What social media platforms should I focus on?
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-2 px-3 border-gray-800 hover:border-blue-500 hover:bg-blue-900/20"
                onClick={() => setInputValue("Help me create a follow-up sequence for cold leads")}
              >
                Help me create a follow-up sequence for cold leads
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}