"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { 
  Menu,
  X,
  Home,
  Settings,
  HelpCircle,
  Mail,
  LogIn,
  BarChart,
  ServerCog,
  ShieldCheck,
  Zap,
  Users,
  Target,
  Building2,
  Video,
  Palette,
  Rocket
} from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/contact", label: "Contact", icon: Mail },
    ...(user ? [
      { href: "/dashboard", label: "Dashboard", icon: BarChart },
      { href: "/captureit", label: "CaptureIT", icon: Video },
      { href: "/leads", label: "Leads", icon: Users },
      { href: "/crm", label: "CRM", icon: Target },
      { href: "/organization", label: "Organization", icon: Building2 },
      { href: "/marketing", label: "Marketing", icon: Zap },
      { href: "/marketing/advanced", label: "Advanced Marketing", icon: Rocket, isAdvanced: true },
      { href: "/create", label: "Create", icon: Palette },
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/api", label: "API", icon: ServerCog },
      { href: "/status", label: "System Status", icon: ShieldCheck }
    ] : [
      { href: "/login", label: "Login", icon: LogIn }
    ])
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-gray-800">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`transition-all duration-200 flex items-center space-x-1 ${
                  item.isAdvanced 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-purple-300 hover:via-pink-400 hover:to-red-400 animate-pulse" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.isAdvanced ? "text-purple-500" : ""}`} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        item.isAdvanced 
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:bg-gradient-to-r hover:from-purple-900/20 hover:via-pink-900/20 hover:to-red-900/20" 
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className={`w-4 h-4 ${item.isAdvanced ? "text-purple-500" : ""}`} />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
