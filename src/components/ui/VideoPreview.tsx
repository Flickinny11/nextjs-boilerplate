"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VideoPreviewProps {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export function VideoPreview({ title, description, thumbnailUrl, videoUrl }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <Card 
        className="overflow-hidden bg-black/50 backdrop-blur-lg border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer group"
        onClick={() => setIsPlaying(true)}
      >
        <div className="relative aspect-video">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          {/* Placeholder for thumbnail */}
          <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </Card>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                onClick={() => setIsPlaying(false)}
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <video
                className="w-full h-full"
                controls
                autoPlay
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
