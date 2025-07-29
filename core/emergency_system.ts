import { EmergencyAlert, AlertCategory, UrgencyLevel } from './types';
import { NewsAggregator } from './news_aggregator';

export class EmergencyBroadcastSystem {
  private activeAlerts: Map<string, EmergencyAlert>;
  private alertSources!: Array<{
    url: string;
    type: AlertCategory;
    checkInterval: number;
  }>;
  private newsAggregator: NewsAggregator;

  constructor() {
    this.activeAlerts = new Map();
    this.newsAggregator = new NewsAggregator();
    this.initializeAlertSources();
    this.startAlertMonitoring();
  }

  private initializeAlertSources() {
    this.alertSources = [
      {
        url: 'https://alerts.weather.gov/cap/us.php?x=1',
        type: AlertCategory.WEATHER,
        checkInterval: 60000 // 1 minute
      },
      {
        url: 'https://emergency.cdc.gov/rss/cdc_disasters.xml',
        type: AlertCategory.HEALTH,
        checkInterval: 300000 // 5 minutes
      }
    ];
  }

  private startAlertMonitoring() {
    // Monitor news for emergency indicators
    setInterval(async () => {
      await this.checkNewsForEmergencies();
    }, 60000); // Check every minute

    // Check external alert sources
    this.alertSources.forEach(source => {
      setInterval(async () => {
        await this.checkAlertSource(source);
      }, source.checkInterval);
    });

    // Clean up expired alerts
    setInterval(() => {
      this.cleanupExpiredAlerts();
    }, 300000); // Every 5 minutes
  }

  private async checkNewsForEmergencies() {
    try {
      const breakingNews = await this.newsAggregator.getBreakingNews();
      
      for (const article of breakingNews) {
        if (this.isEmergencyNews(article.title, article.content)) {
          const alert = this.createAlertFromNews(article);
          if (alert) {
            this.addAlert(alert);
          }
        }
      }
    } catch (error) {
      console.error('Error checking news for emergencies:', error);
    }
  }

  private isEmergencyNews(title: string, content: string): boolean {
    const text = (title + ' ' + content).toLowerCase();
    
    const emergencyKeywords = [
      'emergency', 'alert', 'warning', 'urgent', 'breaking',
      'evacuation', 'lockdown', 'shelter in place', 'disaster',
      'terrorist', 'shooting', 'explosion', 'fire', 'flood',
      'earthquake', 'tornado', 'hurricane', 'tsunami',
      'chemical spill', 'gas leak', 'bomb threat', 'active shooter',
      'severe weather', 'flash flood', 'winter storm',
      'amber alert', 'missing person', 'public safety'
    ];

    return emergencyKeywords.some(keyword => text.includes(keyword));
  }

  private createAlertFromNews(article: any): EmergencyAlert | null {
    const text = (article.title + ' ' + article.content).toLowerCase();
    
    let category = AlertCategory.EMERGENCY;
    
    if (text.includes('weather') || text.includes('storm') || text.includes('tornado') || text.includes('hurricane')) {
      category = AlertCategory.WEATHER;
    } else if (text.includes('health') || text.includes('disease') || text.includes('outbreak')) {
      category = AlertCategory.HEALTH;
    } else if (text.includes('traffic') || text.includes('highway') || text.includes('road')) {
      category = AlertCategory.TRAFFIC;
    } else if (text.includes('security') || text.includes('terrorist') || text.includes('threat')) {
      category = AlertCategory.SECURITY;
    }

    return {
      id: `news-alert-${Date.now()}`,
      title: article.title,
      message: article.summary || article.content.substring(0, 500),
      level: article.urgency,
      category: category,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      affectedAreas: this.extractAffectedAreas(article.title + ' ' + article.content),
      source: article.source,
      isActive: true
    };
  }

  private extractAffectedAreas(text: string): string[] {
    const areas: string[] = [];
    
    // Common US states and major cities
    const locations = [
      'california', 'texas', 'florida', 'new york', 'illinois', 'pennsylvania',
      'ohio', 'georgia', 'north carolina', 'michigan', 'new jersey', 'virginia',
      'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'san antonio',
      'san diego', 'dallas', 'san jose', 'austin', 'jacksonville', 'fort worth',
      'columbus', 'charlotte', 'san francisco', 'indianapolis', 'seattle', 'denver',
      'washington', 'boston', 'el paso', 'detroit', 'nashville', 'portland',
      'memphis', 'oklahoma city', 'las vegas', 'louisville', 'baltimore', 'milwaukee'
    ];

    const lowerText = text.toLowerCase();
    locations.forEach(location => {
      if (lowerText.includes(location)) {
        areas.push(location.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '));
      }
    });

    return areas.length > 0 ? areas : ['General Public'];
  }

  private async checkAlertSource(source: { url: string; type: AlertCategory; checkInterval: number }) {
    try {
      // This would normally fetch from external APIs
      // For now, we'll simulate some weather alerts
      if (source.type === AlertCategory.WEATHER) {
        await this.simulateWeatherAlerts();
      }
    } catch (error) {
      console.error(`Error checking alert source ${source.url}:`, error);
    }
  }

  private async simulateWeatherAlerts() {
    // Simulate occasional weather alerts for demo purposes
    if (Math.random() < 0.1) { // 10% chance
      const weatherAlerts = [
        {
          title: 'Severe Thunderstorm Warning',
          message: 'A severe thunderstorm is approaching the area. Take shelter immediately.',
          level: UrgencyLevel.HIGH,
          affectedAreas: ['Local Area']
        },
        {
          title: 'Flash Flood Watch',
          message: 'Conditions are favorable for flash flooding in low-lying areas.',
          level: UrgencyLevel.MEDIUM,
          affectedAreas: ['Regional']
        },
        {
          title: 'Winter Weather Advisory',
          message: 'Light snow expected. Use caution while driving.',
          level: UrgencyLevel.LOW,
          affectedAreas: ['Metropolitan Area']
        }
      ];

      const alert = weatherAlerts[Math.floor(Math.random() * weatherAlerts.length)];
      
      this.addAlert({
        id: `weather-alert-${Date.now()}`,
        title: alert.title,
        message: alert.message,
        level: alert.level,
        category: AlertCategory.WEATHER,
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
        affectedAreas: alert.affectedAreas,
        source: 'National Weather Service',
        isActive: true
      });
    }
  }

  addAlert(alert: EmergencyAlert): void {
    this.activeAlerts.set(alert.id, alert);
    
    // Log the alert
    console.log(`🚨 Emergency Alert: ${alert.title} - ${alert.level.toUpperCase()}`);
    
    // Trigger notifications based on urgency
    this.triggerAlertNotifications(alert);
  }

  private triggerAlertNotifications(alert: EmergencyAlert): void {
    // This would integrate with push notification systems
    // For now, we'll log the notification
    
    const notificationMessage = {
      title: `${this.getAlertEmoji(alert.category)} ${alert.title}`,
      body: alert.message,
      urgency: alert.level,
      category: alert.category,
      timestamp: alert.issuedAt
    };

    console.log('📱 Push Notification:', notificationMessage);
    
    // In a real implementation, this would send to:
    // - Mobile push notifications
    // - Email alerts
    // - SMS alerts
    // - Browser notifications
    // - Social media posts
  }

  private getAlertEmoji(category: AlertCategory): string {
    const emojis = {
      [AlertCategory.WEATHER]: '🌩️',
      [AlertCategory.EMERGENCY]: '🚨',
      [AlertCategory.SECURITY]: '🔒',
      [AlertCategory.HEALTH]: '🏥',
      [AlertCategory.TRAFFIC]: '🚗',
      [AlertCategory.SYSTEM]: '⚙️'
    };
    
    return emojis[category] || '⚠️';
  }

  getActiveAlerts(): EmergencyAlert[] {
    return Array.from(this.activeAlerts.values())
      .filter(alert => alert.isActive)
      .sort((a, b) => {
        // Sort by urgency, then by time
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1, routine: 0 };
        const urgencyDiff = urgencyOrder[b.level] - urgencyOrder[a.level];
        if (urgencyDiff !== 0) return urgencyDiff;
        
        return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
      });
  }

  getAlertsByCategory(category: AlertCategory): EmergencyAlert[] {
    return this.getActiveAlerts().filter(alert => alert.category === category);
  }

  dismissAlert(alertId: string): void {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.isActive = false;
      console.log(`✅ Alert dismissed: ${alert.title}`);
    }
  }

  private cleanupExpiredAlerts(): void {
    const now = new Date();
    const expiredAlerts: string[] = [];

    this.activeAlerts.forEach((alert, id) => {
      if (alert.expiresAt && now > alert.expiresAt) {
        expiredAlerts.push(id);
      }
    });

    expiredAlerts.forEach(id => {
      this.activeAlerts.delete(id);
      console.log(`🗑️ Expired alert removed: ${id}`);
    });
  }

  shouldOverrideProgram(): boolean {
    const criticalAlerts = this.getActiveAlerts().filter(alert => 
      alert.level === UrgencyLevel.CRITICAL
    );
    
    return criticalAlerts.length > 0;
  }

  getCriticalAlerts(): EmergencyAlert[] {
    return this.getActiveAlerts().filter(alert => 
      alert.level === UrgencyLevel.CRITICAL
    );
  }

  getAlertCount(): number {
    return this.getActiveAlerts().length;
  }

  getTopAlert(): EmergencyAlert | null {
    const alerts = this.getActiveAlerts();
    return alerts.length > 0 ? alerts[0] : null;
  }

  createTestAlert(level: UrgencyLevel = UrgencyLevel.MEDIUM): void {
    const testAlert: EmergencyAlert = {
      id: `test-alert-${Date.now()}`,
      title: 'Test Emergency Alert',
      message: 'This is a test of the emergency broadcast system. This is only a test.',
      level: level,
      category: AlertCategory.SYSTEM,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      affectedAreas: ['Test Area'],
      source: 'Static.news Emergency System',
      isActive: true
    };

    this.addAlert(testAlert);
  }
}