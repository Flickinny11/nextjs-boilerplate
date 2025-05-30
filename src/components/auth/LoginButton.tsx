"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Loader2 } from "lucide-react";

export function LoginButton() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll use a demo account
      await login("demo@captureit.com", "demo123");
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-700 hover:border-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-3">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
              <span>{isLoading ? "Signing in..." : "Demo Login"}</span>
            </div>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border-gray-700 hover:border-gray-600 transition-all duration-300"
            onClick={() => setShowForm(true)}
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-3">
              <Lock className="w-5 h-5" />
              <span>Email & Password</span>
            </div>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto"
    >
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full text-gray-400 hover:text-white"
          onClick={() => setShowForm(false)}
        >
          Back to options
        </Button>
      </form>
    </motion.div>
  );
}
