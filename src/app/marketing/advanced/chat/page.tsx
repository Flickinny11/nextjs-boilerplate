"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  TrendingUp, 
  MessageSquare,
  Rocket,
  Brain,
  Lightbulb,
  Zap,
  CheckCircle2,
  Copy,
  Download,
  Plus,
  Loader2,
  Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionItems?: ActionItem[];
}

interface ActionItem {
  type: 'campaign' | 'content' | 'targeting' | 'budget';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimated_cost?: string;
  estimated_time?: string;
}

export default function AdvancedMarketingChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showHumor, setShowHumor] = useState(false);
  const [humorMessage, setHumorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load user profile and initialize conversation
    const initializeChat = async () => {
      try {
        // Load user profile
        const profileResponse = await fetch('/api/profile/get');
        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          setUserProfile(profile);
        }

        // Create new conversation
        const memoryResponse = await fetch('/api/memory/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'demo-user', // In production, get from auth
            title: 'Marketing Strategy Session',
            userContext: userProfile
          }),
        });

        if (memoryResponse.ok) {
          const { conversationId: newConversationId } = await memoryResponse.json();
          setConversationId(newConversationId);
          
          // Send initial welcome message
          await sendWelcomeMessage(newConversationId);
        }
      } catch (error) {
        console.error('Chat initialization error:', error);
        // Fallback to basic mode
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `🚀 Welcome to Advanced Marketing Automation AI!

I'm your expert marketing strategist powered by Claude Opus 4. Tell me about your ideal customer and I'll create a comprehensive marketing strategy specifically for your business.

What's your business, and who are you trying to reach?`,
          timestamp: new Date()
        }]);
      }
    };

    initializeChat();
  }, []);

  const sendWelcomeMessage = async (convId: string) => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `🚀 Welcome to Advanced Marketing Automation AI!

I'm your expert marketing strategist powered by Claude Opus 4. I have access to:

**🧠 AI Research Capabilities**
- Real-time web research and business intelligence
- Competitor analysis and market insights
- Industry trend analysis and opportunities

**🎨 Content Creation**
- Custom marketing materials and campaigns
- Video and image generation
- Brand-aligned content development

**🤖 Automation Setup**
- Social media automation
- Lead capture and nurturing
- Email marketing sequences

**📊 Strategy Development**
- Personalized marketing strategies
- ROI optimization recommendations
- Multi-channel campaign planning

${userProfile?.companyName ? `I see you're with ${userProfile.companyName}. ` : ''}Tell me about your ideal customer and I'll create a comprehensive marketing strategy specifically for your business.

What's your business, and who are you trying to reach?`,
      timestamp: new Date(),
      suggestions: [
        "Let me describe my ideal customer",
        "I need help identifying my target market",
        "I want to compete with larger companies",
        "I need more qualified leads",
        "My marketing isn't converting well"
      ]
    };

    setMessages([welcomeMessage]);
  };

  const generateMarketingResponse = async (userMessage: string): Promise<Message> => {
    try {
      // Determine if this is a customer description or general chat
      const isCustomerDescription = userMessage.toLowerCase().includes('customer') || 
                                   userMessage.toLowerCase().includes('target') ||
                                   userMessage.length > 100; // Longer messages likely descriptions

      let response: any;
      
      if (isCustomerDescription && !isProcessing) {
        // This is likely a customer description - use the enhance endpoint
        setIsProcessing(true);
        setShowHumor(true);
        
        // Show humor while processing
        showProcessingHumor();
        
        const enhanceResponse = await fetch('/api/ai/claude/enhance-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerDescription: userMessage,
            userContext: userProfile
          }),
        });

        if (!enhanceResponse.ok) {
          throw new Error('Failed to enhance customer description');
        }

        const enhanceData = await enhanceResponse.json();
        
        // Generate full strategy
        const strategyResponse = await fetch('/api/ai/claude/generate-strategy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerDescription: enhanceData.enhancedDescription,
            userContext: userProfile,
            preferences: {
              budget: userProfile?.marketingBudget,
              timeframe: '30 days',
              channels: ['digital', 'social', 'content'],
              goals: ['lead generation', 'brand awareness']
            }
          }),
        });

        if (!strategyResponse.ok) {
          throw new Error('Failed to generate strategy');
        }

        const strategyData = await strategyResponse.json();
        
        setIsProcessing(false);
        setShowHumor(false);
        
        response = {
          content: `${enhanceData.enhancedDescription}\n\n**🎯 Complete Marketing Strategy:**\n\n${strategyData.strategy}`,
          actionItems: strategyData.actionItems,
          suggestions: [
            "Approve this strategy and begin implementation",
            "Modify the target customer description", 
            "Show me specific campaign examples",
            "What's the expected ROI?"
          ]
        };
      } else {
        // Regular chat message
        const chatResponse = await fetch('/api/ai/claude/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMessage }
            ],
            conversationId,
            userContext: userProfile
          }),
        });

        if (!chatResponse.ok) {
          throw new Error('Failed to get chat response');
        }

        const chatData = await chatResponse.json();
        
        if (chatData.memoryUsage) {
          setMemoryUsage(chatData.memoryUsage);
        }
        
        response = {
          content: chatData.response,
          suggestions: [
            "Tell me more about this",
            "What are the next steps?",
            "Show me examples",
            "How much will this cost?"
          ]
        };
      }

      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actionItems: response.actionItems
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I apologize, but I'm having trouble processing your request right now. This might be due to API configuration. Let me help you in a different way - could you tell me more about your business and what specific marketing challenge you're facing?`,
        timestamp: new Date(),
        suggestions: [
          "Let me try a different approach",
          "What's your biggest marketing challenge?",
          "Tell me about your business goals",
          "How can I help you grow?"
        ]
      };
    }
  };

  const showProcessingHumor = async () => {
    const humorMessages = [
      "Would you ever consider dating a computer?",
      "Do you think AI is going to take over the world some day and destroy all of mankind? haha... just kidding...",
      "If robots could dream, do you think they'd dream of electric sheep... or electric marketing campaigns?",
      "Fun fact: I process about 10 billion thoughts per second, but I still can't figure out why humans put pineapple on pizza.",
      "While I research your industry, here's a question: Is cereal soup?",
      "Quick philosophy question: If a tree falls in a forest and no one's around to hear it, does it make a sound? Also, does it need a marketing campaign?"
    ];

    for (let i = 0; i < 3; i++) {
      if (!isProcessing) break;
      
      const randomHumor = humorMessages[Math.floor(Math.random() * humorMessages.length)];
      setHumorMessage(randomHumor);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!isProcessing) break;
      setHumorMessage('');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setHumorMessage('Thinking... 😊');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const aiResponse = await generateMarketingResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const createCampaignFromAction = (actionItem: ActionItem) => {
    // This would integrate with the campaign creation system
    console.log('Creating campaign from action:', actionItem);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/marketing/advanced" className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center">
          <Brain className="w-8 h-8 text-purple-500 mr-3 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              AI Marketing Strategist
            </h1>
            <p className="text-gray-400">Let's create campaigns that convert</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] bg-black/50 backdrop-blur-lg border-gray-800 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="w-6 h-6 text-purple-500 mr-2" />
                  <span className="font-semibold text-white">Marketing AI Assistant</span>
                  <span className="ml-2 text-xs text-green-500 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    Online
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Chat
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-blue-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        <div className={`rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-white border border-gray-700'
                        }`}>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                          
                          {message.role === 'assistant' && (
                            <div className="mt-3 flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessage(message.content)}
                                className="text-xs text-gray-400 hover:text-white"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.suggestions && (
                            <div className="mt-4 space-y-2">
                              <p className="text-xs text-gray-400 font-semibold">💡 Quick responses:</p>
                              <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Items */}
                          {message.actionItems && (
                            <div className="mt-4">
                              <p className="text-xs text-gray-400 font-semibold mb-3">🎯 Recommended Actions:</p>
                              <div className="space-y-2">
                                {message.actionItems.map((action, index) => (
                                  <div 
                                    key={index} 
                                    className="p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            action.priority === 'high' 
                                              ? 'bg-red-500/20 text-red-300' 
                                              : action.priority === 'medium'
                                              ? 'bg-yellow-500/20 text-yellow-300'
                                              : 'bg-green-500/20 text-green-300'
                                          }`}>
                                            {action.priority.toUpperCase()}
                                          </span>
                                          <span className="text-xs text-gray-400">{action.type}</span>
                                        </div>
                                        <h4 className="font-semibold text-sm text-white">{action.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                                        <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                                          {action.estimated_cost && (
                                            <span>💰 {action.estimated_cost}</span>
                                          )}
                                          {action.estimated_time && (
                                            <span>⏱️ {action.estimated_time}</span>
                                          )}
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        onClick={() => createCampaignFromAction(action)}
                                        className="bg-purple-600 hover:bg-purple-700 text-xs"
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Create
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                          <span className="text-gray-400 text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {showHumor && humorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <div className="bg-gray-800/70 rounded-lg p-4 border border-purple-500/30">
                        <div className="text-purple-300 text-sm italic">
                          {humorMessage}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white animate-bounce" />
                      </div>
                      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/30">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                          <span className="text-purple-300 text-sm">
                            Creating your personalized marketing strategy...
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-purple-400">
                          Researching your industry • Analyzing competitors • Generating content ideas
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-4">
                <Textarea
                  placeholder="Tell me about your business and marketing goals..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 bg-gray-900 border-gray-700 focus:border-purple-500 resize-none"
                  rows={3}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
            <h3 className="font-semibold text-white mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link href="/marketing/advanced/paid-ads">
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <Megaphone className="w-4 h-4 mr-2 text-green-500" />
                  Create Paid Campaign
                </Button>
              </Link>
              <Link href="/marketing/advanced/free-automation">
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <Bot className="w-4 h-4 mr-2 text-blue-500" />
                  Setup Free Automation
                </Button>
              </Link>
              <Link href="/marketing/advanced/analytics">
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </Card>

          {/* Marketing Tips */}
          <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
            <h3 className="font-semibold text-white mb-4 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
              Pro Tips
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">Be specific about your target audience for better recommendations</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">Mention your budget range to get cost-appropriate strategies</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">Ask about both paid and free marketing options</p>
              </div>
            </div>
          </Card>

          {/* Session Stats */}
          <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
            <h3 className="font-semibold text-white mb-4 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-purple-500" />
              Session Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Messages:</span>
                <span className="text-white">{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Strategies Generated:</span>
                <span className="text-white">{messages.filter(m => m.actionItems?.length).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Action Items:</span>
                <span className="text-white">
                  {messages.reduce((total, m) => total + (m.actionItems?.length || 0), 0)}
                </span>
              </div>
              {memoryUsage && (
                <>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memory Usage:</span>
                      <span className={`text-white ${memoryUsage.usagePercentage > 85 ? 'text-yellow-400' : ''}`}>
                        {memoryUsage.usagePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          memoryUsage.usagePercentage > 85 ? 'bg-yellow-400' : 'bg-purple-500'
                        }`}
                        style={{ width: `${Math.min(memoryUsage.usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                    {memoryUsage.compressionNeeded && (
                      <div className="text-xs text-yellow-400 mt-1">
                        Memory compression recommended
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}