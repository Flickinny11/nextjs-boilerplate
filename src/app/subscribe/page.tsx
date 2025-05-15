"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";

interface PlanDetails {
  name: string;
  price: string;
  features: string[];
}

export default function SubscribePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: Record<string, PlanDetails> = {
    starter: {
      name: "Starter",
      price: "$0",
      features: [
        "100 leads per month",
        "Basic lead filtering",
        "Email support",
        "Basic analytics"
      ]
    },
    professional: {
      name: "Professional",
      price: "$49",
      features: [
        "1,000 leads per month",
        "Advanced lead filtering",
        "Priority support",
        "Advanced analytics",
        "Custom exports",
        "Team collaboration"
      ]
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom",
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
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard after successful subscription
      router.push("/dashboard");
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Select a plan that best fits your needs. All plans include our core features with different limits and capabilities.
        </p>
      </motion.div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {Object.entries(plans).map(([key, plan], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className={`p-6 bg-black/50 backdrop-blur-lg border-2 transition-all duration-300 cursor-pointer ${
                selectedPlan === key 
                  ? "border-blue-500" 
                  : "border-gray-800 hover:border-gray-700"
              }`}
              onClick={() => setSelectedPlan(key)}
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                {plan.price}
                {plan.price !== "Custom" && <span className="text-sm text-gray-400">/month</span>}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full ${
                  selectedPlan === key
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                {selectedPlan === key ? "Selected" : "Select Plan"}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Payment Form */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Payment Details</h2>
              <div className="flex items-center text-gray-400">
                <Lock className="w-4 h-4 mr-2" />
                <span className="text-sm">Secure Payment</span>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="bg-gray-900/50 border-gray-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    className="bg-gray-900/50 border-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVC</label>
                  <Input
                    type="text"
                    placeholder="123"
                    className="bg-gray-900/50 border-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Subscribe Now
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
