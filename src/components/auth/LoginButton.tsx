"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const providers = [
  {
    name: "Google",
    bgColor: "bg-white hover:bg-gray-100",
    textColor: "text-gray-800",
    handler: "signInWithGoogle",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    )
  },
  {
    name: "GitHub",
    bgColor: "bg-[#24292e] hover:bg-[#1a1e22]",
    textColor: "text-white",
    handler: "signInWithGithub",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path
          fill="currentColor"
          d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.55-1.42-1.35-1.8-1.35-1.8-1.1-.75.08-.73.08-.73 1.22.08 1.86 1.25 1.86 1.25 1.08 1.84 2.83 1.31 3.52 1 .11-.79.42-1.31.77-1.61-2.7-.3-5.53-1.35-5.53-6 0-1.33.47-2.42 1.25-3.27-.13-.31-.54-1.57.12-3.26 0 0 1.02-.33 3.35 1.25a11.68 11.68 0 016 0c2.33-1.58 3.35-1.25 3.35-1.25.66 1.69.25 2.95.12 3.26.78.85 1.25 1.94 1.25 3.27 0 4.67-2.84 5.7-5.55 6 .44.38.83 1.12.83 2.26v3.35c0 .29.18.63.74.52A11 11 0 0012 1.27"
        />
      </svg>
    )
  },
  {
    name: "Microsoft",
    bgColor: "bg-[#2F2F2F] hover:bg-[#262626]",
    textColor: "text-white",
    handler: "signInWithMicrosoft",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#00A4EF" d="M1 13h10v10H1z" />
        <path fill="#7FBA00" d="M13 1h10v10H13z" />
        <path fill="#FFB900" d="M13 13h10v10H13z" />
      </svg>
    )
  },
  {
    name: "Apple",
    bgColor: "bg-black hover:bg-[#1a1a1a]",
    textColor: "text-white",
    handler: "signInWithApple",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path
          fill="currentColor"
          d="M17.05 20.28c-.98.95-2.05.94-3.1.42-.99-.49-1.89-.51-2.93 0-1.33.66-2.03.57-2.91-.27-4.41-4.8-3.33-11.9 1.91-12.38 1.19.04 2.03.46 2.77.53.83.09 1.66-.27 2.5-.36 1.45-.15 2.76.53 3.58 1.51-3.1 1.79-2.59 5.75.42 6.96-.71 1.64-1.66 3.27-2.24 4.59zm-2.98-16.21c-.06 2.08 1.83 3.57 3.84 3.34.17-2.03-1.8-3.67-3.84-3.34z"
        />
      </svg>
    )
  }
];

export function LoginButton() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (providerHandler: string) => {
    try {
      setIsLoading(true);
      switch(providerHandler) {
        case 'signInWithGoogle':
          await auth.signInWithGoogle();
          break;
        case 'signInWithGithub':
          await auth.signInWithGithub();
          break;
        case 'signInWithMicrosoft':
          await auth.signInWithMicrosoft();
          break;
        case 'signInWithApple':
          await auth.signInWithApple();
          break;
        default:
          console.error('Unknown provider handler:', providerHandler);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {providers.map((provider, index) => (
        <motion.div
          key={provider.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="w-full"
        >
          <Button
            variant="outline"
            className={`w-full ${provider.bgColor} ${provider.textColor} border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
            onClick={() => handleLogin(provider.handler)}
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-3">
              {provider.icon}
              <span>Continue with {provider.name}</span>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
