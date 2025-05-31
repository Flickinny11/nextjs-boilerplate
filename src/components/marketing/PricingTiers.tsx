"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Building2 } from "lucide-react";
import { useState } from "react";
import { TIER_CONFIGURATIONS } from "@/lib/tierModelConfig";

const individualTiers = [
  {
    name: "Entry",
    price: "$5",
    description: "Perfect for individuals getting started",
    features: TIER_CONFIGURATIONS.entry.features
  },
  {
    name: "Professional",
    price: "$40", 
    description: "For growing businesses and teams",
    features: TIER_CONFIGURATIONS.professional.features,
    popular: true
  },
  {
    name: "Business",
    price: "$60",
    description: "For established businesses with advanced needs",
    features: TIER_CONFIGURATIONS.business.features
  },
  {
    name: "Premium",
    price: "$80",
    description: "For enterprises requiring maximum capabilities",
    features: TIER_CONFIGURATIONS.premium.features
  }
];

const organizationTiers = [
  {
    name: "Team",
    price: "$25",
    description: "Perfect for small teams getting started",
    maxMembers: "5" as const,
    credits: "2,500",
    features: [
      "Up to 5 team members",
      "2,500 credits per month",
      "Basic team management",
      "Usage analytics", 
      "Email support",
      "Shared credit pool"
    ]
  },
  {
    name: "Business",
    price: "$200",
    description: "For growing organizations with larger teams",
    maxMembers: "25" as const,
    credits: "15,000",
    features: [
      "Up to 25 team members",
      "15,000 credits per month",
      "Advanced team management",
      "Role-based permissions",
      "Usage analytics",
      "Priority support",
      "API access",
      "Centralized billing"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$800",
    description: "For large organizations with advanced management needs",
    maxMembers: "Unlimited" as const,
    credits: "100,000",
    features: [
      "Unlimited team members",
      "100,000 credits per month",
      "Full organization management",
      "🚀 Manager Console Dashboard",
      "📊 Real-time employee monitoring",
      "🤖 Smart collaboration alerts",
      "🎯 Performance insights & analytics",
      "💬 Team communication tools",
      "🔗 Cross-employee opportunity detection",
      "🏆 Competitive intelligence sharing",
      "📈 Predictive team analytics",
      "🎓 Manager assistance AI",
      "Custom roles and permissions",
      "Dedicated support",
      "Custom integrations",
      "SSO integration",
      "Audit logs"
    ],
    highlight: "🔥 NEW: Manager Console - The only CRM that helps managers help their teams!"
  }
];

export function PricingTiers() {
  const router = useRouter();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'individual' | 'organization'>('individual');

  const handleGetStarted = (tier: string) => {
    if (!user) {
      router.push("/login");
    } else {
      if (viewMode === 'organization') {
        router.push("/organization");
      } else {
        router.push(`/subscribe?plan=${tier.toLowerCase()}`);
      }
    }
  };

  const currentTiers = viewMode === 'organization' ? organizationTiers : individualTiers;

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
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your business. All plans include our core features with different limits and capabilities.
          </p>
          
          {/* Toggle between Individual and Organization plans */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setViewMode('individual')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                viewMode === 'individual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Individual Plans
            </button>
            <button
              onClick={() => setViewMode('organization')}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                viewMode === 'organization'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Organization Plans
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card className={`p-6 bg-black/50 backdrop-blur-lg border-2 ${
                tier.popular 
                  ? "border-blue-500" 
                  : "border-gray-800 hover:border-gray-700"
              } transition-all duration-300`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    {tier.price}
                    {tier.price !== "Custom" && <span className="text-sm text-gray-400">/month</span>}
                  </div>
                  <p className="text-gray-400 text-sm">{tier.description}</p>
                  
                  {/* Organization plan details */}
                  {viewMode === 'organization' && 'maxMembers' in tier && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Max Members:</span>
                        <span className="text-white">{String(tier.maxMembers)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>Monthly Credits:</span>
                        <span className="text-white">{('credits' in tier) ? String(tier.credits) : 'Unlimited'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Manager Console Highlight for Enterprise */}
                {tier.name === 'Enterprise' && viewMode === 'organization' && 'highlight' in tier && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-400 mb-2">🔥 EXCLUSIVE ENTERPRISE FEATURE</div>
                      <div className="text-xs text-blue-300">{tier.highlight}</div>
                    </div>
                  </div>
                )}

                <Button
                  className={`w-full ${
                    tier.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  onClick={() => handleGetStarted(tier.name)}
                >
                  {viewMode === 'organization' ? 'Create Organization' : 'Get Started'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {viewMode === 'organization' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-2">Why Choose Organization Plans?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Centralized billing and credit management</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Role-based access control</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Team usage analytics and insights</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Easy employee invitation and management</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
