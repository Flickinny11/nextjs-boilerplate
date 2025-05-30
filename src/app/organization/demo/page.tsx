"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Building2,
  Users,
  CreditCard,
  Shield,
  TrendingUp,
  Mail,
  CheckCircle,
  ArrowRight,
  Target,
  BarChart3,
  Settings,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'

export default function OrganizationDemoPage() {
  const features = [
    {
      icon: Building2,
      title: "Organization Management",
      description: "Create and manage your organization with multiple team members",
      demo: "Create 'Acme Corp' with domain-based auto-joining"
    },
    {
      icon: Users,
      title: "Employee Management", 
      description: "Invite team members with role-based permissions",
      demo: "Invite colleagues as Admin, Manager, or Employee"
    },
    {
      icon: CreditCard,
      title: "Centralized Billing",
      description: "Shared credit pools and consolidated billing for the entire organization",
      demo: "25,000 credits/month shared across 50 team members"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Fine-grained permissions and access control",
      demo: "Owner > Admin > Manager > Employee hierarchy"
    },
    {
      icon: TrendingUp,
      title: "Usage Analytics",
      description: "Track team usage, costs, and performance metrics",
      demo: "See who's using credits and for what services"
    },
    {
      icon: Mail,
      title: "Invitation System",
      description: "Email-based invitations with token authentication",
      demo: "Secure invite links that expire in 7 days"
    }
  ]

  const useCases = [
    {
      icon: Target,
      title: "Sales Teams",
      scenario: "Marketing agencies need to manage multiple clients and team members",
      benefits: ["Shared AI credits", "Client project separation", "Team collaboration", "Usage tracking"]
    },
    {
      icon: BarChart3,
      title: "Enterprise Companies",
      scenario: "Large corporations with multiple departments using AI tools",
      benefits: ["Centralized billing", "Department-level analytics", "Role management", "Cost control"]
    },
    {
      icon: Settings,
      title: "Growing Businesses",
      scenario: "Startups scaling from individual to team usage",
      benefits: ["Easy onboarding", "Flexible plans", "Usage monitoring", "Admin controls"]
    }
  ]

  const demoFlow = [
    {
      step: 1,
      title: "Create Organization",
      description: "Admin creates 'Acme Corporation' with Business plan ($499/month)",
      action: "Organization gets 25,000 credits and 50 member slots"
    },
    {
      step: 2,
      title: "Invite Team Members",
      description: "Send email invitations with specific roles and permissions",
      action: "Members receive secure invitation links via email"
    },
    {
      step: 3,
      title: "Collaborate & Create",
      description: "Team uses shared credits for AI content creation",
      action: "All usage tracked and attributed to organization billing"
    },
    {
      step: 4,
      title: "Monitor & Manage",
      description: "View analytics, manage members, and control costs",
      action: "Admins get usage alerts and detailed reporting"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Building2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
          Organization Management Demo
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
          See how CaptureIT LS enables seamless organizational billing and employee management for teams of any size.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/organization">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Try Live Demo
            </Button>
          </Link>
          <Link href="/organization/accept-invite?token=demo">
            <Button variant="outline" className="border-gray-600">
              View Invitation Flow
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 bg-gray-900/50 border-gray-700 h-full">
                <feature.icon className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 mb-3">{feature.description}</p>
                <div className="bg-blue-900/20 border border-blue-700 rounded p-3">
                  <p className="text-blue-300 text-sm">{feature.demo}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Demo Flow */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
        
        <div className="space-y-6">
          {demoFlow.map((flow, index) => (
            <motion.div
              key={flow.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {flow.step}
                </div>
              </div>
              
              <Card className="flex-1 p-6 bg-gray-900/50 border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">{flow.title}</h3>
                <p className="text-gray-400 mb-3">{flow.description}</p>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{flow.action}</span>
                </div>
              </Card>
              
              {index < demoFlow.length - 1 && (
                <ArrowRight className="w-6 h-6 text-gray-400 mt-6 hidden lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Use Cases */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Perfect For</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 bg-gray-900/50 border-gray-700 h-full">
                <useCase.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
                <p className="text-gray-400 mb-4">{useCase.scenario}</p>
                
                <div className="space-y-2">
                  {useCase.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Pricing Comparison */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Organization vs Individual Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Individual Plans */}
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Individual Plans</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Starter:</span>
                <span className="text-white">$0/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Professional:</span>
                <span className="text-white">$49/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Enterprise:</span>
                <span className="text-white">Custom</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">Best for individual creators and small projects</p>
            </div>
          </Card>

          {/* Organization Plans */}
          <Card className="p-6 bg-blue-900/20 border-blue-700">
            <h3 className="text-xl font-semibold text-white mb-4">Organization Plans</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Team (10 members):</span>
                <span className="text-white">$199/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Business (50 members):</span>
                <span className="text-white">$499/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Enterprise (unlimited):</span>
                <span className="text-white">$1,999/month</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-blue-700">
              <p className="text-blue-300 text-sm">Best for teams and organizations with shared workflows</p>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="text-center"
      >
        <Card className="p-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Try Organization Management?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Experience the power of centralized billing, team management, and collaborative AI content creation.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/organization">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Building2 className="w-4 h-4 mr-2" />
                Create Organization
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-gray-600">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </motion.section>
    </div>
  )
}