"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Download, Apple, Bot } from "lucide-react";

export function MobileAppDownload() {
  const handleIOSDownload = () => {
    // For now, redirect to PWA install
    if ('serviceWorker' in navigator) {
      // Trigger PWA install prompt
      window.location.href = window.location.href;
    } else {
      // Fallback to app store when available
      alert("iOS app coming soon! Use the web version for now.");
    }
  };

  const handleAndroidDownload = () => {
    // For now, redirect to PWA install
    if ('serviceWorker' in navigator) {
      // Trigger PWA install prompt
      window.location.href = window.location.href;
    } else {
      // Fallback to Google Play when available
      alert("Android app coming soon! Use the web version for now.");
    }
  };

  const handlePWAInstall = () => {
    // Trigger PWA install
    alert("To install: Click the browser menu > 'Add to Home Screen' or 'Install App'");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="py-16 relative z-10"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Take CaptureIT LS Anywhere
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Download our mobile app for on-the-go lead capture and CRM management. Available for iOS, Android, and as a Progressive Web App.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* iOS App */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-blue-500 transition-colors h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Apple className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">iOS App</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Native iOS experience with full offline capabilities and Push notifications.
                </p>
                <Button
                  onClick={handleIOSDownload}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download for iPhone
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Android App */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-green-500 transition-colors h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Android App</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Optimized for Android with deep system integration and widgets.
                </p>
                <Button
                  onClick={handleAndroidDownload}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download for Android
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* PWA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-purple-500 transition-colors h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Web App</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Install directly from your browser. Works on any device with internet.
                </p>
                <Button
                  onClick={handlePWAInstall}
                  variant="outline"
                  className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Web App
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          <div className="text-center p-4">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-sm text-gray-400">Offline Access</p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">🔔</div>
            <p className="text-sm text-gray-400">Push Notifications</p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm text-gray-400">Fast Performance</p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">🔄</div>
            <p className="text-sm text-gray-400">Auto Sync</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}