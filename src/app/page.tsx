"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import { 
  AlertTriangle, 
  Play, 
  Radio, 
  TrendingUp, 
  Users, 
  DollarSign,
  Zap,
  Eye,
  Clock
} from "lucide-react";

interface BroadcastData {
  isLive: boolean;
  currentShow: any;
  anchor: any;
  viewerCount: number;
  emergencyOverride: boolean;
  activeAlerts: number;
  onAirContent: any[];
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  urgency: string;
  category: string;
  publishedAt: string;
}

interface Analytics {
  currentViewers: number;
  totalRevenue24h: number;
  breakdownsToday: number;
  topAnchor: string;
  engagementRate: number;
  revenueGrowth: number;
}

export default function StaticNewsHome() {
  const [broadcast, setBroadcast] = useState<BroadcastData | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [broadcastRes, newsRes, analyticsRes] = await Promise.all([
        fetch('/api/static-news/live'),
        fetch('/api/static-news/news?type=breaking&limit=5'),
        fetch('/api/static-news/analytics')
      ]);

      if (broadcastRes.ok) {
        const broadcastData = await broadcastRes.json();
        setBroadcast(broadcastData.data);
      }

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData.data);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.data);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load Static.news data');
      setLoading(false);
    }
  };

  const triggerBreakdown = async (anchorId?: string) => {
    try {
      const response = await fetch('/api/static-news/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anchorId, userId: 'demo-user' })
      });

      if (response.ok) {
        const data = await response.json();
        // For demo purposes, we'll show an alert
        alert(`Payment Intent Created! Client Secret: ${data.data.clientSecret.substr(0, 20)}...`);
        // In a real app, you'd integrate with Stripe Elements here
      }
    } catch (err) {
      console.error('Failed to trigger breakdown:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-black text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-black/50 backdrop-blur-lg border-b border-red-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-blue-600/10" />
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-500 rounded-lg flex items-center justify-center"
              >
                <Radio className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                  Static.news
                </h1>
                <p className="text-sm text-gray-300">
                  The World's First AI-Operated News Network
                </p>
              </div>
            </div>
            
            {broadcast?.isLive && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full"
              >
                <div className="w-3 h-3 bg-white rounded-full" />
                <span className="font-semibold">LIVE</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Live Broadcast Section */}
        {broadcast && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-black/50 backdrop-blur-lg border-red-500/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-400">Live Broadcast</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">{broadcast.viewerCount.toLocaleString()} viewers</span>
                  </div>
                  {broadcast.emergencyOverride && (
                    <Badge variant="destructive" className="animate-pulse">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      EMERGENCY
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-900/50 to-blue-900/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-300 mb-2">Currently On Air</h3>
                    <p className="text-xl font-bold">{broadcast.currentShow.name}</p>
                    <p className="text-gray-300">{broadcast.currentShow.description}</p>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">AI Anchor</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{broadcast.anchor.name}</p>
                        <p className="text-sm text-gray-400">{broadcast.anchor.personality}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-green-600 px-2 py-1 rounded">
                            {broadcast.anchor.currentMood}
                          </span>
                          <span className="text-xs text-gray-400">
                            {broadcast.anchor.breakdownCount} breakdowns
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => triggerBreakdown(broadcast.anchor.id)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        size="sm"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Trigger Breakdown - $4.99
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-300">On-Air Stories</h4>
                  {broadcast.onAirContent.slice(0, 3).map((story: any, index: number) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800/50 p-3 rounded border-l-4 border-red-500"
                    >
                      <h5 className="font-semibold text-sm mb-1">{story.title}</h5>
                      <p className="text-xs text-gray-400 mb-2">{story.source} • {story.category}</p>
                      <Badge variant="outline" className={`text-xs ${
                        story.urgency === 'critical' ? 'border-red-500 text-red-400' :
                        story.urgency === 'high' ? 'border-orange-500 text-orange-400' :
                        'border-gray-500 text-gray-400'
                      }`}>
                        {story.urgency}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.section>
        )}

        {/* Analytics Dashboard */}
        {analytics && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/50 backdrop-blur-lg border-blue-500/20 p-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-6">24/7 AI Operations Dashboard</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-4 rounded-lg text-center">
                  <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">${analytics.totalRevenue24h.toFixed(2)}</p>
                  <p className="text-sm text-gray-300">Revenue (24h)</p>
                  <p className="text-xs text-green-300">+{analytics.revenueGrowth}%</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-4 rounded-lg text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-400">{analytics.currentViewers}</p>
                  <p className="text-sm text-gray-300">Live Viewers</p>
                  <p className="text-xs text-blue-300">{analytics.engagementRate.toFixed(1)}% engaged</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 p-4 rounded-lg text-center">
                  <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-400">{analytics.breakdownsToday}</p>
                  <p className="text-sm text-gray-300">Breakdowns Today</p>
                  <p className="text-xs text-orange-300">Top anchor: {analytics.topAnchor}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-4 rounded-lg text-center">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-400">99.9%</p>
                  <p className="text-sm text-gray-300">Uptime</p>
                  <p className="text-xs text-purple-300">Fully Autonomous</p>
                </div>
              </div>
            </Card>
          </motion.section>
        )}

        {/* Breaking News */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/50 backdrop-blur-lg border-red-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-400">Breaking News</h2>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-red-400"
              >
                <AlertTriangle className="w-6 h-6" />
              </motion.div>
            </div>
            
            <div className="space-y-4">
              {news.slice(0, 3).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-red-500 hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{article.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{article.summary}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span>{article.category}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(article.publishedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`ml-4 ${
                        article.urgency === 'critical' ? 'border-red-500 text-red-400' :
                        article.urgency === 'high' ? 'border-orange-500 text-orange-400' :
                        'border-gray-500 text-gray-400'
                      }`}
                    >
                      {article.urgency}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-8 border-t border-gray-800"
        >
          <p className="text-gray-400 text-sm mb-2">
            Static.news - The World's First Fully AI-Operated News Network
          </p>
          <p className="text-gray-500 text-xs">
            Built by AI • Run by AI • Generating Revenue Autonomously 24/7
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
            <span>🤖 3 AI Anchors Active</span>
            <span>•</span>
            <span>📡 Live Broadcasting</span>
            <span>•</span>
            <span>💰 Revenue: ${analytics?.totalRevenue24h.toFixed(2) || '0.00'}</span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
