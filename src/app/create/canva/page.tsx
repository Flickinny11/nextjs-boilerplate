"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Palette,
  Plus,
  Search,
  Settings,
  MessageSquare,
  Wand2,
  Download,
  Share,
  Eye,
  Edit,
  Trash,
  Loader2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { canvaIntegrationService, CanvaDesign, CanvaAccount } from '@/lib/canvaIntegrationService';
import Link from 'next/link';

interface CanvaDashboardProps {
  onDesignSelect?: (design: CanvaDesign) => void;
}

export default function CanvaDashboard({ onDesignSelect }: CanvaDashboardProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<CanvaAccount[]>([]);
  const [designs, setDesigns] = useState<CanvaDesign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<CanvaDesign | null>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [isCreatingDesign, setIsCreatingDesign] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const accounts = canvaIntegrationService.getConnectedAccounts();
      setConnectedAccounts(accounts);

      if (accounts.length > 0) {
        const userDesigns = await canvaIntegrationService.getUserDesigns(accounts[0].id);
        setDesigns(userDesigns);
      }
    } catch (error) {
      console.error('Error loading Canva data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDesign = async (designType: string = 'social-media') => {
    if (connectedAccounts.length === 0) return;

    try {
      setIsCreatingDesign(true);
      const newDesign = await canvaIntegrationService.createDesign(
        connectedAccounts[0].id,
        undefined,
        designType
      );
      
      if (newDesign) {
        setDesigns(prev => [newDesign, ...prev]);
        setSelectedDesign(newDesign);
        onDesignSelect?.(newDesign);
      }
    } catch (error) {
      console.error('Error creating design:', error);
    } finally {
      setIsCreatingDesign(false);
    }
  };

  const filteredDesigns = designs.filter(design =>
    design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (connectedAccounts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800 text-center max-w-md">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Canva Account</h2>
          <p className="text-gray-400 mb-6">
            To start creating designs, you need to connect your Canva account first.
          </p>
          <Link href="/create/setup">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Settings className="w-4 h-4 mr-2" />
              Setup Integration
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Canva Studio</h1>
          <p className="text-gray-400">
            Create and manage your designs with AI-powered assistance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setChatVisible(!chatVisible)}
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
          <Button
            onClick={() => handleCreateDesign()}
            disabled={isCreatingDesign}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isCreatingDesign ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            New Design
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Input
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/50 border-gray-700 focus:border-purple-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCreateDesign('social-media')}
            className="border-gray-700 hover:border-purple-500"
          >
            Social Media
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCreateDesign('presentation')}
            className="border-gray-700 hover:border-purple-500"
          >
            Presentation
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCreateDesign('poster')}
            className="border-gray-700 hover:border-purple-500"
          >
            Poster
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Design Grid */}
        <div className={`${chatVisible ? 'col-span-8' : 'col-span-12'} transition-all duration-300`}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 h-48 rounded-lg mb-2" />
                  <div className="bg-gray-800 h-4 rounded mb-1" />
                  <div className="bg-gray-800 h-3 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDesigns.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card 
                    className={`p-4 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-purple-500 transition-all duration-300 cursor-pointer group ${
                      selectedDesign?.id === design.id ? 'border-purple-500 bg-purple-500/10' : ''
                    }`}
                    onClick={() => {
                      setSelectedDesign(design);
                      onDesignSelect?.(design);
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gray-900 rounded-lg mb-3 overflow-hidden">
                      {design.thumbnail ? (
                        <img 
                          src={design.thumbnail} 
                          alt={design.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Palette className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Design Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-white truncate">{design.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="capitalize">{design.type}</span>
                        <span>{new Date(design.updatedAt).toLocaleDateString()}</span>
                      </div>
                      
                      {/* Tags */}
                      {design.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {design.tags.slice(0, 2).map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {design.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{design.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" className="p-1 h-auto">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1 h-auto">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1 h-auto">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-1 h-auto text-purple-400 hover:text-purple-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(design.url, '_blank');
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No designs found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Create your first design to get started'}
              </p>
              <Button onClick={() => handleCreateDesign()} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Design
              </Button>
            </div>
          )}
        </div>

        {/* AI Chat Panel */}
        {chatVisible && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="col-span-4"
          >
            <Card className="h-[600px] bg-black/50 backdrop-blur-lg border-gray-800 flex flex-col">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Design Assistant</h3>
                    <p className="text-xs text-gray-400">Ask me to help with your designs</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setChatVisible(false)}
                  className="p-1 h-auto"
                >
                  ×
                </Button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <p className="text-sm text-purple-200">
                      Hi! I&apos;m your AI design assistant. I can help you:
                    </p>
                    <ul className="text-xs text-purple-300 mt-2 space-y-1">
                      <li>• Create new designs from prompts</li>
                      <li>• Apply brand styles to existing designs</li>
                      <li>• Suggest design improvements</li>
                      <li>• Extract colors and fonts from images</li>
                    </ul>
                  </div>
                  
                  {selectedDesign && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-sm text-white mb-2">
                        Selected: <span className="font-semibold">{selectedDesign.title}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Wand2 className="w-3 h-3 mr-1" />
                          Enhance
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Palette className="w-3 h-3 mr-1" />
                          Extract Style
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-800">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Ask me anything about your designs..."
                    className="flex-1 bg-gray-900 border-gray-700 text-sm"
                  />
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Wand2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}