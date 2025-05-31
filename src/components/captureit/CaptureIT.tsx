"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video,
  MessageCircle,
  Phone,
  Users,
  Calendar,
  Settings,
  Star,
  Zap,
  Brain,
  Shield,
  Globe,
  Sparkles,
  Headphones,
  Monitor,
  Mic,
  Camera,
  Share2,
  BarChart,
  Lock,
  Crown,
  Rocket
} from 'lucide-react';
import { CaptureITCalls } from './CaptureITCalls';
import { CaptureITMessages } from './CaptureITMessages';

type CaptureITView = 'home' | 'calls' | 'messages' | 'settings';

export function CaptureIT() {
  const [currentView, setCurrentView] = useState<CaptureITView>('home');
  const [activeCallRoom, setActiveCallRoom] = useState<string | null>(null);

  const handleCallInitiated = (roomId: string) => {
    setActiveCallRoom(roomId);
    setCurrentView('calls');
  };

  const handleCallEnd = () => {
    setActiveCallRoom(null);
    setCurrentView('home');
  };

  const features = [
    {
      icon: Video,
      title: 'Ultra HD Video Calls',
      description: '4K video quality with spatial audio and AI enhancement',
      color: 'from-blue-500 to-cyan-500',
      premium: false
    },
    {
      icon: Brain,
      title: 'AI Assistant',
      description: 'Real-time transcription, translation, and meeting insights',
      color: 'from-purple-500 to-pink-500',
      premium: true
    },
    {
      icon: MessageCircle,
      title: 'Smart Messaging',
      description: 'End-to-end encrypted messages with AI composition help',
      color: 'from-green-500 to-emerald-500',
      premium: false
    },
    {
      icon: Globe,
      title: 'Real-time Translation',
      description: 'Instant translation for global team collaboration',
      color: 'from-orange-500 to-red-500',
      premium: true
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade encryption and zero-trust architecture',
      color: 'from-gray-500 to-slate-500',
      premium: false
    },
    {
      icon: Sparkles,
      title: '3D Virtual Environments',
      description: 'Immersive meeting rooms with holographic backgrounds',
      color: 'from-yellow-500 to-amber-500',
      premium: true
    }
  ];

  const stats = [
    { label: 'Active Users', value: '2.1M+', icon: Users },
    { label: 'Calls Today', value: '45.2K', icon: Phone },
    { label: 'Messages Sent', value: '892K', icon: MessageCircle },
    { label: 'AI Translations', value: '156K', icon: Globe }
  ];

  if (currentView === 'calls') {
    return (
      <CaptureITCalls
        roomId={activeCallRoom || undefined}
        onCallEnd={handleCallEnd}
      />
    );
  }

  if (currentView === 'messages') {
    return (
      <CaptureITMessages
        onCallInitiated={handleCallInitiated}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-black/50 backdrop-blur-lg border-b border-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">CaptureIT</h1>
                  <p className="text-xs text-gray-400">Calls & Messages</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center space-x-1">
                <Button
                  variant={currentView === 'home' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('home')}
                  className="text-sm"
                >
                  Home
                </Button>
                <Button
                  variant={(currentView as CaptureITView) === 'calls' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('calls')}
                  className="text-sm"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Calls
                </Button>
                <Button
                  variant={(currentView as CaptureITView) === 'messages' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('messages')}
                  className="text-sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('settings')}
                className="bg-black/50 border-gray-700"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Home View */}
      {currentView === 'home' && (
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Rocket className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Next-Generation Communication</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The Future of
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"> Communication</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Experience revolutionary video calls and messaging that&apos;s light-years ahead of Teams and Zoom. 
              Powered by AI, secured by encryption, and designed for the future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                onClick={() => setCurrentView('calls')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              >
                <Video className="w-5 h-5 mr-2" />
                Start Video Call
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentView('messages')}
                className="bg-black/50 border-gray-700 text-white px-8 py-3"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Open Messages
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="p-4 bg-black/50 backdrop-blur-lg border-gray-800 text-center">
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Revolutionary Features</h2>
              <p className="text-gray-400">Discover what makes CaptureIT the world&apos;s most advanced communication platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-gray-700 transition-all duration-300 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      {feature.premium && (
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          <Star className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Quick Actions</h2>
              <p className="text-gray-400">Get started with these popular features</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card 
                className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer"
                onClick={() => setCurrentView('calls')}
              >
                <div className="text-center">
                  <Video className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Instant Call</h3>
                  <p className="text-xs text-gray-400">Start a video call immediately</p>
                </div>
              </Card>

              <Card 
                className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 hover:border-green-500/40 transition-all cursor-pointer"
                onClick={() => setCurrentView('messages')}
              >
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">New Message</h3>
                  <p className="text-xs text-gray-400">Send an encrypted message</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Schedule</h3>
                  <p className="text-xs text-gray-400">Plan a future meeting</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer">
                <div className="text-center">
                  <Share2 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Share</h3>
                  <p className="text-xs text-gray-400">Invite team members</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* AI Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <Card className="p-8 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  Powered by Advanced AI
                </h2>
                <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
                  Experience the future of communication with real-time transcription, 
                  instant translation, smart composition, and intelligent insights.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <Mic className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Smart Transcription</h3>
                    <p className="text-sm text-gray-400">Real-time speech-to-text with speaker identification</p>
                  </div>
                  
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Auto Translation</h3>
                    <p className="text-sm text-gray-400">Instant translation across 50+ languages</p>
                  </div>
                  
                  <div className="text-center">
                    <BarChart className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Meeting Analytics</h3>
                    <p className="text-sm text-gray-400">AI-powered insights and engagement metrics</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="p-6 bg-gradient-to-r from-gray-800/50 to-slate-800/50 border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-slate-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Enterprise-Grade Security</h3>
                    <p className="text-gray-400">End-to-end encryption, zero-trust architecture, and compliance ready</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                    <Lock className="w-3 h-3 mr-1" />
                    Encrypted
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Settings View */}
      {currentView === 'settings' && (
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Call Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">HD Video Quality</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">AI Transcription</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Real-time Translation</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Message Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">End-to-End Encryption</span>
                    <div className="w-10 h-6 bg-green-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Smart Compose</span>
                    <div className="w-10 h-6 bg-purple-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Read Receipts</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-gray-800 z-50">
        <div className="flex items-center justify-around py-2">
          <Button
            variant={currentView === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('home')}
            className="flex-col h-auto py-2"
          >
            <Sparkles className="w-4 h-4 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant={(currentView as CaptureITView) === 'calls' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('calls')}
            className="flex-col h-auto py-2"
          >
            <Video className="w-4 h-4 mb-1" />
            <span className="text-xs">Calls</span>
          </Button>
          <Button
            variant={(currentView as CaptureITView) === 'messages' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('messages')}
            className="flex-col h-auto py-2"
          >
            <MessageCircle className="w-4 h-4 mb-1" />
            <span className="text-xs">Messages</span>
          </Button>
          <Button
            variant={currentView === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('settings')}
            className="flex-col h-auto py-2"
          >
            <Settings className="w-4 h-4 mb-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}