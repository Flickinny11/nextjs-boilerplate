"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  UserCheck, 
  BarChart, 
  Mail, 
  Settings, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "AI-Powered Lead Generation",
    description: "Our advanced AI algorithms find the perfect leads matching your criteria"
  },
  {
    icon: UserCheck,
    title: "Lead Qualification",
    description: "Automatically qualify leads based on your specific requirements"
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Get detailed insights into your lead generation performance"
  },
  {
    icon: Mail,
    title: "Automated Outreach",
    description: "Connect with leads through automated, personalized campaigns"
  },
  {
    icon: Settings,
    title: "Custom Integration",
    description: "Seamlessly integrate with your existing CRM and tools"
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Receive instant notifications when new leads are captured"
  }
];

export function Features() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to capture and manage high-quality sales leads
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-black/50 backdrop-blur-lg border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-300 transform group-hover:scale-105">
                <feature.icon className="h-8 w-8 text-blue-500 mb-4 transform group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
