"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Eye, 
  MousePointer, 
  Download, 
  RefreshCw, 
  Zap,
  Globe,
  Linkedin,
  Facebook,
  Twitter,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Award,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function AdvancedAnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("30d");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (isLoading) {
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
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400">Loading performance data...</p>
          </div>
        </div>
        
        <div className="text-center py-16">
          <BarChart3 className="w-8 h-8 animate-pulse text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400">Analyzing campaign performance...</p>
        </div>
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
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
              Advanced Analytics Dashboard
            </h1>
            <p className="text-gray-400">Comprehensive marketing performance insights</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Spend</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(4750.50)}
              </p>
              <p className="text-xs text-green-500">+12.5% vs last period</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Leads</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(127)}
              </p>
              <p className="text-xs text-green-500">+24.3% vs last period</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Average ROI</p>
              <p className="text-2xl font-bold text-white">340%</p>
              <p className="text-xs text-green-500">+8.7% vs last period</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Cost Per Lead</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(37.40)}
              </p>
              <p className="text-xs text-red-500">+5.2% vs last period</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 bg-black/50 backdrop-blur-lg border border-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Chart Placeholder */}
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <h3 className="font-semibold text-white mb-4">Performance Trends</h3>
            <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Interactive charts would be implemented here</p>
                <p className="text-sm text-gray-500">Using libraries like Chart.js or Recharts</p>
              </div>
            </div>
          </Card>

          {/* Traffic Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Impressions</h3>
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                {formatNumber(245000)}
              </p>
              <p className="text-sm text-gray-400">Total reach across all platforms</p>
            </Card>

            <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Clicks</h3>
                <MousePointer className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                {formatNumber(8940)}
              </p>
              <p className="text-sm text-gray-400">CTR: 3.6%</p>
            </Card>

            <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Conversions</h3>
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                {formatNumber(127)}
              </p>
              <p className="text-sm text-gray-400">Rate: 1.4%</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <h3 className="font-semibold text-white">Google Ads</h3>
                </div>
                <Badge variant="default">Paid</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Spend</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(2850.30)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Leads</p>
                  <p className="text-lg font-bold text-white">45</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">ROI</p>
                  <p className="text-lg font-bold text-green-500">380%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">CTR</p>
                  <p className="text-lg font-bold text-white">3.6%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-4 h-4" />
                  <h3 className="font-semibold text-white">LinkedIn</h3>
                </div>
                <Badge variant="secondary">Free</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Spend</p>
                  <p className="text-lg font-bold text-white">Free</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Leads</p>
                  <p className="text-lg font-bold text-white">32</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">ROI</p>
                  <p className="text-lg font-bold text-green-500">∞</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">CTR</p>
                  <p className="text-lg font-bold text-white">2.5%</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <h3 className="font-semibold text-white mb-4">Top Performing Campaigns</h3>
            <div className="space-y-4">
              {[
                { name: 'Commercial Roofing - Google Ads', type: 'paid', platform: 'Google Ads', roi: 420, leads: 45, spend: 2850.30 },
                { name: 'LinkedIn Automation - B2B', type: 'free', platform: 'LinkedIn', roi: 9999, leads: 32, spend: 0 },
                { name: 'Facebook Local Business', type: 'paid', platform: 'Facebook', roi: 250, leads: 28, spend: 1200.20 },
              ].map((campaign, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{campaign.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Badge variant={campaign.type === 'paid' ? 'default' : 'secondary'}>
                          {campaign.type}
                        </Badge>
                        <span>•</span>
                        <span>{campaign.platform}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-500">
                      {campaign.roi === 9999 ? '∞' : `${campaign.roi}%`} ROI
                    </div>
                    <div className="text-sm text-gray-400">
                      {campaign.leads} leads • {campaign.spend > 0 ? formatCurrency(campaign.spend) : 'Free'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <h3 className="font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              AI-Powered Insights
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-400">Optimization Opportunity</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      LinkedIn automation is outperforming paid channels with infinite ROI. 
                      Consider increasing engagement frequency from 15 to 25 interactions per hour.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-400">Budget Recommendation</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      Google Ads keyword "commercial roof repair" has 420% ROI. 
                      Recommend increasing daily budget by 40% to capture more high-intent traffic.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-400">Content Performance</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      Comments about "commercial roofing trends" generate 3x more leads than general industry posts. 
                      Focus content strategy on trend analysis and market insights.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-purple-400">Timing Optimization</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      Best engagement times: Tuesday-Thursday 9-11 AM and 2-4 PM EST. 
                      Schedule automation tasks during these peak periods for 25% better results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Predictive Analytics */}
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <h3 className="font-semibold text-white mb-4">Predictive Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <h4 className="font-semibold text-white mb-2">Next 30 Days</h4>
                <p className="text-2xl font-bold text-green-500">+47 leads</p>
                <p className="text-sm text-gray-400">Projected based on current trends</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <h4 className="font-semibold text-white mb-2">ROI Forecast</h4>
                <p className="text-2xl font-bold text-blue-500">+15%</p>
                <p className="text-sm text-gray-400">Expected improvement</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <h4 className="font-semibold text-white mb-2">Cost Savings</h4>
                <p className="text-2xl font-bold text-purple-500">$1,250</p>
                <p className="text-sm text-gray-400">From free automation</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}