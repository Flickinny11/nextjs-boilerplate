"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Bot, 
  Play, 
  Pause, 
  Plus, 
  Users, 
  MessageSquare, 
  Heart, 
  Share, 
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Eye,
  Zap,
  Globe,
  Linkedin,
  Facebook,
  Twitter,
  MessageCircle,
  UserPlus,
  ThumbsUp,
  BarChart3,
  Calendar,
  MapPin,
  Building,
  Phone,
  Mail,
  ExternalLink,
  Loader2,
  RefreshCw,
  Shield,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { 
  BrowserAgentService, 
  AutomationCampaign, 
  LeadProspect, 
  Platform,
  EngagementType 
} from "@/lib/browserAgentService";

export default function FreeAutomationDashboard() {
  const [campaigns, setCampaigns] = useState<AutomationCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<AutomationCampaign | null>(null);
  const [leads, setLeads] = useState<LeadProspect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    industry: '',
    keywords: '',
    locations: 'United States',
    platforms: {
      linkedin: true,
      facebook: true,
      twitter: false,
      reddit: true,
    },
    engagementTypes: {
      commenting: true,
      liking: true,
      sharing: false,
      direct_messaging: false,
    },
    maxInteractionsPerHour: 20,
    contentThemes: '',
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const browserAgent = new BrowserAgentService();
      const campaignData = browserAgent.getCampaigns();
      setCampaigns(campaignData);
      
      if (campaignData.length > 0) {
        setSelectedCampaign(campaignData[0]);
        await loadLeads(campaignData[0].id);
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeads = async (campaignId: string) => {
    try {
      const browserAgent = new BrowserAgentService();
      const leadData = await browserAgent.getLeadProspects(campaignId);
      setLeads(leadData);
    } catch (error) {
      console.error('Failed to load leads:', error);
    }
  };

  const createCampaign = async () => {
    try {
      setIsCreating(true);
      const browserAgent = new BrowserAgentService();
      
      const platforms = Object.entries(newCampaign.platforms)
        .filter(([_, enabled]) => enabled)
        .map(([platform, _]) => platform as Platform);

      const engagementTypes = Object.entries(newCampaign.engagementTypes)
        .filter(([_, enabled]) => enabled)
        .map(([type, _]) => type as EngagementType);

      const campaign = await browserAgent.createCampaign({
        platforms,
        targetAudience: {
          industry: newCampaign.industry,
          keywords: newCampaign.keywords.split('\n').filter(k => k.trim()),
          locations: [newCampaign.locations],
        },
        contentStrategy: {
          engagementType: engagementTypes,
          contentThemes: newCampaign.contentThemes.split('\n').filter(t => t.trim()),
          postingFrequency: 'daily',
          engagementRate: newCampaign.maxInteractionsPerHour,
        },
        compliance: {
          respectRateLimits: true,
          followTermsOfService: true,
          humanLikeInteractions: true,
          maxInteractionsPerHour: newCampaign.maxInteractionsPerHour,
        },
      });

      setCampaigns(prev => [...prev, campaign]);
      setSelectedCampaign(campaign);
      setShowCreateForm(false);
      
      // Start the campaign
      await browserAgent.startAutomation(campaign.id);
      
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleCampaign = async (campaignId: string, start: boolean) => {
    try {
      const browserAgent = new BrowserAgentService();
      if (start) {
        await browserAgent.startAutomation(campaignId);
      } else {
        await browserAgent.pauseAutomation(campaignId);
      }
      
      // Update local state
      setCampaigns(prev => prev.map(c => 
        c.id === campaignId 
          ? { ...c, status: start ? 'active' : 'paused' as const }
          : c
      ));
    } catch (error) {
      console.error('Failed to toggle campaign:', error);
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'reddit': return <MessageCircle className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getEngagementIcon = (type: string) => {
    switch (type) {
      case 'commenting': return <MessageSquare className="w-4 h-4" />;
      case 'liking': return <ThumbsUp className="w-4 h-4" />;
      case 'sharing': return <Share className="w-4 h-4" />;
      case 'following': return <UserPlus className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getInterestLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/marketing/advanced" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
              Free Marketing Automation
            </h1>
            <p className="text-gray-400">AI-powered browser agents for organic lead generation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadCampaigns()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Zero-Cost Lead Generation</h2>
            <p className="text-gray-300 mb-4">
              Our AI agents automatically engage with prospects across social platforms, 
              identify buying signals, and gather contact information - all without spending a penny on ads.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Bot className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-gray-300">100% Automated</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-300">Ethical & Compliant</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-gray-300">24/7 Active</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Bot className="w-20 h-20 text-blue-500 animate-pulse" />
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading automation campaigns...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Campaign List */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
              <h2 className="font-semibold text-white mb-4">Active Campaigns</h2>
              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No campaigns yet</p>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedCampaign?.id === campaign.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        loadLeads(campaign.id);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm">{campaign.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={campaign.status === 'active' ? 'default' : 'secondary'}
                            className={campaign.status === 'active' ? 'bg-green-500' : ''}
                          >
                            {campaign.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCampaign(campaign.id, campaign.status !== 'active');
                            }}
                            className="p-1 h-6 w-6"
                          >
                            {campaign.status === 'active' ? (
                              <Pause className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {campaign.config.platforms.slice(0, 3).map((platform) => (
                          <div key={platform} className="text-gray-400">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatNumber(campaign.analytics.leadsIdentified)} leads • {formatNumber(campaign.analytics.engagementsGenerated)} engagements
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCampaign ? (
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid grid-cols-4 bg-black/50 backdrop-blur-lg border border-gray-800">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="leads">Leads</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Analytics Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Tasks Completed</p>
                          <p className="text-xl font-bold text-white">
                            {formatNumber(selectedCampaign.analytics.tasksCompleted)}
                          </p>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </div>
                    </Card>

                    <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Engagements</p>
                          <p className="text-xl font-bold text-white">
                            {formatNumber(selectedCampaign.analytics.engagementsGenerated)}
                          </p>
                        </div>
                        <Heart className="w-8 h-8 text-pink-500" />
                      </div>
                    </Card>

                    <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Leads Found</p>
                          <p className="text-xl font-bold text-white">
                            {formatNumber(selectedCampaign.analytics.leadsIdentified)}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                      </div>
                    </Card>

                    <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Contacts</p>
                          <p className="text-xl font-bold text-white">
                            {formatNumber(selectedCampaign.analytics.contactsGathered)}
                          </p>
                        </div>
                        <Phone className="w-8 h-8 text-purple-500" />
                      </div>
                    </Card>
                  </div>

                  {/* Platform Breakdown */}
                  <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                    <h3 className="font-semibold text-white mb-4">Platform Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedCampaign.config.platforms.map((platform) => (
                        <div key={platform} className="p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            {getPlatformIcon(platform)}
                            <span className="font-semibold text-white capitalize">{platform}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Tasks:</span>
                              <span className="text-white">{Math.floor(selectedCampaign.analytics.tasksCompleted * Math.random())}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Engagements:</span>
                              <span className="text-white">{Math.floor(selectedCampaign.analytics.engagementsGenerated * Math.random())}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Leads:</span>
                              <span className="text-white">{Math.floor(selectedCampaign.analytics.leadsIdentified * Math.random())}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                    <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { action: 'Commented', platform: 'linkedin', target: 'Commercial roofing discussion', time: '5 minutes ago' },
                        { action: 'Liked', platform: 'facebook', target: 'Building maintenance post', time: '12 minutes ago' },
                        { action: 'Commented', platform: 'reddit', target: 'r/commercialrealestate post', time: '28 minutes ago' },
                        { action: 'Connected', platform: 'linkedin', target: 'Facilities Manager profile', time: '1 hour ago' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getPlatformIcon(activity.platform as Platform)}
                            <div>
                              <div className="text-white text-sm">{activity.action} on {activity.target}</div>
                              <div className="text-xs text-gray-400">{activity.time}</div>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="leads" className="space-y-6">
                  <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-white">Discovered Leads</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                    
                    {leads.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No leads discovered yet</p>
                        <p className="text-sm text-gray-500">Leads will appear here as our AI agents find prospects</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {leads.map((lead) => (
                          <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                    {lead.profile.name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-white">{lead.profile.name || 'Unknown'}</h4>
                                    <p className="text-sm text-gray-400">{lead.profile.title} at {lead.profile.company}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                  <div>
                                    <div className="flex items-center space-x-2 text-sm">
                                      <MapPin className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-300">{lead.profile.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm mt-1">
                                      {getPlatformIcon(lead.platform)}
                                      <span className="text-gray-300 capitalize">{lead.platform}</span>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm text-gray-400 mb-1">Buying Signals:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {lead.engagement.buying_signals.map((signal, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {signal}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end space-y-2">
                                <Badge className={`text-xs ${getInterestLevelColor(lead.engagement.interest_level)}`}>
                                  {lead.engagement.interest_level} interest
                                </Badge>
                                <div className="flex space-x-2">
                                  {lead.profile.email && (
                                    <Button size="sm" variant="outline">
                                      <Mail className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {lead.profile.phone && (
                                    <Button size="sm" variant="outline">
                                      <Phone className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {lead.profile.linkedin && (
                                    <Button size="sm" variant="outline">
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-700">
                              <div className="text-sm text-gray-400">
                                <span className="font-semibold">Source:</span> {lead.engagement.source}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Discovered {new Date(lead.discovered).toLocaleDateString()}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="activity">
                  <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                    <h3 className="font-semibold text-white mb-4">Task Activity Log</h3>
                    <p className="text-gray-400">Detailed task execution log would be implemented here</p>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                    <h3 className="font-semibold text-white mb-4">Campaign Settings</h3>
                    <p className="text-gray-400">Campaign configuration options would be implemented here</p>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800 text-center">
                <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Select a Campaign</h3>
                <p className="text-gray-400 mb-6">Choose a campaign from the sidebar to view automation details</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-6 bg-black/90 backdrop-blur-lg border-gray-800">
                <h2 className="text-xl font-bold text-white mb-6">Create Free Automation Campaign</h2>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="industry" className="text-white">Industry/Business Type</Label>
                    <Input
                      id="industry"
                      value={newCampaign.industry}
                      onChange={(e) => setNewCampaign({...newCampaign, industry: e.target.value})}
                      placeholder="e.g., commercial roofing, HVAC, plumbing"
                      className="mt-2 bg-gray-900 border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="text-white">Target Keywords (one per line)</Label>
                    <Textarea
                      id="keywords"
                      value={newCampaign.keywords}
                      onChange={(e) => setNewCampaign({...newCampaign, keywords: e.target.value})}
                      placeholder="roof repair&#10;building maintenance&#10;facility management"
                      rows={4}
                      className="mt-2 bg-gray-900 border-gray-700"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Target Platforms</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(newCampaign.platforms).map(([platform, enabled]) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => 
                              setNewCampaign({
                                ...newCampaign, 
                                platforms: {...newCampaign.platforms, [platform]: checked}
                              })
                            }
                          />
                          <div className="flex items-center space-x-2">
                            {getPlatformIcon(platform as Platform)}
                            <span className="text-white capitalize">{platform}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Engagement Types</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(newCampaign.engagementTypes).map(([type, enabled]) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => 
                              setNewCampaign({
                                ...newCampaign, 
                                engagementTypes: {...newCampaign.engagementTypes, [type]: checked}
                              })
                            }
                          />
                          <div className="flex items-center space-x-2">
                            {getEngagementIcon(type)}
                            <span className="text-white capitalize">{type.replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interactions" className="text-white">Max Interactions Per Hour</Label>
                    <Input
                      id="interactions"
                      type="number"
                      value={newCampaign.maxInteractionsPerHour}
                      onChange={(e) => setNewCampaign({...newCampaign, maxInteractionsPerHour: Number(e.target.value)})}
                      min={1}
                      max={50}
                      className="mt-2 bg-gray-900 border-gray-700"
                    />
                    <p className="text-xs text-gray-400 mt-1">Recommended: 15-25 for best results</p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createCampaign}
                      disabled={isCreating || !newCampaign.industry}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4 mr-2" />
                          Start Automation
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}