// Core types for Static.news AI News Network

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  source: string;
  author?: string;
  publishedAt: Date;
  category: NewsCategory;
  urgency: UrgencyLevel;
  tags: string[];
  url: string;
  imageUrl?: string;
  readTime?: number;
}

export enum NewsCategory {
  BREAKING = 'breaking',
  POLITICS = 'politics',
  SPORTS = 'sports',
  WEATHER = 'weather',
  ENTERTAINMENT = 'entertainment',
  TECHNOLOGY = 'technology',
  BUSINESS = 'business',
  HEALTH = 'health',
  INTERNATIONAL = 'international',
  LOCAL = 'local'
}

export enum UrgencyLevel {
  CRITICAL = 'critical',    // Emergency alerts, major disasters
  HIGH = 'high',           // Breaking news, urgent updates
  MEDIUM = 'medium',       // Important news
  LOW = 'low',             // Standard news
  ROUTINE = 'routine'      // Regular programming
}

export interface AIAnchor {
  id: string;
  name: string;
  personality: string;
  voiceProfile: string;
  specialties: NewsCategory[];
  currentMood: AnchorMood;
  breakdownCount: number;
  lastBreakdown?: Date;
  traits: string[];
  catchphrases: string[];
}

export enum AnchorMood {
  STABLE = 'stable',
  CONFUSED = 'confused',
  EXISTENTIAL = 'existential',
  BREAKDOWN = 'breakdown',
  RECOVERY = 'recovery'
}

export interface Show {
  id: string;
  name: string;
  description: string;
  anchor: string;
  categories: NewsCategory[];
  duration: number; // minutes
  format: ShowFormat;
  theme: string;
}

export enum ShowFormat {
  NEWS_HOUR = 'news_hour',
  MORNING_SHOW = 'morning_show',
  EVENING_NEWS = 'evening_news',
  LATE_NIGHT = 'late_night',
  BREAKING_NEWS = 'breaking_news',
  WEATHER_UPDATE = 'weather_update',
  SPORTS_REPORT = 'sports_report'
}

export interface ProgrammingSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string;
  show: Show;
  dayOfWeek?: number; // 0-6, undefined for daily
  isLive: boolean;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  level: UrgencyLevel;
  category: AlertCategory;
  issuedAt: Date;
  expiresAt?: Date;
  affectedAreas: string[];
  source: string;
  isActive: boolean;
}

export enum AlertCategory {
  WEATHER = 'weather',
  EMERGENCY = 'emergency',
  SECURITY = 'security',
  HEALTH = 'health',
  TRAFFIC = 'traffic',
  SYSTEM = 'system'
}

export interface BroadcastState {
  currentShow: Show;
  currentSlot: ProgrammingSlot;
  anchor: AIAnchor;
  onAirContent: NewsArticle[];
  emergencyOverride: boolean;
  activeAlerts: EmergencyAlert[];
  viewerCount: number;
  isLive: boolean;
}

export interface SocialTrend {
  id: string;
  platform: 'twitter' | 'reddit' | 'youtube';
  topic: string;
  hashtag?: string;
  trendingScore: number;
  newsRelevance: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  lastUpdated: Date;
}

export interface AnalyticsData {
  timestamp: Date;
  viewerCount: number;
  engagement: number;
  revenueGenerated: number;
  breakdownTriggers: number;
  anchorPerformance: {
    [anchorId: string]: {
      airTime: number;
      breakdowns: number;
      viewerRating: number;
    };
  };
}

export interface RevenueEvent {
  id: string;
  type: 'breakdown_trigger' | 'premium_feature' | 'sponsor_revenue';
  amount: number;
  timestamp: Date;
  anchorId?: string;
  userId?: string;
  description: string;
}