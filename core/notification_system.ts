import { EmergencyAlert, NewsArticle, UrgencyLevel, AlertCategory } from './types';

export interface NotificationPreferences {
  userId: string;
  breakingNews: boolean;
  emergencyAlerts: boolean;
  anchorBreakdowns: boolean;
  weatherAlerts: boolean;
  sportsUpdates: boolean;
  categories: string[];
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string;   // HH:MM
  };
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  urgency: UrgencyLevel;
  category: string;
  timestamp: Date;
  sent: boolean;
}

export class NotificationSystem {
  private preferences: Map<string, NotificationPreferences>;
  private notificationQueue: PushNotification[];
  private sentNotifications: PushNotification[];
  private isEnabled: boolean;

  constructor() {
    this.preferences = new Map();
    this.notificationQueue = [];
    this.sentNotifications = [];
    this.isEnabled = true;
    this.startNotificationProcessor();
  }

  private startNotificationProcessor(): void {
    // Process notification queue every 10 seconds
    setInterval(() => {
      this.processNotificationQueue();
    }, 10000);

    // Clean up old notifications every hour
    setInterval(() => {
      this.cleanupOldNotifications();
    }, 3600000);
  }

  registerUser(userId: string, preferences?: Partial<NotificationPreferences>): void {
    const defaultPreferences: NotificationPreferences = {
      userId,
      breakingNews: true,
      emergencyAlerts: true,
      anchorBreakdowns: true,
      weatherAlerts: true,
      sportsUpdates: false,
      categories: ['breaking', 'politics', 'weather'],
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00'
      }
    };

    this.preferences.set(userId, {
      ...defaultPreferences,
      ...preferences
    });

    console.log(`📱 User registered for notifications: ${userId}`);
  }

  updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): void {
    const current = this.preferences.get(userId);
    if (current) {
      this.preferences.set(userId, { ...current, ...preferences });
      console.log(`⚙️ Notification preferences updated for ${userId}`);
    }
  }

  sendBreakingNews(article: NewsArticle): void {
    if (!this.isEnabled) return;

    const notification: PushNotification = {
      id: `breaking-${Date.now()}`,
      title: '🚨 Breaking News',
      body: article.title,
      icon: 'breaking-news-icon',
      badge: 'static-news-badge',
      data: {
        type: 'breaking_news',
        articleId: article.id,
        url: article.url
      },
      urgency: article.urgency,
      category: 'breaking',
      timestamp: new Date(),
      sent: false
    };

    this.queueNotification(notification);
  }

  sendEmergencyAlert(alert: EmergencyAlert): void {
    if (!this.isEnabled) return;

    const notification: PushNotification = {
      id: `alert-${alert.id}`,
      title: `${this.getAlertEmoji(alert.category)} ${alert.title}`,
      body: alert.message,
      icon: 'emergency-alert-icon',
      badge: 'emergency-badge',
      data: {
        type: 'emergency_alert',
        alertId: alert.id,
        category: alert.category,
        level: alert.level
      },
      urgency: alert.level,
      category: 'emergency',
      timestamp: new Date(),
      sent: false
    };

    // Emergency alerts bypass queue and send immediately
    this.sendImmediateNotification(notification);
  }

  sendAnchorBreakdown(anchorId: string, anchorName: string, message: string): void {
    if (!this.isEnabled) return;

    const notification: PushNotification = {
      id: `breakdown-${Date.now()}`,
      title: '💥 Anchor Breakdown Alert!',
      body: `${anchorName} is having an existential crisis! Tap to trigger for $4.99`,
      icon: 'breakdown-icon',
      badge: 'breakdown-badge',
      data: {
        type: 'anchor_breakdown',
        anchorId,
        anchorName,
        message,
        price: 4.99
      },
      urgency: UrgencyLevel.HIGH,
      category: 'breakdown',
      timestamp: new Date(),
      sent: false
    };

    this.queueNotification(notification);
  }

  sendWeatherAlert(title: string, message: string, severity: UrgencyLevel): void {
    if (!this.isEnabled) return;

    const notification: PushNotification = {
      id: `weather-${Date.now()}`,
      title: `🌩️ ${title}`,
      body: message,
      icon: 'weather-icon',
      badge: 'weather-badge',
      data: {
        type: 'weather_alert',
        severity
      },
      urgency: severity,
      category: 'weather',
      timestamp: new Date(),
      sent: false
    };

    this.queueNotification(notification);
  }

  sendCustomNotification(
    title: string,
    body: string,
    category: string,
    urgency: UrgencyLevel = UrgencyLevel.MEDIUM,
    data?: any
  ): void {
    if (!this.isEnabled) return;

    const notification: PushNotification = {
      id: `custom-${Date.now()}`,
      title,
      body,
      icon: 'static-news-icon',
      badge: 'static-news-badge',
      data: {
        type: 'custom',
        ...data
      },
      urgency,
      category,
      timestamp: new Date(),
      sent: false
    };

    this.queueNotification(notification);
  }

  private queueNotification(notification: PushNotification): void {
    this.notificationQueue.push(notification);
    console.log(`📝 Notification queued: ${notification.title}`);
  }

  private sendImmediateNotification(notification: PushNotification): void {
    this.sendToSubscribers(notification);
    this.markAsSent(notification);
  }

  private processNotificationQueue(): void {
    if (this.notificationQueue.length === 0) return;

    // Sort by urgency
    this.notificationQueue.sort((a, b) => {
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1, routine: 0 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });

    // Process up to 5 notifications at a time
    const toProcess = this.notificationQueue.splice(0, 5);
    
    toProcess.forEach(notification => {
      this.sendToSubscribers(notification);
      this.markAsSent(notification);
    });
  }

  private sendToSubscribers(notification: PushNotification): void {
    let sentCount = 0;

    this.preferences.forEach((prefs, userId) => {
      if (this.shouldSendToUser(notification, prefs)) {
        this.sendPushNotification(userId, notification);
        sentCount++;
      }
    });

    console.log(`📤 Notification sent to ${sentCount} users: ${notification.title}`);
  }

  private shouldSendToUser(notification: PushNotification, prefs: NotificationPreferences): boolean {
    // Check if user wants this type of notification
    switch (notification.category) {
      case 'breaking':
        if (!prefs.breakingNews) return false;
        break;
      case 'emergency':
        if (!prefs.emergencyAlerts) return false;
        break;
      case 'breakdown':
        if (!prefs.anchorBreakdowns) return false;
        break;
      case 'weather':
        if (!prefs.weatherAlerts) return false;
        break;
      case 'sports':
        if (!prefs.sportsUpdates) return false;
        break;
    }

    // Check category preferences
    if (prefs.categories.length > 0 && !prefs.categories.includes(notification.category)) {
      return false;
    }

    // Check quiet hours (except for critical alerts)
    if (notification.urgency !== UrgencyLevel.CRITICAL && prefs.quietHours.enabled) {
      if (this.isQuietTime(prefs.quietHours.start, prefs.quietHours.end)) {
        return false;
      }
    }

    return true;
  }

  private isQuietTime(start: string, end: string): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const currentMinutes = this.timeToMinutes(currentTime);
    const startMinutes = this.timeToMinutes(start);
    const endMinutes = this.timeToMinutes(end);

    // Handle overnight quiet hours
    if (endMinutes < startMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
    
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private sendPushNotification(userId: string, notification: PushNotification): void {
    // In a real implementation, this would:
    // 1. Send to Firebase Cloud Messaging (FCM) for Android
    // 2. Send to Apple Push Notification Service (APNS) for iOS
    // 3. Send to Web Push API for web browsers
    // 4. Send to other notification services

    console.log(`📱 Push notification sent to ${userId}:`, {
      title: notification.title,
      body: notification.body,
      urgency: notification.urgency,
      timestamp: notification.timestamp
    });

    // Simulate push notification delivery
    this.simulatePushDelivery(userId, notification);
  }

  private simulatePushDelivery(userId: string, notification: PushNotification): void {
    // Simulate various notification platforms
    const platforms = ['web', 'android', 'ios'];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    
    const deliveryStatus = {
      platform,
      userId,
      notificationId: notification.id,
      delivered: Math.random() > 0.1, // 90% delivery rate
      timestamp: new Date()
    };

    if (deliveryStatus.delivered) {
      console.log(`✅ Notification delivered via ${platform} to ${userId}`);
    } else {
      console.log(`❌ Notification failed to deliver to ${userId}`);
    }
  }

  private markAsSent(notification: PushNotification): void {
    notification.sent = true;
    this.sentNotifications.push(notification);
  }

  private cleanupOldNotifications(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    this.sentNotifications = this.sentNotifications.filter(
      notification => notification.timestamp > oneDayAgo
    );
    
    console.log(`🧹 Cleaned up old notifications. Current count: ${this.sentNotifications.length}`);
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

  getNotificationStats(): {
    queueLength: number;
    sentToday: number;
    totalSubscribers: number;
    deliveryRate: number;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sentToday = this.sentNotifications.filter(
      notification => notification.timestamp >= today
    ).length;

    return {
      queueLength: this.notificationQueue.length,
      sentToday,
      totalSubscribers: this.preferences.size,
      deliveryRate: 90 // Simulated 90% delivery rate
    };
  }

  getSentNotifications(hours: number = 24): PushNotification[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.sentNotifications.filter(notification => notification.timestamp > cutoff);
  }

  getUserPreferences(userId: string): NotificationPreferences | undefined {
    return this.preferences.get(userId);
  }

  getAllPreferences(): NotificationPreferences[] {
    return Array.from(this.preferences.values());
  }

  enable(): void {
    this.isEnabled = true;
    console.log('📱 Notification system enabled');
  }

  disable(): void {
    this.isEnabled = false;
    this.notificationQueue = [];
    console.log('📵 Notification system disabled');
  }

  isSystemEnabled(): boolean {
    return this.isEnabled;
  }
}