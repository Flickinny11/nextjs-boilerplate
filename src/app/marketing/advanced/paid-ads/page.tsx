"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Pause, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Target,
  Eye,
  MousePointer,
  Users,
  Settings,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { GoogleAdsService, GoogleAdsCampaign, CampaignPerformance } from "@/lib/googleAdsService";

export default function PaidAdvertisingDashboard() {
  const [campaigns, setCampaigns] = useState<GoogleAdsCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<GoogleAdsCampaign | null>(null);
  const [performance, setPerformance] = useState<CampaignPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Campaign creation form state
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    budget: 100,
    strategy: 'TARGET_CPA',
    targetCpa: 50,
    locations: ['United States'],
    keywords: '',
    headlines: '',
    descriptions: '',
    finalUrl: ''
  });

  useEffect(() => {
    checkConfiguration();
    if (GoogleAdsService.isConfigured()) {
      loadCampaigns();
    }
  }, []);

  const checkConfiguration = () => {
    const configured = GoogleAdsService.isConfigured();
    setIsConfigured(configured);
    setIsLoading(false);
  };

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const googleAdsService = new GoogleAdsService();
      const campaignData = await googleAdsService.getCampaigns();
      setCampaigns(campaignData);
      
      if (campaignData.length > 0) {
        setSelectedCampaign(campaignData[0]);
        await loadPerformance(campaignData[0].id);
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPerformance = async (campaignId: string) => {
    try {
      const googleAdsService = new GoogleAdsService();
      const performanceData = await googleAdsService.getCampaignPerformance(
        campaignId,
        {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        }
      );
      setPerformance(performanceData);
    } catch (error) {
      console.error('Failed to load performance:', error);
    }
  };

  const createCampaign = async () => {
    try {
      setIsCreating(true);
      const googleAdsService = new GoogleAdsService();
      
      const campaignRequest = {
        name: newCampaign.name,
        budget: {
          daily: newCampaign.budget,
          currency: 'USD'
        },
        bidding: {
          strategy: newCampaign.strategy,
          targetCpa: newCampaign.targetCpa
        },
        targeting: {
          locations: newCampaign.locations,
          languages: ['English'],
          keywords: newCampaign.keywords.split('\n').filter(k => k.trim()),
        },
        ads: [{
          headlines: newCampaign.headlines.split('\n').filter(h => h.trim()),
          descriptions: newCampaign.descriptions.split('\n').filter(d => d.trim()),
          finalUrls: [newCampaign.finalUrl]
        }]
      };

      const campaign = await googleAdsService.createCampaign(campaignRequest);
      setCampaigns(prev => [...prev, campaign]);
      setShowCreateForm(false);
      
      // Reset form
      setNewCampaign({
        name: '',
        budget: 100,
        strategy: 'TARGET_CPA',
        targetCpa: 50,
        locations: ['United States'],
        keywords: '',
        headlines: '',
        descriptions: '',
        finalUrl: ''
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (!isConfigured) {
    const setupInfo = GoogleAdsService.getSetupInstructions();
    
    return (
      <div className="container mx-auto px-4 py-8 mt-8">
        <div className="flex items-center mb-8">
          <Link href="/marketing/advanced" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              Google Ads Integration
            </h1>
            <p className="text-gray-400">Setup required to create paid advertising campaigns</p>
          </div>
        </div>

        <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Google Ads API Setup Required</h2>
            <p className="text-gray-400 mb-6">
              To use paid advertising features, you need to configure Google Ads API credentials.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Missing Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {setupInfo.missingKeys.map((key) => (
                  <div key={key} className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-300 font-mono text-sm">{key}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Setup Instructions</h3>
              <div className="space-y-3">
                {setupInfo.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-300">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Need Help?</h4>
                  <p className="text-sm text-gray-400">Our team can help you set up Google Ads API integration</p>
                </div>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              Paid Advertising Dashboard
            </h1>
            <p className="text-gray-400">Manage your Google Ads campaigns with AI optimization</p>
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
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading campaigns...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Campaign List */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
              <h2 className="font-semibold text-white mb-4">Active Campaigns</h2>
              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No campaigns yet</p>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        loadPerformance(campaign.id);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm">{campaign.name}</h3>
                        <Badge 
                          variant={campaign.status === 'ENABLED' ? 'default' : 'secondary'}
                          className={campaign.status === 'ENABLED' ? 'bg-green-500' : ''}
                        >
                          {campaign.status === 'ENABLED' ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">
                        Budget: {formatCurrency(campaign.budget.daily)}/day
                      </div>
                      <div className="text-xs text-gray-400">
                        Strategy: {campaign.bidding.strategy.replace('_', ' ')}
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
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="ads">Ads</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Performance Metrics */}
                  {performance && (
                    <>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Impressions</p>
                              <p className="text-xl font-bold text-white">
                                {performance.metrics.impressions.toLocaleString()}
                              </p>
                            </div>
                            <Eye className="w-8 h-8 text-blue-500" />
                          </div>
                        </Card>

                        <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Clicks</p>
                              <p className="text-xl font-bold text-white">
                                {performance.metrics.clicks.toLocaleString()}
                              </p>
                              <p className="text-xs text-green-500">
                                CTR: {formatPercent(performance.metrics.ctr)}
                              </p>
                            </div>
                            <MousePointer className="w-8 h-8 text-green-500" />
                          </div>
                        </Card>

                        <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Cost</p>
                              <p className="text-xl font-bold text-white">
                                {formatCurrency(performance.metrics.cost)}
                              </p>
                              <p className="text-xs text-gray-400">
                                CPC: {formatCurrency(performance.metrics.cpc)}
                              </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-yellow-500" />
                          </div>
                        </Card>

                        <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Conversions</p>
                              <p className="text-xl font-bold text-white">
                                {performance.metrics.conversions}
                              </p>
                              <p className="text-xs text-purple-500">
                                Rate: {formatPercent(performance.metrics.conversionRate)}
                              </p>
                            </div>
                            <Users className="w-8 h-8 text-purple-500" />
                          </div>
                        </Card>
                      </div>

                      {/* Top Performing Keywords */}
                      <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                        <h3 className="font-semibold text-white mb-4">Top Performing Keywords</h3>
                        <div className="space-y-3">
                          {performance.topKeywords.map((keyword) => (
                            <div key={keyword.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                              <div>
                                <div className="font-semibold text-white">{keyword.text}</div>
                                <div className="text-xs text-gray-400">
                                  {keyword.matchType} • Quality Score: {keyword.qualityScore}/10
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-green-500">
                                  {keyword.conversions} conversions
                                </div>
                                <div className="text-xs text-gray-400">
                                  {formatCurrency(keyword.cost)} • CTR: {formatPercent((keyword.clicks / keyword.impressions) * 100)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* AI Recommendations */}
                      <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                        <h3 className="font-semibold text-white mb-4 flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                          AI Optimization Recommendations
                        </h3>
                        <div className="space-y-3">
                          {performance.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                              <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                              <div>
                                <p className="text-white">{recommendation}</p>
                                <Button size="sm" className="mt-2 bg-yellow-600 hover:bg-yellow-700">
                                  Apply Optimization
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="keywords">
                  <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                    <h3 className="font-semibold text-white mb-4">Keyword Management</h3>
                    <p className="text-gray-400">Keyword management interface would be implemented here</p>
                  </Card>
                </TabsContent>

                <TabsContent value="ads">
                  <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                    <h3 className="font-semibold text-white mb-4">Ad Management</h3>
                    <p className="text-gray-400">Ad creation and management interface would be implemented here</p>
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
                <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Select a Campaign</h3>
                <p className="text-gray-400 mb-6">Choose a campaign from the sidebar to view performance details</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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
                <h2 className="text-xl font-bold text-white mb-6">Create New Campaign</h2>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="campaign-name" className="text-white">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      placeholder="e.g., Commercial Roofing - Local Campaign"
                      className="mt-2 bg-gray-900 border-gray-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget" className="text-white">Daily Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newCampaign.budget}
                        onChange={(e) => setNewCampaign({...newCampaign, budget: Number(e.target.value)})}
                        className="mt-2 bg-gray-900 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="target-cpa" className="text-white">Target CPA ($)</Label>
                      <Input
                        id="target-cpa"
                        type="number"
                        value={newCampaign.targetCpa}
                        onChange={(e) => setNewCampaign({...newCampaign, targetCpa: Number(e.target.value)})}
                        className="mt-2 bg-gray-900 border-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="text-white">Keywords (one per line)</Label>
                    <Textarea
                      id="keywords"
                      value={newCampaign.keywords}
                      onChange={(e) => setNewCampaign({...newCampaign, keywords: e.target.value})}
                      placeholder="commercial roof repair&#10;roof coating services&#10;commercial roofing contractor"
                      rows={4}
                      className="mt-2 bg-gray-900 border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="headlines" className="text-white">Ad Headlines (one per line)</Label>
                    <Textarea
                      id="headlines"
                      value={newCampaign.headlines}
                      onChange={(e) => setNewCampaign({...newCampaign, headlines: e.target.value})}
                      placeholder="Professional Commercial Roofing&#10;Licensed & Insured Contractors&#10;Free Roof Inspections"
                      rows={3}
                      className="mt-2 bg-gray-900 border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="descriptions" className="text-white">Ad Descriptions (one per line)</Label>
                    <Textarea
                      id="descriptions"
                      value={newCampaign.descriptions}
                      onChange={(e) => setNewCampaign({...newCampaign, descriptions: e.target.value})}
                      placeholder="Expert commercial roofing services. Free estimates, competitive pricing.&#10;Trusted by local businesses. 24/7 emergency service available."
                      rows={2}
                      className="mt-2 bg-gray-900 border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="final-url" className="text-white">Landing Page URL</Label>
                    <Input
                      id="final-url"
                      value={newCampaign.finalUrl}
                      onChange={(e) => setNewCampaign({...newCampaign, finalUrl: e.target.value})}
                      placeholder="https://yourwebsite.com/commercial-roofing"
                      className="mt-2 bg-gray-900 border-gray-700"
                    />
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
                      disabled={isCreating || !newCampaign.name || !newCampaign.finalUrl}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Campaign
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