"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Info,
  Upload,
  Sparkles,
  Palette,
  Settings,
  Zap
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
import { Switch } from "@/components/ui/switch";
import { VideoPreview } from "@/components/ui/VideoPreview";
import Link from "next/link";

// Campaign data (in real app, this would come from database)
const mockCampaigns = [
  { id: '1', name: 'Tech Product Launch', styles: { colors: ['#007bff', '#6c757d'], tone: 'professional' } },
  { id: '2', name: 'Fashion Sale Event', styles: { colors: ['#ff6b6b', '#feca57'], tone: 'energetic' } },
  { id: '3', name: 'B2B Software Demo', styles: { colors: ['#48dbfb', '#0abde3'], tone: 'trustworthy' } }
];

export default function ContentCreator() {
  const [selectedContentType, setSelectedContentType] = useState<'image' | 'video' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentGenerated, setContentGenerated] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    prompt: "",
    campaignId: "",
    useCampaignStyles: false,
    quantity: 1,
    videoDuration: 5,
    uploadedFile: null as File | null
  });

  const handleContentTypeSelect = (type: 'image' | 'video') => {
    setSelectedContentType(type);
    setShowForm(true);
    setContentGenerated(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, uploadedFile: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      setContentGenerated(true);
    }, 3000);
  };

  const resetForm = () => {
    setSelectedContentType(null);
    setShowForm(false);
    setContentGenerated(false);
    setUploadedImage(null);
    setFormData({
      prompt: "",
      campaignId: "",
      useCampaignStyles: false,
      quantity: 1,
      videoDuration: 5,
      uploadedFile: null
    });
  };

  const selectedCampaign = mockCampaigns.find(c => c.id === formData.campaignId);

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
          AI-Powered Media Creator
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Let our AI select the perfect generation service for your content. Just describe what you want!
        </p>
      </motion.div>

      {/* Content Type Selection */}
      {!showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-8 justify-center items-center max-w-4xl mx-auto"
        >
          {/* IMAGE Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleContentTypeSelect('image')}
            className="cursor-pointer group"
          >
            <Card className="p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-transparent hover:border-blue-500 transition-all duration-300 w-80 h-80 flex flex-col items-center justify-center relative overflow-hidden">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="mb-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4"
                animate={{ 
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                IMAGE
              </motion.h2>
              
              <p className="text-gray-300 text-center text-lg">
                Generate stunning marketing images with AI
              </p>
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-blue-400" />
              </motion.div>
              
              <motion.div
                className="absolute bottom-6 left-6"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Palette className="w-5 h-5 text-purple-400" />
              </motion.div>
            </Card>
          </motion.div>

          {/* VIDEO Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleContentTypeSelect('video')}
            className="cursor-pointer group"
          >
            <Card className="p-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-transparent hover:border-purple-500 transition-all duration-300 w-80 h-80 flex flex-col items-center justify-center relative overflow-hidden">
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
                className="mb-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Video className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4"
                animate={{ 
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.7
                }}
              >
                VIDEO
              </motion.h2>
              
              <p className="text-gray-300 text-center text-lg">
                Create engaging marketing videos with AI
              </p>
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute top-4 left-4"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Zap className="w-6 h-6 text-purple-400" />
              </motion.div>
              
              <motion.div
                className="absolute bottom-6 right-6"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                <Settings className="w-5 h-5 text-pink-400" />
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Generation Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Form Panel */}
            <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  {selectedContentType === 'image' ? (
                    <ImageIcon className="w-6 h-6 mr-2 text-blue-500" />
                  ) : (
                    <Video className="w-6 h-6 mr-2 text-purple-500" />
                  )}
                  {selectedContentType?.toUpperCase()} Generation
                </h2>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  Back
                </Button>
              </div>

              <div className="space-y-6">
                {/* AI Prompt */}
                <div>
                  <Label htmlFor="prompt">Describe what you want to create</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your vision... Our AI will enhance your prompt and select the best generation service!"
                    className="mt-1 bg-gray-900/50 border-gray-700 h-24 resize-none"
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label htmlFor="upload">Upload Image (Optional)</Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      id="upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('upload')?.click()}
                      className="w-full border-gray-700 hover:bg-gray-800"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadedImage ? 'Change Image' : 'Upload Image'}
                    </Button>
                    {uploadedImage && (
                      <div className="mt-2">
                        <img src={uploadedImage} alt="Uploaded" className="w-full h-32 object-cover rounded-md" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Campaign Selection */}
                <div>
                  <Label htmlFor="campaign">Campaign (Optional)</Label>
                  <Select 
                    value={formData.campaignId} 
                    onValueChange={(value) => setFormData({ ...formData, campaignId: value })}
                  >
                    <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700">
                      <SelectValue placeholder="Select a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCampaigns.map(campaign => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Campaign Styles Toggle */}
                {formData.campaignId && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-styles"
                      checked={formData.useCampaignStyles}
                      onCheckedChange={(checked) => setFormData({ ...formData, useCampaignStyles: checked })}
                    />
                    <Label htmlFor="use-styles">Use campaign styles</Label>
                    {selectedCampaign && formData.useCampaignStyles && (
                      <div className="flex items-center ml-4">
                        {selectedCampaign.styles.colors.map((color, index) => (
                          <div 
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-600 mr-1"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">{selectedCampaign.styles.tone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <Label htmlFor="quantity">Number of pieces to generate</Label>
                  <Select 
                    value={formData.quantity.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, quantity: parseInt(value) })}
                  >
                    <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Video Duration */}
                {selectedContentType === 'video' && (
                  <div>
                    <Label htmlFor="duration">Video Duration (seconds)</Label>
                    <Select 
                      value={formData.videoDuration.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, videoDuration: parseInt(value) })}
                    >
                      <SelectTrigger className="mt-1 bg-gray-900/50 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 4, 5, 6, 10].map(duration => (
                          <SelectItem key={duration} value={duration.toString()}>{duration}s</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Generate Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isGenerating || !formData.prompt}
                  onClick={handleSubmit}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI is selecting service & generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Preview Panel */}
            <div>
              {!contentGenerated && !isGenerating ? (
                <Card className="p-6 h-full bg-black/50 backdrop-blur-lg border-gray-800 flex flex-col items-center justify-center text-center">
                  <Info className="w-12 h-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI Preview</h3>
                  <p className="text-gray-400 max-w-md">
                    Our AI will analyze your request, select the best generation service, and create your {selectedContentType} content.
                  </p>
                </Card>
              ) : isGenerating ? (
                <Card className="p-6 h-full bg-black/50 backdrop-blur-lg border-gray-800 flex flex-col items-center justify-center">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI is Working...</h3>
                  <div className="text-gray-400 max-w-md text-center space-y-2">
                    <p>🤖 Analyzing your request...</p>
                    <p>🎯 Selecting optimal generation service...</p>
                    <p>✨ Creating your {selectedContentType} content...</p>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-lg">Generated {selectedContentType?.toUpperCase()}</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-xs border-gray-700 hover:bg-gray-800">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSubmit} className="text-xs border-gray-700 hover:bg-gray-800">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  
                  {selectedContentType === 'image' ? (
                    <div className="space-y-4">
                      <img 
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b" 
                        alt="Generated marketing image" 
                        className="w-full rounded-md"
                      />
                      <div className="bg-blue-900/20 p-3 rounded-md">
                        <p className="text-sm text-blue-300">
                          <strong>Service Used:</strong> FLUX Pro (High Quality)
                        </p>
                        <p className="text-sm text-blue-300">
                          <strong>AI Enhancement:</strong> Added professional lighting and brand colors
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <VideoPreview
                        title="Marketing Video"
                        description="AI-generated marketing video"
                        thumbnailUrl="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
                        videoUrl="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
                      />
                      <div className="bg-purple-900/20 p-3 rounded-md">
                        <p className="text-sm text-purple-300">
                          <strong>Service Used:</strong> Minimax Video 01 Live
                        </p>
                        <p className="text-sm text-purple-300">
                          <strong>AI Selection:</strong> Chosen for marketing content, 5s duration
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}