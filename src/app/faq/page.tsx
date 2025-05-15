"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { VideoPreview } from "@/components/ui/VideoPreview";

interface FAQItem {
  question: string;
  answer: string;
}

interface VideoTutorial {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is CaptureIt LS?",
    answer: "CaptureIt LS is an AI-powered lead generation tool that helps businesses identify and capture high-quality sales leads automatically. Our platform uses advanced algorithms to match your criteria and deliver targeted leads."
  },
  {
    question: "How does the AI lead generation work?",
    answer: "Our AI analyzes multiple data points including industry, experience, location, and position to identify potential leads. It then validates these leads using machine learning models to ensure high quality and relevance."
  },
  {
    question: "What pricing plans are available?",
    answer: "We offer flexible pricing plans starting from a free tier for basic usage, up to enterprise plans for large organizations. Each plan includes different features and lead quotas to match your needs."
  },
  {
    question: "Can I integrate CaptureIt LS with my CRM?",
    answer: "Yes! CaptureIt LS integrates seamlessly with popular CRM platforms. We provide API access and direct integrations for major CRM systems to ensure smooth data flow."
  },
  {
    question: "How accurate are the leads?",
    answer: "Our AI system maintains a high accuracy rate by continuously learning and improving. We validate leads through multiple sources and provide quality scores for each lead."
  }
];

const tutorials: VideoTutorial[] = [
  {
    title: "Getting Started with CaptureIt LS",
    description: "Learn how to set up your account and capture your first leads in minutes.",
    videoUrl: "/videos/getting-started.mp4",
    thumbnailUrl: "/videos/thumbnails/getting-started.jpg"
  },
  {
    title: "Advanced Lead Filtering",
    description: "Master the art of finding exactly the right leads for your business.",
    videoUrl: "/videos/advanced-filtering.mp4",
    thumbnailUrl: "/videos/thumbnails/advanced-filtering.jpg"
  },
  {
    title: "CRM Integration Guide",
    description: "Connect CaptureIt LS to your favorite CRM system.",
    videoUrl: "/videos/crm-integration.mp4",
    thumbnailUrl: "/videos/thumbnails/crm-integration.jpg"
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);

  return (
    <div className="container mx-auto px-4 py-16 mt-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Everything you need to know about CaptureIt LS. Can't find the answer you're looking for? 
          Feel free to contact our support team.
        </p>
      </motion.div>

      {/* Video Tutorials Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-8">Video Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <VideoPreview
                title={tutorial.title}
                description={tutorial.description}
                videoUrl={tutorial.videoUrl}
                thumbnailUrl={tutorial.thumbnailUrl}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ Accordion */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-8">Common Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-black/50 backdrop-blur-lg border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 text-gray-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <video
                className="w-full h-full"
                controls
                autoPlay
                src={selectedVideo.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
