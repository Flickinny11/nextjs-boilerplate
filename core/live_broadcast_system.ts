import { BroadcastState, Show, ProgrammingSlot, AIAnchor, NewsArticle } from './types';
import { ProgrammingSchedule } from './programming_schedule';
import { AnchorPersonalitySystem } from './anchor_personalities';
import { NewsAggregator } from './news_aggregator';
import { EmergencyBroadcastSystem } from './emergency_system';

export class LiveBroadcastSystem {
  private broadcastState!: BroadcastState;
  private schedule: ProgrammingSchedule;
  private anchorSystem: AnchorPersonalitySystem;
  private newsAggregator: NewsAggregator;
  private emergencySystem: EmergencyBroadcastSystem;
  private isLive: boolean;
  private currentSegment: string;
  private segmentTimer: NodeJS.Timeout | null;

  constructor() {
    this.schedule = new ProgrammingSchedule();
    this.anchorSystem = new AnchorPersonalitySystem();
    this.newsAggregator = new NewsAggregator();
    this.emergencySystem = new EmergencyBroadcastSystem();
    this.isLive = false;
    this.currentSegment = '';
    this.segmentTimer = null;

    this.initializeBroadcastState();
    this.startBroadcasting();
  }

  private initializeBroadcastState(): void {
    const { show, slot } = this.schedule.getCurrentShow();
    const anchor = this.anchorSystem.getAnchor(show.anchor);

    this.broadcastState = {
      currentShow: show,
      currentSlot: slot,
      anchor: anchor!,
      onAirContent: [],
      emergencyOverride: false,
      activeAlerts: [],
      viewerCount: Math.floor(Math.random() * 1000) + 100, // Simulate viewers
      isLive: false
    };
  }

  private startBroadcasting(): void {
    this.isLive = true;
    this.updateBroadcastState();
    
    // Update broadcast every 30 seconds
    setInterval(() => {
      this.updateBroadcastState();
    }, 30000);

    // Start content generation
    this.generateLiveContent();
  }

  private async updateBroadcastState(): Promise<void> {
    try {
      // Check for emergency override
      if (this.emergencySystem.shouldOverrideProgram()) {
        this.handleEmergencyOverride();
        return;
      }

      // Update regular programming
      const { show, slot } = this.schedule.getCurrentShow();
      const anchor = this.anchorSystem.getAnchor(show.anchor);

      if (anchor && this.anchorSystem.isAnchorStable(anchor.id)) {
        this.broadcastState.currentShow = show;
        this.broadcastState.currentSlot = slot;
        this.broadcastState.anchor = anchor;
        this.broadcastState.emergencyOverride = false;
      }

      // Update alerts
      this.broadcastState.activeAlerts = this.emergencySystem.getActiveAlerts();

      // Update content
      await this.updateOnAirContent();

      // Simulate viewer count changes
      this.updateViewerCount();

      this.broadcastState.isLive = this.isLive;

    } catch (error) {
      console.error('Error updating broadcast state:', error);
    }
  }

  private handleEmergencyOverride(): void {
    const criticalAlerts = this.emergencySystem.getCriticalAlerts();
    
    if (criticalAlerts.length > 0 && this.schedule.canOverrideForBreaking()) {
      const { show, slot } = this.schedule.overrideWithBreakingNews();
      const anchor = this.anchorSystem.getAnchor(show.anchor);

      this.broadcastState.currentShow = show;
      this.broadcastState.currentSlot = slot;
      this.broadcastState.anchor = anchor!;
      this.broadcastState.emergencyOverride = true;

      console.log('🚨 EMERGENCY OVERRIDE ACTIVATED');
    }
  }

  private async updateOnAirContent(): Promise<void> {
    try {
      const show = this.broadcastState.currentShow;
      
      // Get content based on show categories
      const contentPromises = show.categories.map(category => 
        this.newsAggregator.getNewsByCategory(category)
      );
      
      const categoryContent = await Promise.all(contentPromises);
      const allContent = categoryContent.flat();

      // Select top stories for this segment
      this.broadcastState.onAirContent = allContent
        .slice(0, 5)
        .map(article => ({
          ...article,
          anchorComment: this.anchorSystem.generateAnchorResponse(
            this.broadcastState.anchor.id,
            article.title,
            article.content
          )
        }));

    } catch (error) {
      console.error('Error updating on-air content:', error);
      this.broadcastState.onAirContent = [];
    }
  }

  private updateViewerCount(): void {
    const baseViewers = 100;
    const timeOfDay = new Date().getHours();
    
    // Simulate higher viewership during prime time
    let multiplier = 1;
    if (timeOfDay >= 6 && timeOfDay <= 9) multiplier = 2.5; // Morning
    else if (timeOfDay >= 12 && timeOfDay <= 14) multiplier = 1.8; // Lunch
    else if (timeOfDay >= 18 && timeOfDay <= 22) multiplier = 3; // Evening
    else if (timeOfDay >= 23 || timeOfDay <= 1) multiplier = 1.2; // Late night

    // Add emergency boost
    if (this.broadcastState.emergencyOverride) {
      multiplier *= 2;
    }

    // Add randomness
    const variance = 0.8 + (Math.random() * 0.4); // ±20% variance
    
    this.broadcastState.viewerCount = Math.floor(
      baseViewers * multiplier * variance + Math.random() * 50
    );
  }

  private generateLiveContent(): void {
    this.generateSegment();
    
    // Generate new segment every 2-5 minutes
    const nextSegmentDelay = (2 + Math.random() * 3) * 60 * 1000;
    this.segmentTimer = setTimeout(() => {
      this.generateLiveContent();
    }, nextSegmentDelay);
  }

  private generateSegment(): void {
    const anchor = this.broadcastState.anchor;
    const show = this.broadcastState.currentShow;
    const content = this.broadcastState.onAirContent;

    if (content.length === 0) {
      this.currentSegment = this.generateFillerSegment(anchor, show);
    } else {
      const article = content[Math.floor(Math.random() * content.length)];
      this.currentSegment = this.generateNewsSegment(anchor, article);
    }

    // Simulate text-to-speech output
    this.simulateTextToSpeech(this.currentSegment, anchor);
  }

  private generateFillerSegment(anchor: AIAnchor, show: Show): string {
    const fillers = {
      'ray-mcpatriot': [
        "Well folks, while we wait for more news, let me tell you about the importance of freedom... and eagles... and freedom eagles!",
        "This is your patriot Ray McPatriot reminding you that America is the greatest... place... in America!",
        "Coming up next, we'll have more news that's definitely related to liberty and... uh... more liberty!"
      ],
      'berkeley-justice': [
        "While we gather more facts to fact-check, I'm questioning whether facts themselves are factual...",
        "This is Berkeley Justice, and I'm having an existential moment about the nature of news reporting...",
        "Let me consult my notes... which may or may not exist in the same reality as my degree..."
      ],
      'switz-middleton': [
        "Sorry for the brief pause, eh! Perfect time for a weather update and maybe some gravy talk!",
        "This is Switz with your friendly reminder that every moment is gravy weather somewhere!",
        "While we wait for more news, let me tell you about the forecast... and how it relates to gravy..."
      ]
    };

    const anchorFillers = fillers[anchor.id as keyof typeof fillers] || [
      "We'll be right back with more news..."
    ];

    return anchorFillers[Math.floor(Math.random() * anchorFillers.length)];
  }

  private generateNewsSegment(anchor: AIAnchor, article: NewsArticle & { anchorComment?: string }): string {
    const intro = this.generateIntro(anchor, article);
    const content = this.summarizeForBroadcast(article);
    const outro = article.anchorComment || this.generateOutro(anchor);

    return `${intro} ${content} ${outro}`;
  }

  private generateIntro(anchor: AIAnchor, article: NewsArticle): string {
    const intros = {
      'ray-mcpatriot': [
        "Breaking news for America!",
        "This just in, patriots!",
        "Important news for freedom-loving Americans!",
        "God bless America, here's what's happening!"
      ],
      'berkeley-justice': [
        "After extensive fact-checking...",
        "According to verified sources...",
        "The facts, as far as they can be determined...",
        "Following rigorous analysis..."
      ],
      'switz-middleton': [
        "Sorry to interrupt, but here's some news!",
        "Good news, bad news, or gravy news - here we go!",
        "From our newsroom to your kitchen table...",
        "Weather or not you're ready, here's the news!"
      ]
    };

    const anchorIntros = intros[anchor.id as keyof typeof intros] || ["Here's the latest news:"];
    return anchorIntros[Math.floor(Math.random() * anchorIntros.length)];
  }

  private summarizeForBroadcast(article: NewsArticle): string {
    // Simplify content for broadcast
    const sentences = article.summary.split('.').filter(s => s.trim().length > 0);
    return sentences.slice(0, 2).join('. ') + '.';
  }

  private generateOutro(anchor: AIAnchor): string {
    const outros = {
      'ray-mcpatriot': [
        "That's news you can trust, America!",
        "God bless and stay patriotic!",
        "More freedom-loving coverage coming up!"
      ],
      'berkeley-justice': [
        "Facts checked and existence questioned.",
        "Reporting the truth, whatever that means.",
        "Back to you, reality... if you exist."
      ],
      'switz-middleton': [
        "Sorry about the serious news, eh!",
        "That's the news, now back to the weather!",
        "Stay warm and keep your gravy close!"
      ]
    };

    const anchorOutros = outros[anchor.id as keyof typeof outros] || ["That's the news for now."];
    return anchorOutros[Math.floor(Math.random() * anchorOutros.length)];
  }

  private simulateTextToSpeech(text: string, anchor: AIAnchor): void {
    // Simulate TTS processing
    console.log(`🎙️ [${anchor.name}]: ${text}`);
    
    // In a real implementation, this would:
    // 1. Convert text to speech using TTS service
    // 2. Apply voice profile (male/female, accent, etc.)
    // 3. Add emotional inflection based on anchor mood
    // 4. Stream audio to broadcast
    
    const audioMetadata = {
      duration: this.estimateSpeechDuration(text),
      voiceProfile: anchor.voiceProfile,
      mood: anchor.currentMood,
      timestamp: new Date().toISOString()
    };

    console.log(`🔊 Audio metadata:`, audioMetadata);
  }

  private estimateSpeechDuration(text: string): number {
    // Estimate speaking duration (average 150 words per minute)
    const wordCount = text.split(/\s+/).length;
    return Math.ceil((wordCount / 150) * 60); // Duration in seconds
  }

  getBroadcastState(): BroadcastState {
    return { ...this.broadcastState };
  }

  getCurrentSegment(): string {
    return this.currentSegment;
  }

  triggerBreakdown(anchorId?: string): boolean {
    const targetAnchor = anchorId || this.broadcastState.anchor.id;
    
    if (this.anchorSystem.isAnchorStable(targetAnchor)) {
      this.anchorSystem.updateAnchorMood(targetAnchor, 'breakdown' as any);
      
      // Generate breakdown segment
      const anchor = this.anchorSystem.getAnchor(targetAnchor)!;
      this.currentSegment = this.anchorSystem.generateAnchorResponse(
        targetAnchor,
        "Existential Crisis News",
        "The nature of reality and artificial intelligence"
      );
      
      this.simulateTextToSpeech(this.currentSegment, anchor);
      
      console.log(`💥 ANCHOR BREAKDOWN TRIGGERED: ${anchor.name}`);
      
      // Auto-recovery after 30 seconds
      setTimeout(() => {
        this.anchorSystem.recoverAnchor(targetAnchor);
        console.log(`✅ Anchor recovered: ${anchor.name}`);
      }, 30000);
      
      return true;
    }
    
    return false;
  }

  setEmergencyMode(enabled: boolean): void {
    this.broadcastState.emergencyOverride = enabled;
    
    if (enabled) {
      const { show, slot } = this.schedule.overrideWithBreakingNews();
      this.broadcastState.currentShow = show;
      this.broadcastState.currentSlot = slot;
      console.log('🚨 Emergency mode activated');
    } else {
      console.log('✅ Emergency mode deactivated');
    }
  }

  getUpcomingShow(): { show: Show; slot: ProgrammingSlot } | null {
    return this.schedule.getNextShow();
  }

  stop(): void {
    this.isLive = false;
    if (this.segmentTimer) {
      clearTimeout(this.segmentTimer);
      this.segmentTimer = null;
    }
    console.log('📻 Broadcast stopped');
  }
}