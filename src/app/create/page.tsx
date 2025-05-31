"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  Wand2, 
  Settings,
  ArrowRight,
  Sparkles,
  Image,
  Video,
  FileText,
  Plus
} from 'lucide-react';
import Link from 'next/link';

const creativeTools = [
  {
    id: 'canva',
    name: 'Canva Integration',
    description: 'Professional design tools with AI-powered templates and brand management',
    icon: '🎨',
    color: '#8B5CF6',
    features: ['Design Templates', 'Brand Kit', 'Team Collaboration', 'AI Style Extraction'],
    href: '/create/canva',
    status: 'ready'
  },
  {
    id: 'adobe',
    name: 'Adobe Express',
    description: 'Advanced creative suite with professional editing capabilities',
    icon: '🚀',
    color: '#FF0040',
    features: ['Photo Editing', 'Video Creation', 'Brand Assets', 'Creative Cloud'],
    href: '/create/adobe',
    status: 'ready'
  }
];

const quickActions = [
  {
    name: 'Setup Integration',
    description: 'Connect your Canva and Adobe accounts',
    icon: Settings,
    href: '/create/setup',
    color: '#10B981'
  },
  {
    name: 'Browse Templates',
    description: 'Explore campaign-ready design templates',
    icon: Image,
    href: '/create/templates',
    color: '#F59E0B'
  },
  {
    name: 'Create From Scratch',
    description: 'Start with a blank canvas',
    icon: Plus,
    href: '/create/new',
    color: '#EF4444'
  }
];

export default function CreatePage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Create Stunning Content
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Leverage professional design tools integrated directly into CaptureIT LS. 
            Create, edit, and manage your brand content with AI-powered assistance.
          </p>
        </motion.div>
      </div>

      {/* Creative Tools Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {creativeTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <Card 
              className={`p-6 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-purple-500 transition-all duration-300 cursor-pointer group ${
                selectedTool === tool.id ? 'border-purple-500 bg-purple-500/10' : ''
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <div className="space-y-4">
                {/* Tool Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: tool.color + '20' }}
                    >
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                        {tool.status}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>

                {/* Description */}
                <p className="text-gray-300">{tool.description}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {tool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-400">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Launch Button */}
                <Link href={tool.href}>
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Launch {tool.name}
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
            >
              <Link href={action.href}>
                <Card className="p-4 bg-black/30 backdrop-blur-lg border-gray-800 hover:border-gray-600 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: action.color + '20' }}
                    >
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {action.name}
                      </h3>
                      <p className="text-sm text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}