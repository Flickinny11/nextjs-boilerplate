import { AnalyticsData, RevenueEvent } from './types';

export class AnalyticsSystem {
  private analyticsHistory: AnalyticsData[];
  private revenueEvents: RevenueEvent[];
  private currentMetrics!: AnalyticsData;
  private isTracking: boolean;

  constructor() {
    this.analyticsHistory = [];
    this.revenueEvents = [];
    this.isTracking = false;
    this.initializeMetrics();
    this.startTracking();
  }

  private initializeMetrics(): void {
    this.currentMetrics = {
      timestamp: new Date(),
      viewerCount: 0,
      engagement: 0,
      revenueGenerated: 0,
      breakdownTriggers: 0,
      anchorPerformance: {
        'ray-mcpatriot': {
          airTime: 0,
          breakdowns: 0,
          viewerRating: 7.2
        },
        'berkeley-justice': {
          airTime: 0,
          breakdowns: 0,
          viewerRating: 8.5
        },
        'switz-middleton': {
          airTime: 0,
          breakdowns: 0,
          viewerRating: 9.1
        }
      }
    };
  }

  private startTracking(): void {
    this.isTracking = true;
    
    // Record metrics every minute
    setInterval(() => {
      this.recordCurrentMetrics();
    }, 60000);

    // Simulate real-time metric updates
    setInterval(() => {
      this.updateRealTimeMetrics();
    }, 5000); // Every 5 seconds
  }

  private recordCurrentMetrics(): void {
    if (!this.isTracking) return;

    const snapshot: AnalyticsData = {
      ...this.currentMetrics,
      timestamp: new Date()
    };

    this.analyticsHistory.push(snapshot);

    // Keep only last 24 hours of data
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.analyticsHistory = this.analyticsHistory.filter(
      record => record.timestamp > oneDayAgo
    );
  }

  private updateRealTimeMetrics(): void {
    // Simulate viewer count fluctuations
    const baseViewers = 150;
    const timeOfDay = new Date().getHours();
    
    let multiplier = 1;
    if (timeOfDay >= 6 && timeOfDay <= 9) multiplier = 2.2; // Morning
    else if (timeOfDay >= 12 && timeOfDay <= 14) multiplier = 1.6; // Lunch
    else if (timeOfDay >= 18 && timeOfDay <= 22) multiplier = 2.8; // Evening
    else if (timeOfDay >= 23 || timeOfDay <= 1) multiplier = 1.1; // Late night

    const variance = 0.85 + (Math.random() * 0.3); // ±15% variance
    this.currentMetrics.viewerCount = Math.floor(
      baseViewers * multiplier * variance + Math.random() * 40
    );

    // Calculate engagement based on viewer activity
    this.currentMetrics.engagement = Math.min(100, 
      (this.currentMetrics.viewerCount / 500) * 100 + Math.random() * 20
    );

    // Update timestamp
    this.currentMetrics.timestamp = new Date();
  }

  recordBreakdownTrigger(anchorId: string, userId?: string): RevenueEvent {
    const amount = parseFloat(process.env.BREAKDOWN_PRICE || '4.99');
    
    const revenueEvent: RevenueEvent = {
      id: `breakdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'breakdown_trigger',
      amount: amount,
      timestamp: new Date(),
      anchorId: anchorId,
      userId: userId,
      description: `Breakdown trigger payment for ${anchorId}`
    };

    this.revenueEvents.push(revenueEvent);
    this.currentMetrics.revenueGenerated += amount;
    this.currentMetrics.breakdownTriggers += 1;

    // Update anchor performance
    if (this.currentMetrics.anchorPerformance[anchorId]) {
      this.currentMetrics.anchorPerformance[anchorId].breakdowns += 1;
    }

    console.log(`💰 Revenue Event: $${amount} from breakdown trigger (${anchorId})`);
    
    return revenueEvent;
  }

  recordPremiumFeature(featureName: string, amount: number, userId?: string): RevenueEvent {
    const revenueEvent: RevenueEvent = {
      id: `premium-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'premium_feature',
      amount: amount,
      timestamp: new Date(),
      userId: userId,
      description: `Premium feature: ${featureName}`
    };

    this.revenueEvents.push(revenueEvent);
    this.currentMetrics.revenueGenerated += amount;

    console.log(`💰 Revenue Event: $${amount} from premium feature (${featureName})`);
    
    return revenueEvent;
  }

  recordSponsorRevenue(sponsorName: string, amount: number): RevenueEvent {
    const revenueEvent: RevenueEvent = {
      id: `sponsor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'sponsor_revenue',
      amount: amount,
      timestamp: new Date(),
      description: `Sponsor revenue from ${sponsorName}`
    };

    this.revenueEvents.push(revenueEvent);
    this.currentMetrics.revenueGenerated += amount;

    console.log(`💰 Revenue Event: $${amount} from sponsor (${sponsorName})`);
    
    return revenueEvent;
  }

  updateAnchorAirTime(anchorId: string, minutes: number): void {
    if (this.currentMetrics.anchorPerformance[anchorId]) {
      this.currentMetrics.anchorPerformance[anchorId].airTime += minutes;
    }
  }

  getCurrentMetrics(): AnalyticsData {
    return { ...this.currentMetrics };
  }

  getMetricsHistory(hours: number = 24): AnalyticsData[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.analyticsHistory.filter(record => record.timestamp > cutoff);
  }

  getRevenueHistory(hours: number = 24): RevenueEvent[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.revenueEvents.filter(event => event.timestamp > cutoff);
  }

  getTotalRevenue(hours: number = 24): number {
    const recentEvents = this.getRevenueHistory(hours);
    return recentEvents.reduce((total, event) => total + event.amount, 0);
  }

  getRevenueByType(hours: number = 24): { [key: string]: number } {
    const recentEvents = this.getRevenueHistory(hours);
    const breakdown = {
      breakdown_trigger: 0,
      premium_feature: 0,
      sponsor_revenue: 0
    };

    recentEvents.forEach(event => {
      breakdown[event.type] = (breakdown[event.type] || 0) + event.amount;
    });

    return breakdown;
  }

  getTopPerformingAnchor(): { anchorId: string; rating: number; breakdowns: number } {
    const anchors = Object.entries(this.currentMetrics.anchorPerformance)
      .map(([id, performance]) => ({
        anchorId: id,
        rating: performance.viewerRating,
        breakdowns: performance.breakdowns
      }))
      .sort((a, b) => b.rating - a.rating);

    return anchors[0] || { anchorId: 'unknown', rating: 0, breakdowns: 0 };
  }

  getBreakdownStats(): {
    total: number;
    byAnchor: { [anchorId: string]: number };
    revenue: number;
  } {
    const breakdownEvents = this.revenueEvents.filter(event => 
      event.type === 'breakdown_trigger'
    );

    const byAnchor: { [anchorId: string]: number } = {};
    breakdownEvents.forEach(event => {
      if (event.anchorId) {
        byAnchor[event.anchorId] = (byAnchor[event.anchorId] || 0) + 1;
      }
    });

    return {
      total: breakdownEvents.length,
      byAnchor: byAnchor,
      revenue: breakdownEvents.reduce((sum, event) => sum + event.amount, 0)
    };
  }

  getViewerTrends(hours: number = 24): Array<{ time: Date; viewers: number }> {
    const history = this.getMetricsHistory(hours);
    return history.map(record => ({
      time: record.timestamp,
      viewers: record.viewerCount
    }));
  }

  getEngagementTrends(hours: number = 24): Array<{ time: Date; engagement: number }> {
    const history = this.getMetricsHistory(hours);
    return history.map(record => ({
      time: record.timestamp,
      engagement: record.engagement
    }));
  }

  getRevenueTrends(hours: number = 24): Array<{ time: Date; revenue: number }> {
    const events = this.getRevenueHistory(hours);
    const hourlyRevenue: { [hour: string]: number } = {};

    events.forEach(event => {
      const hour = new Date(event.timestamp).toISOString().substr(0, 13); // YYYY-MM-DDTHH
      hourlyRevenue[hour] = (hourlyRevenue[hour] || 0) + event.amount;
    });

    return Object.entries(hourlyRevenue)
      .map(([hour, revenue]) => ({
        time: new Date(hour + ':00:00.000Z'),
        revenue
      }))
      .sort((a, b) => a.time.getTime() - b.time.getTime());
  }

  getDashboardSummary(): {
    currentViewers: number;
    totalRevenue24h: number;
    breakdownsToday: number;
    topAnchor: string;
    engagementRate: number;
    revenueGrowth: number;
  } {
    const revenue24h = this.getTotalRevenue(24);
    const revenue48h = this.getTotalRevenue(48);
    const breakdownStats = this.getBreakdownStats();
    const topAnchor = this.getTopPerformingAnchor();

    const revenueGrowth = revenue48h > 0 
      ? ((revenue24h - (revenue48h - revenue24h)) / (revenue48h - revenue24h)) * 100
      : 0;

    return {
      currentViewers: this.currentMetrics.viewerCount,
      totalRevenue24h: revenue24h,
      breakdownsToday: breakdownStats.total,
      topAnchor: topAnchor.anchorId,
      engagementRate: this.currentMetrics.engagement,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100
    };
  }

  simulateBreakdownPurchase(anchorId: string): RevenueEvent {
    // Simulate someone purchasing a breakdown trigger
    return this.recordBreakdownTrigger(anchorId, `user-${Math.random().toString(36).substr(2, 9)}`);
  }

  exportAnalytics(format: 'json' | 'csv' = 'json'): string {
    const data = {
      currentMetrics: this.currentMetrics,
      history: this.analyticsHistory,
      revenue: this.revenueEvents,
      summary: this.getDashboardSummary()
    };

    if (format === 'csv') {
      // Simple CSV export for metrics
      let csv = 'timestamp,viewers,engagement,revenue\n';
      this.analyticsHistory.forEach(record => {
        csv += `${record.timestamp.toISOString()},${record.viewerCount},${record.engagement},${record.revenueGenerated}\n`;
      });
      return csv;
    }

    return JSON.stringify(data, null, 2);
  }

  stop(): void {
    this.isTracking = false;
    console.log('📊 Analytics tracking stopped');
  }
}