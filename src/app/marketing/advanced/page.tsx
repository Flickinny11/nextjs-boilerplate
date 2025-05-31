"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Megaphone, 
  Bot, 
  BarChart3, 
  Settings, 
  Rocket,
  Target,
  Brain,
  TrendingUp,
  Globe,
  ChevronRight,
  Sparkles,
  Zap,
  Database,
  Users,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function AdvancedMarketingAutomations() {
  const [activeTab, setActiveTab] = useState("overview");

  const quickActions = [
    {
      title: "AI Strategy Session",
      description: "Start an AI-powered brainstorming session",
      icon: Brain,
      href: "/marketing/advanced/chat",
      color: "from-purple-500 to-indigo-500",
      stats: "Create campaigns 10x faster"
    },
    {
      title: "Launch Paid Campaign",
      description: "Create Google Ads campaigns with AI",
      icon: Megaphone,
      href: "/marketing/advanced/paid-ads",
      color: "from-green-500 to-emerald-500",
      stats: "Average 300% ROI"
    },
    {
      title: "Free Automation",
      description: "Deploy browser agents for organic reach",
      icon: Bot,
      href: "/marketing/advanced/free-automation",
      color: "from-blue-500 to-cyan-500",
      stats: "Zero ad spend required"
    },
    {
      title: "Analytics Hub",
      description: "Advanced marketing performance insights",
      icon: BarChart3,
      href: "/marketing/advanced/analytics",
      color: "from-orange-500 to-red-500",
      stats: "Track every interaction"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Precision Targeting",
      description: "AI identifies and reaches your exact ideal customers"
    },
    {
      icon: Globe,
      title: "Multi-Platform Reach",
      description: "Automate marketing across Google, Facebook, LinkedIn, and more"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Know which campaigns will succeed before you launch them"
    },
    {
      icon: Zap,
      title: "Instant Optimization",
      description: "Real-time campaign adjustments for maximum ROI"
    },
    {
      icon: Database,
      title: "Lead Intelligence",
      description: "Deep insights into prospect behavior and buying signals"
    },
    {
      icon: Users,
      title: "Audience Building",
      description: "Automatically expand your reach to similar high-value prospects"
    }
  ];

  const stats = [
    { label: "Active Campaigns", value: "0", subtext: "Ready to launch", icon: Rocket },
    { label: "Leads Generated", value: "0", subtext: "This month", icon: Users },
    { label: "ROI Improvement", value: "0%", subtext: "vs traditional marketing", icon: TrendingUp },
    { label: "Time Saved", value: "0hrs", subtext: "This week", icon: Sparkles }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <Rocket className="w-8 h-8 mr-3 text-purple-500 animate-bounce" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Advanced Marketing Automations
          </h1>
        </div>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          Revolutionary AI-powered marketing that combines paid advertising with innovative free automation. 
          Get your message in front of the right people, at the right time, automatically.
        </p>
      </motion.div>

      {/* Stats Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
              <stat.icon className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 bg-black/50 backdrop-blur-lg border border-gray-800">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Rocket className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="quick-start" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Quick Start</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Explain Your Ideal Customer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 animate-gradient-x"></div>
              
              <div className="relative z-10">
                <motion.h2 
                  className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4 text-center"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))',
                    textShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Explain Your Ideal Customer
                </motion.h2>
                
                <div className="text-center mb-6">
                  <motion.p 
                    className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Enter your ideal customer description for CaptureIT to create an entire marketing campaign, 
                    create and post marketing content, targeted ads, workflows, automations, respond to inquiries, 
                    set meetings on your calendar, respond to emails, and transform your business growth.
                  </motion.p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <Link href="/marketing/advanced/chat">
                    <Card className="p-6 bg-gray-900/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer group">
                      <div className="text-center">
                        <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-bold text-white mb-3">Start AI Strategy Session</h3>
                        <div className="text-gray-400 text-sm mb-4 italic">
                          "Simply enter exactly who your ideal customer is as if I'm your buddy. 
                          Don't worry 'bout grammar, imperfection, run-on sentences or spelling. 
                          Just give it to me - in any order."
                        </div>
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group-hover:scale-105 transition-all duration-300">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Begin Customer Analysis
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Link href={action.href}>
                    <Card className="p-6 h-full bg-black/50 backdrop-blur-lg border-gray-800 hover:border-purple-500 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-20 flex items-center justify-center mr-4`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                      <p className="text-gray-400 mb-4">{action.description}</p>
                      <div className={`text-sm font-semibold bg-gradient-to-r ${action.color} bg-clip-text text-transparent`}>
                        {action.stats}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features Overview */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Revolutionary Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quick-start" className="space-y-6">
          <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-white">Get Started in 3 Simple Steps</h2>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Tell Our AI About Your Business</h3>
                  <p className="text-gray-400 mb-4">Start a conversation with our AI to understand your target market, goals, and ideal customers.</p>
                  <Link href="/marketing/advanced/chat">
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      <Brain className="w-4 h-4 mr-2" />
                      Start AI Session
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Choose Your Strategy</h3>
                  <p className="text-gray-400 mb-4">Select between paid advertising (Google Ads) or our revolutionary free automation system.</p>
                  <div className="flex space-x-4">
                    <Link href="/marketing/advanced/paid-ads">
                      <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Paid Ads
                      </Button>
                    </Link>
                    <Link href="/marketing/advanced/free-automation">
                      <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                        <Bot className="w-4 h-4 mr-2" />
                        Free Automation
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Watch the Magic Happen</h3>
                  <p className="text-gray-400 mb-4">Monitor your campaigns performance and let our AI optimize everything automatically.</p>
                  <Link href="/marketing/advanced/analytics">
                    <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800 text-center">
            <Rocket className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No Campaigns Yet</h2>
            <p className="text-gray-400 mb-6">Create your first campaign to start generating leads automatically.</p>
            <Link href="/marketing/advanced/chat">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Brain className="w-4 h-4 mr-2" />
                Create First Campaign
              </Button>
            </Link>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800 text-center">
            <BarChart3 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Analytics Dashboard</h2>
            <p className="text-gray-400 mb-6">Once you create campaigns, detailed analytics will appear here.</p>
            <Link href="/marketing/advanced/chat">
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                <Rocket className="w-4 h-4 mr-2" />
                Start First Campaign
              </Button>
            </Link>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Configuration</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">API Integrations</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Google Ads API</p>
                      <p className="text-sm text-gray-400">Connect to create and manage Google Ads campaigns</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Facebook Ads API</p>
                      <p className="text-sm text-gray-400">Automate Facebook and Instagram advertising</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Browser Automation</p>
                      <p className="text-sm text-gray-400">Enable free marketing automation agents</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}