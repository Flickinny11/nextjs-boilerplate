"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, ArrowLeft, Sparkles, Clipboard, Check, Settings, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
  cost?: number;
};

// OpenRouter models with pricing
const MODELS = [
  { id: 'openai/gpt-4o', name: 'GPT-4o', price: '$5/1M tokens', category: 'OpenAI' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', price: '$10/1M tokens', category: 'OpenAI' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', price: '$3/1M tokens', category: 'Anthropic' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', price: '$15/1M tokens', category: 'Anthropic' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', price: '$3.50/1M tokens', category: 'Google' },
  { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', price: '$0.075/1M tokens', category: 'Google' }
];

export default function StrategyAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to the AI Marketing Strategy Assistant! I'm powered by multiple state-of-the-art models and have access to web crawling, research tools, and comprehensive marketing knowledge. Select a model above and let's create amazing marketing strategies for your leads!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o');
  const [showSettings, setShowSettings] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
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
      model: selectedModel,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call our new chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: selectedModel,
          tools: [
            {
              type: "function",
              function: {
                name: "web_search",
                description: "Search the web for marketing insights and competitor analysis",
                parameters: {
                  type: "object",
                  properties: {
                    query: { type: "string", description: "Search query" }
                  },
                  required: ["query"]
                }
              }
            },
            {
              type: "function", 
              function: {
                name: "create_media",
                description: "Navigate to media creation section of the app",
                parameters: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["image", "video"] },
                    description: { type: "string", description: "What to create" }
                  },
                  required: ["type", "description"]
                }
              }
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Calculate cost (mock calculation for demo)
      const estimatedCost = 0.001; // $0.001 per message
      setTotalCost(prev => prev + estimatedCost);

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.choices[0].message.content,
        timestamp: new Date(),
        model: selectedModel,
        cost: estimatedCost,
      };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again or switch to a different model.",
        timestamp: new Date(),
        model: selectedModel,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
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

  const selectedModelInfo = MODELS.find(m => m.id === selectedModel);

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
          AI Strategy Assistant
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Powered by OpenRouter - Chat with the world's best AI models
        </p>
      </motion.div>

      {/* Model Selection & Settings Bar */}
      <Card className="p-4 mb-6 bg-black/50 backdrop-blur-lg border-gray-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Model:</span>
            </div>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48 bg-gray-900/50 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{model.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {model.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedModelInfo && (
              <Badge variant="secondary" className="text-xs">
                {selectedModelInfo.price}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                Session cost: ${totalCost.toFixed(4)}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Available Tools</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• Web search & research</li>
                  <li>• Media creation navigation</li>
                  <li>• Lead analysis</li>
                  <li>• Strategy brainstorming</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Agent Capabilities</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• Can control app features</li>
                  <li>• Real-time cost tracking</li>
                  <li>• Campaign management</li>
                  <li>• Multi-model switching</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Commands</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• "create a video" - auto-navigate</li>
                  <li>• "research competitors"</li>
                  <li>• "analyze my leads"</li>
                  <li>• "switch to Claude"</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

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
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-gray-400">
                              {message.role === "user" ? "You" : "Strategy Assistant"}
                            </div>
                            {message.model && (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {MODELS.find(m => m.id === message.model)?.name || message.model}
                                </Badge>
                                {message.cost && (
                                  <span className="text-xs text-green-400">
                                    ${message.cost.toFixed(4)}
                                  </span>
                                )}
                              </div>
                            )}
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