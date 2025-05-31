/**
 * Enhanced Message Summarization Service
 * Integrates email and SMS messages with AI summarization for CRM contacts
 */

import { openRouterService } from './openRouterService';
import { emailIntegrationService } from './emailIntegrationService';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isEnabled: boolean;
  lastSummaryDate?: Date;
}

export interface MessageSummary {
  id: string;
  contactId: string;
  date: Date;
  summary: string;
  messageCount: number;
  confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  actionItems: string[];
  nextSteps: string[];
}

export interface SummarizationSettings {
  enabled: boolean;
  summaryTime: string; // "18:00" format
  timezone: string;
  excludedContacts: string[];
  includeSMS: boolean;
  includeEmail: boolean;
  minMessagesThreshold: number;
  summaryFrequency: 'daily' | 'weekly' | 'monthly';
  aiModel: string;
}

export interface Message {
  id: string;
  contactId: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
  sender: string;
  recipient: string;
}

class MessageSummarizationService {
  private static instance: MessageSummarizationService;
  private settings: SummarizationSettings;
  private contacts: Contact[] = [];
  private messages: Message[] = [];
  private summaries: MessageSummary[] = [];

  private constructor() {
    this.settings = this.getDefaultSettings();
    this.loadSettingsFromStorage();
  }

  public static getInstance(): MessageSummarizationService {
    if (!MessageSummarizationService.instance) {
      MessageSummarizationService.instance = new MessageSummarizationService();
    }
    return MessageSummarizationService.instance;
  }

  private getDefaultSettings(): SummarizationSettings {
    return {
      enabled: true,
      summaryTime: '18:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      excludedContacts: [],
      includeSMS: true,
      includeEmail: true,
      minMessagesThreshold: 3,
      summaryFrequency: 'daily',
      aiModel: 'anthropic/claude-3.5-sonnet'
    };
  }

  private loadSettingsFromStorage() {
    try {
      const stored = localStorage.getItem('messageSummarizationSettings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading summarization settings:', error);
    }
  }

  private saveSettingsToStorage() {
    try {
      localStorage.setItem('messageSummarizationSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving summarization settings:', error);
    }
  }

  /**
   * Update summarization settings
   */
  updateSettings(newSettings: Partial<SummarizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettingsToStorage();
  }

  /**
   * Get current settings
   */
  getSettings(): SummarizationSettings {
    return { ...this.settings };
  }

  /**
   * Sync messages from email and SMS sources
   */
  async syncMessages(): Promise<void> {
    try {
      const newMessages: Message[] = [];

      // Sync email messages
      if (this.settings.includeEmail) {
        const emailAccounts = emailIntegrationService.getConnectedAccounts();
        
        for (const account of emailAccounts) {
          // In a real implementation, this would fetch recent messages
          // For now, we'll simulate with mock data
          const emailMessages = await this.fetchEmailMessages(account.id);
          newMessages.push(...emailMessages);
        }
      }

      // Sync SMS messages
      if (this.settings.includeSMS) {
        // In a real implementation, this would integrate with SMS APIs
        // like Twilio, or sync with mobile device SMS
        const smsMessages = await this.fetchSMSMessages();
        newMessages.push(...smsMessages);
      }

      // Add new messages to storage
      this.messages.push(...newMessages);
      
      // Remove old messages (keep last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      this.messages = this.messages.filter(msg => msg.timestamp > thirtyDaysAgo);

    } catch (error) {
      console.error('Error syncing messages:', error);
    }
  }

  /**
   * Generate AI summary for a contact's recent messages
   */
  async generateContactSummary(contactId: string): Promise<MessageSummary | null> {
    try {
      const contact = this.contacts.find(c => c.id === contactId);
      if (!contact || !contact.isEnabled) {
        return null;
      }

      // Get recent messages for this contact
      const recentMessages = this.getRecentMessagesForContact(contactId);
      
      if (recentMessages.length < this.settings.minMessagesThreshold) {
        return null;
      }

      // Prepare messages for AI analysis
      const messagesText = recentMessages.map(msg => {
        const direction = msg.direction === 'inbound' ? `From ${msg.sender}` : `To ${msg.recipient}`;
        const subject = msg.subject ? ` - Subject: ${msg.subject}` : '';
        return `${direction} (${msg.type})${subject}:\n${msg.content}\n---`;
      }).join('\n');

      // AI summarization prompt
      const summaryPrompt = `
        Analyze the following conversation messages for ${contact.name} and create a comprehensive summary:

        ${messagesText}

        Create a JSON response with:
        {
          "summary": "Concise summary of the conversation context and key points",
          "sentiment": "positive|neutral|negative",
          "keyTopics": ["topic1", "topic2", "topic3"],
          "actionItems": ["action1", "action2"],
          "nextSteps": ["step1", "step2"],
          "confidence": 0.85
        }

        Focus on:
        - Overall conversation context and purpose
        - Key decisions or outcomes
        - Pending items or follow-ups needed
        - Customer sentiment and satisfaction
        - Business opportunities or concerns
      `;

      const response = await openRouterService.createChatCompletion([
        { role: "system", content: "You are a professional CRM assistant that creates concise, actionable summaries of customer communications." },
        { role: "user", content: summaryPrompt }
      ], this.settings.aiModel);

      if (response.choices && response.choices[0]) {
        const aiResponse = response.choices[0].message.content;
        
        try {
          const summaryData = JSON.parse(aiResponse);
          
          const summary: MessageSummary = {
            id: `summary_${Date.now()}_${contactId}`,
            contactId,
            date: new Date(),
            summary: summaryData.summary,
            messageCount: recentMessages.length,
            confidence: summaryData.confidence || 0.8,
            sentiment: summaryData.sentiment || 'neutral',
            keyTopics: summaryData.keyTopics || [],
            actionItems: summaryData.actionItems || [],
            nextSteps: summaryData.nextSteps || []
          };

          // Store summary
          this.summaries.push(summary);
          
          // Update contact's last summary date
          contact.lastSummaryDate = new Date();

          return summary;

        } catch (parseError) {
          console.error('Error parsing AI summary response:', parseError);
          return null;
        }
      }

      return null;

    } catch (error) {
      console.error('Error generating contact summary:', error);
      return null;
    }
  }

  /**
   * Run daily summarization for all enabled contacts
   */
  async runDailySummarization(): Promise<MessageSummary[]> {
    const summaries: MessageSummary[] = [];

    if (!this.settings.enabled) {
      return summaries;
    }

    // Sync latest messages first
    await this.syncMessages();

    // Generate summaries for all enabled contacts
    for (const contact of this.contacts) {
      if (contact.isEnabled && !this.settings.excludedContacts.includes(contact.id)) {
        const summary = await this.generateContactSummary(contact.id);
        if (summary) {
          summaries.push(summary);
        }
      }
    }

    return summaries;
  }

  /**
   * Schedule automatic summarization
   */
  scheduleAutomaticSummarization(): void {
    if (!this.settings.enabled) {
      return;
    }

    // Calculate next run time
    const now = new Date();
    const [hours, minutes] = this.settings.summaryTime.split(':').map(Number);
    
    const nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const timeUntilRun = nextRun.getTime() - now.getTime();

    setTimeout(async () => {
      await this.runDailySummarization();
      // Schedule next run
      this.scheduleAutomaticSummarization();
    }, timeUntilRun);

    console.log(`Next summarization scheduled for: ${nextRun.toLocaleString()}`);
  }

  /**
   * Get recent messages for a contact
   */
  private getRecentMessagesForContact(contactId: string): Message[] {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return this.messages
      .filter(msg => 
        msg.contactId === contactId && 
        msg.timestamp > oneDayAgo
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Mock email message fetching (replace with real email API)
   */
  private async fetchEmailMessages(accountId: string): Promise<Message[]> {
    // Mock implementation - replace with real email API calls
    const mockMessages: Message[] = [
      {
        id: `email_${Date.now()}_1`,
        contactId: 'contact_1',
        type: 'email',
        subject: 'Follow up on our meeting',
        content: 'Hi, I wanted to follow up on our meeting yesterday about the new product launch...',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        direction: 'inbound',
        sender: 'john@example.com',
        recipient: 'support@captureit.com'
      }
    ];

    return mockMessages;
  }

  /**
   * Mock SMS message fetching (replace with real SMS API)
   */
  private async fetchSMSMessages(): Promise<Message[]> {
    // Mock implementation - replace with real SMS API calls
    const mockMessages: Message[] = [
      {
        id: `sms_${Date.now()}_1`,
        contactId: 'contact_1',
        type: 'sms',
        content: 'Thanks for the quick response! Looking forward to next steps.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        direction: 'inbound',
        sender: '+1234567890',
        recipient: '+1987654321'
      }
    ];

    return mockMessages;
  }

  /**
   * Get all contacts
   */
  getContacts(): Contact[] {
    return [...this.contacts];
  }

  /**
   * Add or update a contact
   */
  updateContact(contact: Contact): void {
    const index = this.contacts.findIndex(c => c.id === contact.id);
    if (index >= 0) {
      this.contacts[index] = contact;
    } else {
      this.contacts.push(contact);
    }
  }

  /**
   * Get summaries for a contact
   */
  getContactSummaries(contactId: string): MessageSummary[] {
    return this.summaries
      .filter(s => s.contactId === contactId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Get all recent summaries
   */
  getRecentSummaries(days: number = 7): MessageSummary[] {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return this.summaries
      .filter(s => s.date > cutoffDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

// Export singleton instance
export const messageSummarizationService = MessageSummarizationService.getInstance();