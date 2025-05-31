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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `🚀 Welcome to Advanced Marketing Automation AI!

I'm your expert marketing strategist, ready to help you create campaigns that generate real results. I can help you with:

**🎯 Strategy Development**
- Target audience identification
- Competitive analysis
- Multi-channel campaign planning
- Budget optimization

**📢 Campaign Creation**
- Google Ads setup and optimization
- Social media automation
- Content marketing strategies
- Email sequences

**🤖 Free Automation**
- Browser-based lead generation
- Social platform engagement
- Organic reach amplification
- Lead nurturing sequences

**📊 Analytics & Optimization**
- Performance tracking setup
- ROI analysis
- A/B testing strategies
- Conversion optimization

Tell me about your business and I'll create a customized marketing strategy for you. What industry are you in and what's your main challenge?`,
      timestamp: new Date(),
      suggestions: [
        "I run a commercial roofing business like SCS",
        "I need more leads for my service business", 
        "I want to compete with larger companies",
        "I have a limited marketing budget",
        "I'm new to online marketing"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [businessContext, setBusinessContext] = useState({
    industry: '',
    targetAudience: '',
    budgetRange: '',
    mainChallenge: '',
    currentMarketing: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateMarketingResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const businessKeywords = {
      roofing: ['commercial roofing', 'roof coating', 'building managers', 'facilities'],
      hvac: ['heating', 'cooling', 'hvac', 'commercial buildings'],
      plumbing: ['plumbing', 'pipes', 'water', 'commercial'],
      landscaping: ['landscaping', 'grounds', 'outdoor', 'maintenance'],
      cleaning: ['cleaning', 'janitorial', 'commercial cleaning', 'facilities']
    };

    let detectedIndustry = '';
    for (const [industry, keywords] of Object.entries(businessKeywords)) {
      if (keywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
        detectedIndustry = industry;
        break;
      }
    }

    const responses = {
      roofing: {
        content: `🏢 **Commercial Roofing Marketing Strategy**

Great! I can see you're in commercial roofing. Here's a comprehensive strategy tailored for your industry:

**🎯 Target Audience Analysis:**
- **Primary**: Building/Facility Managers (decision makers)
- **Secondary**: Property Management Companies
- **Tertiary**: Building Owners & Maintenance Directors

**📢 Recommended Campaign Strategy:**

**1. Google Ads Campaign (High ROI)**
- **Keywords**: "commercial roof repair [city]", "roof coating [city]", "flat roof maintenance"
- **Budget**: $1,500-3,000/month
- **Expected Results**: 15-25 qualified leads/month

**2. Free Automation Strategy (Zero Cost)**
- **LinkedIn Outreach**: Target facility managers and building owners
- **Industry Forums**: Participate in commercial real estate discussions
- **Local Business Networks**: Automated engagement with property management groups

**3. Content Strategy:**
- **Educational Content**: "5 Signs Your Commercial Roof Needs Attention"
- **Case Studies**: Before/after photos with ROI calculations
- **Seasonal Campaigns**: Pre-storm roof inspections, winter prep

Would you like me to:
A) Create specific Google Ads campaigns
B) Set up the free automation system
C) Develop content calendar and materials
D) All of the above with implementation timeline`,
        suggestions: [
          "Create Google Ads campaigns for commercial roofing",
          "Set up free automation for lead generation",
          "Develop content strategy and materials",
          "Show me budget breakdown and ROI projections"
        ],
        actionItems: [
          {
            type: 'campaign' as const,
            title: 'Google Ads Campaign Setup',
            description: 'Create targeted campaigns for commercial roofing keywords',
            priority: 'high' as const,
            estimated_cost: '$1,500-3,000/month',
            estimated_time: '2-3 days'
          },
          {
            type: 'targeting' as const,
            title: 'LinkedIn Automation Setup',
            description: 'Target facility managers and building owners',
            priority: 'high' as const,
            estimated_cost: 'Free',
            estimated_time: '1 day'
          },
          {
            type: 'content' as const,
            title: 'Educational Content Creation',
            description: 'Develop roof maintenance guides and case studies',
            priority: 'medium' as const,
            estimated_cost: '$500-1,000',
            estimated_time: '1 week'
          }
        ]
      },
      default: {
        content: `💡 **Customized Marketing Strategy**

I'd love to help you create an effective marketing strategy! To provide the most targeted recommendations, I need to understand your business better.

**Let me ask you a few key questions:**

1. **What industry/business are you in?**
2. **Who is your ideal customer?** (demographics, role, company size)
3. **What's your monthly marketing budget range?**
4. **What's your biggest challenge?** (leads, conversions, competition, etc.)
5. **What marketing have you tried before?**

**Meanwhile, here are some universal strategies that work for most businesses:**

**🚀 Quick Wins (Free/Low Cost):**
- **Social Media Automation**: Engage with prospects on LinkedIn, Facebook
- **Content Marketing**: Educational posts that position you as an expert
- **Local SEO**: Optimize for local searches in your area
- **Email Sequences**: Nurture leads with valuable content

**💰 Paid Strategies (Higher Investment, Faster Results):**
- **Google Ads**: Target high-intent keywords
- **Facebook/Instagram Ads**: Visual campaigns for brand awareness
- **LinkedIn Ads**: B2B targeting for service businesses
- **Retargeting**: Re-engage website visitors

Tell me more about your specific situation and I'll create a detailed plan with exact steps and budget breakdowns!`,
        suggestions: [
          "I'm in commercial services (HVAC, plumbing, etc.)",
          "I run a local service business",
          "I need help with online marketing",
          "I want to compete with bigger companies",
          "My budget is under $2,000/month"
        ],
        actionItems: [
          {
            type: 'targeting' as const,
            title: 'Business Profile Setup',
            description: 'Complete your business information for targeted recommendations',
            priority: 'high' as const,
            estimated_cost: 'Free',
            estimated_time: '10 minutes'
          }
        ]
      }
    };

    const response = responses[detectedIndustry as keyof typeof responses] || responses.default;

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
      actionItems: response.actionItems
    };
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}