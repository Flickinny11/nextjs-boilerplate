import { BroadcastState, NewsArticle, EmergencyAlert, AnalyticsData } from './types';
import { NewsAggregator } from './news_aggregator';
import { ProgrammingSchedule } from './programming_schedule';
import { AnchorPersonalitySystem } from './anchor_personalities';
import { EmergencyBroadcastSystem } from './emergency_system';
import { LiveBroadcastSystem } from './live_broadcast_system';
import { AnalyticsSystem } from './analytics_system';
import { NotificationSystem } from './notification_system';

export class StaticNewsSystem {
  // Core Systems
  private newsAggregator: NewsAggregator;
  private schedule: ProgrammingSchedule;
  private anchorSystem: AnchorPersonalitySystem;
  private emergencySystem: EmergencyBroadcastSystem;
  private broadcastSystem: LiveBroadcastSystem;
  private analytics: AnalyticsSystem;
  private notifications: NotificationSystem;

  // System State
  private isRunning: boolean;
  private lastHealthCheck: Date;
  private systemHealth: {
    news: boolean;
    schedule: boolean;
    anchors: boolean;
    emergency: boolean;
    broadcast: boolean;
    analytics: boolean;
    notifications: boolean;
  };

  constructor() {
    this.isRunning = false;
    this.lastHealthCheck = new Date();
    
    console.log('🚀 Initializing Static.news AI News Network...');
    
    // Initialize all systems
    this.newsAggregator = new NewsAggregator();
    this.schedule = new ProgrammingSchedule();
    this.anchorSystem = new AnchorPersonalitySystem();
    this.emergencySystem = new EmergencyBroadcastSystem();
    this.broadcastSystem = new LiveBroadcastSystem();
    this.analytics = new AnalyticsSystem();
    this.notifications = new NotificationSystem();

    this.systemHealth = {
      news: true,
      schedule: true,
      anchors: true,
      emergency: true,
      broadcast: true,
      analytics: true,
      notifications: true
    };

    this.startSystem();
  }

  private startSystem(): void {
    this.isRunning = true;
    
    // System health monitoring
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute

    // Auto-recovery checks
    setInterval(() => {
      this.performAutoRecovery();
    }, 300000); // Every 5 minutes

    // Simulate some initial activity
    this.simulateInitialActivity();

    console.log('📺 Static.news is now LIVE and autonomous! 🎉');
    console.log('🤖 AI anchors are ready for 24/7 operation');
    console.log('💰 Revenue generation system active');
  }

  private async performHealthCheck(): Promise<void> {
    this.lastHealthCheck = new Date();

    try {
      // Check news aggregation
      this.systemHealth.news = await this.testNewsAggregation();
      
      // Check scheduling
      this.systemHealth.schedule = this.testScheduling();
      
      // Check anchors
      this.systemHealth.anchors = this.testAnchors();
      
      // Check emergency system
      this.systemHealth.emergency = this.testEmergencySystem();
      
      // Check broadcast
      this.systemHealth.broadcast = this.testBroadcast();
      
      // Check analytics
      this.systemHealth.analytics = this.testAnalytics();
      
      // Check notifications
      this.systemHealth.notifications = this.testNotifications();

      const healthyCount = Object.values(this.systemHealth).filter(Boolean).length;
      const totalSystems = Object.keys(this.systemHealth).length;
      
      if (healthyCount === totalSystems) {
        console.log('✅ All systems healthy');
      } else {
        console.warn(`⚠️ ${totalSystems - healthyCount} systems need attention`);
      }

    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  }

  private async testNewsAggregation(): Promise<boolean> {
    try {
      const articles = await this.newsAggregator.fetchAllNews();
      return articles.length > 0;
    } catch (error) {
      console.error('News aggregation health check failed:', error);
      return false;
    }
  }

  private testScheduling(): boolean {
    try {
      const { show } = this.schedule.getCurrentShow();
      return !!show;
    } catch (error) {
      console.error('Scheduling health check failed:', error);
      return false;
    }
  }

  private testAnchors(): boolean {
    try {
      const anchors = this.anchorSystem.getAllAnchors();
      return anchors.length === 3; // We should have 3 anchors
    } catch (error) {
      console.error('Anchors health check failed:', error);
      return false;
    }
  }

  private testEmergencySystem(): boolean {
    try {
      const alerts = this.emergencySystem.getActiveAlerts();
      return Array.isArray(alerts);
    } catch (error) {
      console.error('Emergency system health check failed:', error);
      return false;
    }
  }

  private testBroadcast(): boolean {
    try {
      const state = this.broadcastSystem.getBroadcastState();
      return !!state.currentShow;
    } catch (error) {
      console.error('Broadcast health check failed:', error);
      return false;
    }
  }

  private testAnalytics(): boolean {
    try {
      const metrics = this.analytics.getCurrentMetrics();
      return !!metrics.timestamp;
    } catch (error) {
      console.error('Analytics health check failed:', error);
      return false;
    }
  }

  private testNotifications(): boolean {
    try {
      const stats = this.notifications.getNotificationStats();
      return typeof stats.totalSubscribers === 'number';
    } catch (error) {
      console.error('Notifications health check failed:', error);
      return false;
    }
  }

  private performAutoRecovery(): void {
    // Auto-recover anchors from breakdowns
    const anchors = this.anchorSystem.getAllAnchors();
    anchors.forEach(anchor => {
      if (anchor.currentMood === 'breakdown' && anchor.lastBreakdown) {
        const timeSinceBreakdown = Date.now() - anchor.lastBreakdown.getTime();
        if (timeSinceBreakdown > 300000) { // 5 minutes
          this.anchorSystem.recoverAnchor(anchor.id);
          console.log(`🔧 Auto-recovered anchor: ${anchor.name}`);
        }
      }
    });

    // Generate simulated activity if no real activity
    const metrics = this.analytics.getCurrentMetrics();
    if (metrics.viewerCount < 50) {
      this.simulateViewerActivity();
    }
  }

  private simulateInitialActivity(): void {
    // Add some demo users for notifications
    this.notifications.registerUser('demo-user-1', {
      userId: 'demo-user-1',
      breakingNews: true,
      emergencyAlerts: true,
      anchorBreakdowns: true,
      weatherAlerts: true,
      sportsUpdates: true,
      categories: ['breaking', 'politics', 'weather', 'sports'],
      quietHours: { enabled: false, start: '22:00', end: '07:00' }
    });

    this.notifications.registerUser('demo-user-2', {
      userId: 'demo-user-2',
      breakingNews: true,
      emergencyAlerts: true,
      anchorBreakdowns: true,
      weatherAlerts: false,
      sportsUpdates: false,
      categories: ['breaking', 'politics'],
      quietHours: { enabled: true, start: '23:00', end: '06:00' }
    });

    // Simulate some initial revenue
    setTimeout(() => {
      this.analytics.recordSponsorRevenue('Freedom Fries Inc', 25.00);
    }, 5000);

    setTimeout(() => {
      this.analytics.recordPremiumFeature('HD Stream', 9.99, 'demo-user-1');
    }, 10000);
  }

  private simulateViewerActivity(): void {
    const metrics = this.analytics.getCurrentMetrics();
    // Add 20-50 simulated viewers
    const additionalViewers = 20 + Math.floor(Math.random() * 30);
    console.log(`🎭 Simulating ${additionalViewers} additional viewers`);
  }

  // Public API Methods

  getCurrentBroadcast(): BroadcastState {
    return this.broadcastSystem.getBroadcastState();
  }

  async getLatestNews(limit: number = 10): Promise<NewsArticle[]> {
    const news = await this.newsAggregator.fetchAllNews();
    return news.slice(0, limit);
  }

  async getBreakingNews(): Promise<NewsArticle[]> {
    return await this.newsAggregator.getBreakingNews();
  }

  getActiveAlerts(): EmergencyAlert[] {
    return this.emergencySystem.getActiveAlerts();
  }

  getCurrentShow() {
    return this.schedule.getCurrentShow();
  }

  getAnalyticsSummary() {
    return this.analytics.getDashboardSummary();
  }

  getSystemHealth() {
    return {
      ...this.systemHealth,
      isRunning: this.isRunning,
      lastHealthCheck: this.lastHealthCheck,
      uptime: Date.now() - this.lastHealthCheck.getTime()
    };
  }

  // Revenue Generation Methods

  triggerBreakdown(anchorId?: string, userId?: string): { success: boolean; cost: number; revenueEvent?: any } {
    const targetAnchor = anchorId || this.getCurrentBroadcast().anchor.id;
    
    if (this.broadcastSystem.triggerBreakdown(targetAnchor)) {
      const revenueEvent = this.analytics.recordBreakdownTrigger(targetAnchor, userId);
      
      // Send notification about the breakdown
      const anchor = this.anchorSystem.getAnchor(targetAnchor);
      if (anchor) {
        this.notifications.sendAnchorBreakdown(
          targetAnchor,
          anchor.name,
          'Having an existential crisis live on air!'
        );
      }

      return {
        success: true,
        cost: 4.99,
        revenueEvent
      };
    }

    return {
      success: false,
      cost: 4.99
    };
  }

  purchasePremiumFeature(featureName: string, price: number, userId?: string): any {
    return this.analytics.recordPremiumFeature(featureName, price, userId);
  }

  // Admin Methods

  createTestAlert(level?: any): void {
    this.emergencySystem.createTestAlert(level);
  }

  setEmergencyMode(enabled: boolean): void {
    this.broadcastSystem.setEmergencyMode(enabled);
  }

  getRevenueReport(hours: number = 24) {
    return {
      total: this.analytics.getTotalRevenue(hours),
      byType: this.analytics.getRevenueByType(hours),
      breakdown: this.analytics.getBreakdownStats(),
      trends: this.analytics.getRevenueTrends(hours)
    };
  }

  exportAnalytics(format: 'json' | 'csv' = 'json'): string {
    return this.analytics.exportAnalytics(format);
  }

  // Notification Methods

  subscribeToNotifications(userId: string, preferences?: any): void {
    this.notifications.registerUser(userId, preferences);
  }

  updateNotificationPreferences(userId: string, preferences: any): void {
    this.notifications.updatePreferences(userId, preferences);
  }

  sendCustomNotification(title: string, body: string, category: string): void {
    this.notifications.sendCustomNotification(title, body, category);
  }

  // System Control

  stop(): void {
    this.isRunning = false;
    this.broadcastSystem.stop();
    this.analytics.stop();
    this.notifications.disable();
    console.log('📺 Static.news system stopped');
  }

  restart(): void {
    console.log('🔄 Restarting Static.news system...');
    this.stop();
    setTimeout(() => {
      this.startSystem();
    }, 1000);
  }

  getStatus() {
    const broadcast = this.getCurrentBroadcast();
    const analytics = this.getAnalyticsSummary();
    const health = this.getSystemHealth();

    return {
      isLive: this.isRunning,
      currentShow: broadcast.currentShow.name,
      currentAnchor: broadcast.anchor.name,
      viewerCount: analytics.currentViewers,
      revenue24h: analytics.totalRevenue24h,
      systemHealth: health,
      emergencyAlerts: this.getActiveAlerts().length,
      lastHealthCheck: this.lastHealthCheck
    };
  }
}

// Export singleton instance
export const staticNewsSystem = new StaticNewsSystem();