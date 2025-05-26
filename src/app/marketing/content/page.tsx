"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  ImageIcon, 
  Video, 
  Loader2, 
  Check, 
  Copy, 
  Download, 
  RefreshCw,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { VideoPreview } from "@/components/ui/VideoPreview";
import Link from "next/link";

// Mock data for demo purposes
const mockTextContent = `# 5 Ways to Engage Tech Industry Leads

Are you looking to connect with decision-makers in the tech industry? Here's how to make your outreach stand out:

## 1. Solve Their Specific Problems
Tech professionals value solutions that address their unique challenges. Research common pain points in their specific sector and tailor your messaging accordingly.

## 2. Data-Driven Messaging
Back your claims with statistics and case studies. Tech leads respond well to evidence-based approaches rather than vague promises.

## 3. Educational Content Strategy
Position yourself as a thought leader by providing valuable insights. Webinars, white papers, and technical blog posts demonstrate your expertise.

## 4. Personalized Tech Stack Recommendations
Show you understand their infrastructure by making relevant recommendations that complement their existing tools.

## 5. Automated Yet Personal Follow-ups
Use automation tools to maintain consistent communication, but ensure each touchpoint feels personalized to their specific situation.

Remember, tech industry leads are bombarded with marketing messages daily. Your approach needs to be concise, valuable, and distinctly relevant to their needs.`;

const mockImageContent = {
  url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  alt: "Tech marketing concept image with digital interface"
};

export default function ContentCreator() {
  const [activeTab, setActiveTab] = useState("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentGenerated, setContentGenerated] = useState(false);
  
  const [formData, setFormData] = useState({
    contentType: "text",
    industry: "",
    purpose: "",
    tone: "professional",
    format: "",
    additionalInstructions: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsGenerating(false);
      setContentGenerated(true);
    }, 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderContentPreview = () => {
    if (!contentGenerated) return null;
    
    switch (activeTab) {
      case "text":
        return (
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Generated Text Content</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(mockTextContent)}
                  className="text-xs border-gray-700 hover:bg-gray-800"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-700 hover:bg-gray-800"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="whitespace-pre-wrap bg-black/30 p-4 rounded-md overflow-auto max-h-[400px]">
                {mockTextContent}
              </div>
            </div>
          </Card>
        );
      case "image":
        return (
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Generated Image</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-700 hover:bg-gray-800"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-700 hover:bg-gray-800"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-lg">
                <img 
                  src={mockImageContent.url} 
                  alt={mockImageContent.alt} 
                  className="rounded-md w-full h-auto object-cover shadow-lg"
                />
              </div>
              <p className="text-sm text-gray-400 mt-4">{mockImageContent.alt}</p>
            </div>
          </Card>
        );
      case "video":
        return (
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Generated Video</h3>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-gray-700 hover:bg-gray-800"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Regenerate
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <VideoPreview
                title="Tech Industry Engagement Strategies"
                description="A professional overview of how to effectively engage with tech industry leads"
                thumbnailUrl="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
                videoUrl="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
              />
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      <div className="mb-8">
        <Link href="/marketing" className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketing Suite
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
          Content Creator
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Generate compelling marketing content for your campaigns using AI
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <h2 className="text-xl font-bold mb-6">Content Settings</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="content-type">Content Type</Label>
                <Tabs 
                  defaultValue="text" 
                  className="mt-2"
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value);
                    handleChange("contentType", value);
                  }}
                >
                  <TabsList className="grid grid-cols-3 bg-gray-800/50">
                    <TabsTrigger value="text" className="data-[state=active]:bg-blue-600">
                      <FileText className="w-4 h-4 mr-2" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="image" className="data-[state=active]:bg-blue-600">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Image
                    </TabsTrigger>
                    <TabsTrigger value="video" className="data-[state=active]:bg-blue-600">
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <Label htmlFor="industry">Target Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  className="mt-1 bg-gray-900/50 border-gray-700"
                  value={formData.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Lead generation, Brand awareness"
                  className="mt-1 bg-gray-900/50 border-gray-700"
                  value={formData.purpose}
                  onChange={(e) => handleChange("purpose", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="tone">Tone</Label>
                <Select 
                  value={formData.tone} 
                  onValueChange={(value) => handleChange("tone", value)}
                >
                  <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="empathetic">Empathetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeTab === "text" && (
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select 
                    value={formData.format} 
                    onValueChange={(value) => handleChange("format", value)}
                  >
                    <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700">
                      <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog-post">Blog Post</SelectItem>
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="social-post">Social Media Post</SelectItem>
                      <SelectItem value="ad-copy">Advertisement Copy</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="additional-instructions">Additional Instructions</Label>
                <Textarea
                  id="additional-instructions"
                  placeholder="Any specific requirements or information to include..."
                  className="mt-1 bg-gray-900/50 border-gray-700 h-20 resize-none"
                  value={formData.additionalInstructions}
                  onChange={(e) => handleChange("additionalInstructions", e.target.value)}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isGenerating}
                  onClick={handleSubmit}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      {contentGenerated ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Regenerate Content
                        </>
                      ) : (
                        "Generate Content"
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!contentGenerated && !isGenerating ? (
            <Card className="p-6 h-full bg-black/50 backdrop-blur-lg border-gray-800 flex flex-col items-center justify-center text-center">
              <Info className="w-12 h-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Content Preview</h3>
              <p className="text-gray-400 max-w-md">
                Fill out the form and click "Generate Content" to create your marketing assets.
                You'll see a preview of your content here.
              </p>
            </Card>
          ) : (
            <>
              {isGenerating ? (
                <Card className="p-6 h-full bg-black/50 backdrop-blur-lg border-gray-800 flex flex-col items-center justify-center">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Generating Your Content</h3>
                  <p className="text-gray-400 max-w-md text-center">
                    Our AI is creating high-quality marketing content based on your specifications.
                    This should only take a few moments...
                  </p>
                </Card>
              ) : (
                renderContentPreview()
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}