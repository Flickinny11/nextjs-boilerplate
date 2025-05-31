"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Zap,
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
  Sparkles,
  Image,
  Video,
  FileText,
  Layers
} from 'lucide-react';
import { adobeExpressService, AdobeProject, AdobeAccount, AdobeAsset } from '@/lib/adobeExpressService';
import Link from 'next/link';

interface AdobeDashboardProps {
  onProjectSelect?: (project: AdobeProject) => void;
}

export default function AdobeDashboard({ onProjectSelect }: AdobeDashboardProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<AdobeAccount[]>([]);
  const [projects, setProjects] = useState<AdobeProject[]>([]);
  const [assets, setAssets] = useState<AdobeAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<AdobeProject | null>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'assets'>('projects');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const accounts = adobeExpressService.getConnectedAccounts();
      setConnectedAccounts(accounts);

      if (accounts.length > 0) {
        const [userProjects, userAssets] = await Promise.all([
          adobeExpressService.getUserProjects(accounts[0].id),
          adobeExpressService.getUserAssets(accounts[0].id)
        ]);
        setProjects(userProjects);
        setAssets(userAssets);
      }
    } catch (error) {
      console.error('Error loading Adobe data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (projectType: AdobeProject['type'] = 'image') => {
    if (connectedAccounts.length === 0) return;

    try {
      setIsCreatingProject(true);
      const projectName = `New ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project`;
      const newProject = await adobeExpressService.createProject(
        connectedAccounts[0].id,
        projectName,
        undefined,
        projectType
      );
      
      if (newProject) {
        setProjects(prev => [newProject, ...prev]);
        setSelectedProject(newProject);
        onProjectSelect?.(newProject);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const getProjectIcon = (type: AdobeProject['type']) => {
    const iconMap = {
      'image': Image,
      'video': Video,
      'animation': Layers,
      'webpage': FileText,
      'document': FileText
    };
    return iconMap[type] || Image;
  };

  const getAssetIcon = (type: AdobeAsset['type']) => {
    const iconMap = {
      'image': Image,
      'video': Video,
      'audio': Layers,
      'font': FileText,
      'template': Layers
    };
    return iconMap[type] || Image;
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (connectedAccounts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Adobe Account</h2>
          <p className="text-gray-400 mb-6">
            To start creating with Adobe Express, connect your Adobe Creative Cloud account.
          </p>
          <Link href="/create/setup">
            <Button className="bg-red-600 hover:bg-red-700">
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
          <h1 className="text-3xl font-bold text-white mb-2">Adobe Express Studio</h1>
          <p className="text-gray-400">
            Professional creative tools with AI-powered enhancements
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setChatVisible(!chatVisible)}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/10"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
          <Button
            onClick={() => handleCreateProject()}
            disabled={isCreatingProject}
            className="bg-red-600 hover:bg-red-700"
          >
            {isCreatingProject ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            New Project
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant={activeTab === 'projects' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('projects')}
            className={activeTab === 'projects' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Projects ({projects.length})
          </Button>
          <Button
            variant={activeTab === 'assets' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('assets')}
            className={activeTab === 'assets' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Assets ({assets.length})
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-gray-700 focus:border-red-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Creation Quick Actions */}
      {activeTab === 'projects' && (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCreateProject('image')}
            className="border-gray-700 hover:border-red-500"
          >
            <Image className="w-4 h-4 mr-2" />
            Image
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCreateProject('video')}
            className="border-gray-700 hover:border-red-500"
          >
            <Video className="w-4 h-4 mr-2" />
            Video
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCreateProject('animation')}
            className="border-gray-700 hover:border-red-500"
          >
            <Layers className="w-4 h-4 mr-2" />
            Animation
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCreateProject('document')}
            className="border-gray-700 hover:border-red-500"
          >
            <FileText className="w-4 h-4 mr-2" />
            Document
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Content Grid */}
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
          ) : activeTab === 'projects' ? (
            filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project, index) => {
                  const IconComponent = getProjectIcon(project.type);
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Card 
                        className={`p-4 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-red-500 transition-all duration-300 cursor-pointer group ${
                          selectedProject?.id === project.id ? 'border-red-500 bg-red-500/10' : ''
                        }`}
                        onClick={() => {
                          setSelectedProject(project);
                          onProjectSelect?.(project);
                        }}
                      >
                        {/* Thumbnail */}
                        <div className="aspect-video bg-gray-900 rounded-lg mb-3 overflow-hidden relative">
                          {project.thumbnail ? (
                            <img 
                              src={project.thumbnail} 
                              alt={project.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <IconComponent className="w-8 h-8 text-gray-600" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              project.status === 'published' ? 'bg-green-500/20 text-green-400' :
                              project.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-white truncate">{project.name}</h3>
                          {project.description && (
                            <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="capitalize flex items-center">
                              <IconComponent className="w-3 h-3 mr-1" />
                              {project.type}
                            </span>
                            <span>{new Date(project.modifiedAt).toLocaleDateString()}</span>
                          </div>
                          
                          {/* Tags */}
                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 2).map((tag, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {project.tags.length > 2 && (
                                <span className="text-xs text-gray-500">+{project.tags.length - 2}</span>
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
                            className="p-1 h-auto text-red-400 hover:text-red-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.projectUrl, '_blank');
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-gray-400 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Create your first project to get started'}
                </p>
                <Button onClick={() => handleCreateProject()} className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            )
          ) : (
            /* Assets View */
            filteredAssets.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredAssets.map((asset, index) => {
                  const IconComponent = getAssetIcon(asset.type);
                  return (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Card className="p-3 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-red-500 transition-all duration-300 cursor-pointer group">
                        {/* Asset Preview */}
                        <div className="aspect-square bg-gray-900 rounded-lg mb-2 overflow-hidden">
                          {asset.type === 'image' ? (
                            <img 
                              src={asset.thumbnail} 
                              alt={asset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>

                        {/* Asset Info */}
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-white truncate">{asset.name}</h4>
                          <p className="text-xs text-gray-400 capitalize">{asset.type}</p>
                          {asset.fileSize && (
                            <p className="text-xs text-gray-500">
                              {(asset.fileSize / 1024).toFixed(1)} KB
                            </p>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No assets found</h3>
                <p className="text-gray-400 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Upload assets to your Creative Cloud library'}
                </p>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Asset
                </Button>
              </div>
            )
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
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Adobe AI Assistant</h3>
                    <p className="text-xs text-gray-400">Creative AI at your service</p>
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
                  <div className="bg-red-500/10 p-3 rounded-lg">
                    <p className="text-sm text-red-200">
                      Welcome! I can help you with Adobe Express:
                    </p>
                    <ul className="text-xs text-red-300 mt-2 space-y-1">
                      <li>• Remove backgrounds from images</li>
                      <li>• Apply professional filters and effects</li>
                      <li>• Generate creative variations</li>
                      <li>• Optimize for different platforms</li>
                    </ul>
                  </div>
                  
                  {selectedProject && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-sm text-white mb-2">
                        Selected: <span className="font-semibold">{selectedProject.name}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Wand2 className="w-3 h-3 mr-1" />
                          Enhance
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Layers className="w-3 h-3 mr-1" />
                          Add Effects
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-800">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Ask me about creative enhancements..."
                    className="flex-1 bg-gray-900 border-gray-700 text-sm"
                  />
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
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