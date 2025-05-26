"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Zap, MessageSquare, ImageIcon, Video, Send, Mail, Share2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function MarketingSuite() {
  return (
    <div className="container mx-auto px-4 py-16 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
          Marketing Suite
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Create engaging marketing campaigns for your captured leads with AI-powered content creation and automation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* AI Strategy Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/marketing/strategy">
            <Card className="p-6 h-full bg-black/50 backdrop-blur-lg border-gray-800 hover:border-blue-600 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">Strategy Assistant</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Brainstorm marketing strategies for your leads with our AI assistant
              </p>
              <div className="flex justify-end">
                <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Content Creator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/marketing/content">
            <Card className="p-6 h-full bg-black/50 backdrop-blur-lg border-gray-800 hover:border-purple-600 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold">Content Creator</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Generate compelling images, videos, and text for your marketing campaigns
              </p>
              <div className="flex justify-end">
                <ChevronRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Workflow Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/marketing/workflows">
            <Card className="p-6 h-full bg-black/50 backdrop-blur-lg border-gray-800 hover:border-green-600 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mr-4">
                  <ListChecks className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Workflow Builder</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Create automated workflows to engage leads across multiple channels
              </p>
              <div className="flex justify-end">
                <ChevronRight className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Distribution Channels</h2>
          <p className="text-gray-400 mb-6">
            Connect your marketing campaigns to multiple distribution channels to reach your leads effectively
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-black/30 border-gray-800 flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-xs text-gray-500">Automated email campaigns</p>
              </div>
            </Card>
            <Card className="p-4 bg-black/30 border-gray-800 flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                <Send className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">SMS</h3>
                <p className="text-xs text-gray-500">Direct messaging to mobile</p>
              </div>
            </Card>
            <Card className="p-4 bg-black/30 border-gray-800 flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                <Share2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">Social Media</h3>
                <p className="text-xs text-gray-500">Posts and direct messages</p>
              </div>
            </Card>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}