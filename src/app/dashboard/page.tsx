"use client";

import { useAuth } from "src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-white">Welcome, {user.displayName || user.email}</h1>

      <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <p>Email: {user.email}</p>
        <p>UID: {user.uid}</p>
        {/* Add more user info as needed */}
      </Card>

      <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 mb-6">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        <p>Your subscription status will be displayed here.</p>
        {/* Integrate subscription status and management */}
      </Card>

      <Button
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        onClick={async () => {
          await logout();
          router.push("/");
        }}
      >
        Sign Out
      </Button>
    </motion.div>
  );
}
