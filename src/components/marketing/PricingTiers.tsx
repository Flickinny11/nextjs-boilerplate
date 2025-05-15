"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2 } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for trying out CaptureIt LS",
    features: [
      "100 leads per month",
      "Basic lead filtering",
      "Email support",
      "Basic analytics"
    ]
  },
  {
    name: "Professional",
    price: "$49",
    description: "For growing businesses and teams",
    features: [
      "1,000 leads per month",
      "Advanced lead filtering",
      "Priority support",
      "Advanced analytics",
      "Custom exports",
      "Team collaboration"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited leads",
      "Custom integrations",
      "24/7 dedicated support",
      "Advanced analytics",
      "Custom exports",
      "Team collaboration",
      "API access",
      "Custom features"
    ]
  }
];

export function PricingTiers() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = (tier: string) => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/subscribe?plan=${tier.toLowerCase()}`);
    }
  };

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
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include our core features with different limits and capabilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
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
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  onClick={() => handleGetStarted(tier.name)}
                >
                  Get Started
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
