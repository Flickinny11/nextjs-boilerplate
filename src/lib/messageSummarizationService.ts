// AI Message Summarization Service
// Automatically summarizes email and SMS messages for CRM contacts

import { openRouterService } from './openRouterService';
import { crmService } from './crmService';
import { emailIntegrationService, EmailMessage } from './emailIntegrationService';

export interface SMSMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  date: Date;
  direction: 'incoming' | 'outgoing';
}

export interface MessageSummary {
  contactId: string;
  contactEmail: string;
  contactName: string;
  emailCount: number;
  smsCount: number;
  summary: string;
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  nextActions: string[];
  lastMessageDate: Date;
  generatedAt: Date;
}

export interface SummarizationSettings {
  enabled: boolean;
  dailyTime: string; // HH:mm format, e.g., "18:00"
  excludedContacts: string[]; // Contact IDs to exclude
  includeSentiment: boolean;
  includeNextActions: boolean;
  maxDaysBack: number; // How many days back to look for messages
  minMessageCount: number; // Minimum messages required to generate summary
}

export class MessageSummarizationService {
  private static instance: MessageSummarizationService;
  private settings: SummarizationSettings = {
    enabled: true,
    dailyTime: '18:00',
    excludedContacts: [],
    includeSentiment: true,
    includeNextActions: true,
    maxDaysBack: 7,
    minMessageCount: 2
  };

  private constructor() {
    this.loadSettings();
    this.scheduleDailySummarization();
  }

  public static getInstance(): MessageSummarizationService {
    if (!MessageSummarizationService.instance) {
      MessageSummarizationService.instance = new MessageSummarizationService();
    }
    return MessageSummarizationService.instance;
  }

  // Get current settings
  getSettings(): SummarizationSettings {
    return { ...this.settings };
  }

  // Update settings
  updateSettings(newSettings: Partial<SummarizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    
    // Reschedule if time changed
    if (newSettings.dailyTime) {
      this.scheduleDailySummarization();
    }
  }

  // Get messages for a contact from all connected sources
  async getContactMessages(contactEmail: string, daysBack: number = 7): Promise<{
    emails: EmailMessage[];
    sms: SMSMessage[];
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    // Get emails from all connected accounts
    const connectedAccounts = emailIntegrationService.getConnectedAccounts();
    const allEmails: EmailMessage[] = [];

    for (const account of connectedAccounts) {
      try {
        const messages = await emailIntegrationService.syncMessages(account.id);
        const contactEmails = messages.filter(msg => 
          (msg.from === contactEmail || msg.to.includes(contactEmail)) &&
          msg.date >= cutoffDate
        );
        allEmails.push(...contactEmails);
      } catch (error) {
        console.error(`Failed to get emails from account ${account.email}:`, error);
      }
    }

    // Get SMS messages (would integrate with mobile device APIs)
    const smsMessages = await this.getSMSMessages(contactEmail, daysBack);

    return {
      emails: allEmails.sort((a, b) => b.date.getTime() - a.date.getTime()),
      sms: smsMessages.sort((a, b) => b.date.getTime() - a.date.getTime())
    };
  }

  // Generate AI summary for a contact's messages
  async generateContactSummary(contactEmail: string): Promise<MessageSummary | null> {
    try {
      // Get contact from CRM
      const crmContact = await crmService.findContactByEmail(contactEmail);
      if (!crmContact.success || !crmContact.data) {
        console.log(`Contact ${contactEmail} not found in CRM, skipping summary`);
        return null;
      }

      const contact = crmContact.data;

      // Check if contact is excluded
      if (this.settings.excludedContacts.includes(contact.id)) {
        return null;
      }

      // Get messages
      const { emails, sms } = await this.getContactMessages(contactEmail, this.settings.maxDaysBack);
      
      // Check minimum message requirement
      if (emails.length + sms.length < this.settings.minMessageCount) {
        return null;
      }

      // Prepare messages for AI summarization
      const messageHistory = [
        ...emails.map(msg => ({
          type: 'email',
          date: msg.date.toISOString(),
          from: msg.from,
          to: msg.to.join(', '),
          subject: msg.subject,
          content: msg.body.substring(0, 1000) // Limit content length
        })),
        ...sms.map(msg => ({
          type: 'sms',
          date: msg.date.toISOString(),
          from: msg.from,
          to: msg.to,
          content: msg.body
        }))
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Generate AI summary
      const summaryPrompt = `
        Analyze the following communication history with ${contact.firstName} ${contact.lastName} (${contactEmail}) and provide a comprehensive summary:

        MESSAGES:
        ${JSON.stringify(messageHistory, null, 2)}

        Please provide:
        1. A concise summary of the key topics and interactions
        2. Key topics discussed (as an array)
        3. Overall sentiment (positive/neutral/negative)
        4. Suggested next actions (as an array)

        Format your response as JSON:
        {
          "summary": "Brief summary of interactions...",
          "keyTopics": ["topic1", "topic2", ...],
          "sentiment": "positive|neutral|negative",
          "nextActions": ["action1", "action2", ...]
        }
      `;

      const aiResponse = await openRouterService.createChatCompletion([
        {
          role: "system",
          content: "You are a professional business communication analyst. Analyze message history and provide actionable insights for CRM follow-up."
        },
        {
          role: "user",
          content: summaryPrompt
        }
      ], 'anthropic/claude-3-haiku');

      // Parse AI response
      let aiResult;
      try {
        aiResult = JSON.parse(aiResponse.choices[0].message.content);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // Fallback to basic summary
        aiResult = {
          summary: `Communication history with ${contact.firstName} ${contact.lastName} includes ${emails.length} emails and ${sms.length} SMS messages.`,
          keyTopics: ['General Communication'],
          sentiment: 'neutral',
          nextActions: ['Follow up on recent communication']
        };
      }

      const lastMessageDate = messageHistory.length > 0 
        ? new Date(messageHistory[messageHistory.length - 1].date)
        : new Date();

      const summary: MessageSummary = {
        contactId: contact.id,
        contactEmail,
        contactName: `${contact.firstName} ${contact.lastName}`,
        emailCount: emails.length,
        smsCount: sms.length,
        summary: aiResult.summary,
        keyTopics: aiResult.keyTopics || [],
        sentiment: aiResult.sentiment || 'neutral',
        nextActions: this.settings.includeNextActions ? (aiResult.nextActions || []) : [],
        lastMessageDate,
        generatedAt: new Date()
      };

      return summary;
    } catch (error) {
      console.error(`Failed to generate summary for ${contactEmail}:`, error);
      return null;
    }
  }

  // Generate summaries for all CRM contacts
  async generateAllContactSummaries(): Promise<MessageSummary[]> {
    if (!this.settings.enabled) {
      console.log('Message summarization is disabled');
      return [];
    }

    console.log('Starting daily message summarization...');
    
    try {
      // Get all contacts from CRM
      const contactsResponse = await crmService.getContacts();
      if (!contactsResponse.success || !contactsResponse.data) {
        console.error('Failed to get CRM contacts');
        return [];
      }

      const contacts = contactsResponse.data;
      const summaries: MessageSummary[] = [];

      // Process contacts in batches to avoid rate limits
      const batchSize = 5;
      for (let i = 0; i < contacts.length; i += batchSize) {
        const batch = contacts.slice(i, i + batchSize);
        
        const batchPromises = batch.map(contact => 
          this.generateContactSummary(contact.email)
        );
        
        const batchResults = await Promise.all(batchPromises);
        const validSummaries = batchResults.filter(summary => summary !== null) as MessageSummary[];
        summaries.push(...validSummaries);

        // Small delay between batches
        if (i + batchSize < contacts.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Save summaries to CRM as call reports
      for (const summary of summaries) {
        await this.saveSummaryToCRM(summary);
      }

      console.log(`Generated ${summaries.length} message summaries`);
      return summaries;
    } catch (error) {
      console.error('Failed to generate contact summaries:', error);
      return [];
    }
  }

  // Save summary as a call report in CRM
  private async saveSummaryToCRM(summary: MessageSummary): Promise<void> {
    try {
      const reportContent = `
📧 Message Summary Report - ${summary.generatedAt.toLocaleDateString()}

📊 Communication Stats:
• Emails: ${summary.emailCount}
• SMS: ${summary.smsCount}
• Last Contact: ${summary.lastMessageDate.toLocaleDateString()}

📝 Summary:
${summary.summary}

🏷️ Key Topics:
${summary.keyTopics.map(topic => `• ${topic}`).join('\n')}

😊 Sentiment: ${summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)}

📋 Suggested Next Actions:
${summary.nextActions.map(action => `• ${action}`).join('\n')}

🤖 Auto-generated by AI Message Summarization
      `.trim();

      await crmService.addNote(summary.contactId, reportContent);
    } catch (error) {
      console.error(`Failed to save summary to CRM for contact ${summary.contactId}:`, error);
    }
  }

  // Get SMS messages (mock implementation - would integrate with mobile APIs)
  private async getSMSMessages(contactPhone: string, daysBack: number): Promise<SMSMessage[]> {
    // In a real implementation, this would integrate with:
    // - Android: SMS API or Firebase Functions
    // - iOS: Shortcuts app automation or MessageKit
    // - Third-party services: Twilio, etc.
    
    // Mock SMS data for demonstration
    const mockSMS: SMSMessage[] = [
      {
        id: `sms_${Date.now()}_1`,
        from: contactPhone,
        to: '+1234567890', // User's phone
        body: 'Thanks for the follow-up email. Looking forward to our meeting next week.',
        date: new Date(Date.now() - 86400000), // 1 day ago
        direction: 'incoming'
      },
      {
        id: `sms_${Date.now()}_2`,
        from: '+1234567890',
        to: contactPhone,
        body: 'Perfect! I\'ll send over the proposal tomorrow morning.',
        date: new Date(Date.now() - 172800000), // 2 days ago
        direction: 'outgoing'
      }
    ];

    return mockSMS;
  }

  // Schedule daily summarization
  private scheduleDailySummarization(): void {
    // Clear any existing timeout
    if ((this as any).dailyTimeout) {
      clearTimeout((this as any).dailyTimeout);
    }

    if (!this.settings.enabled) {
      return;
    }

    const now = new Date();
    const [hours, minutes] = this.settings.dailyTime.split(':').map(Number);
    
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If the scheduled time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNext = scheduledTime.getTime() - now.getTime();
    
    (this as any).dailyTimeout = setTimeout(() => {
      this.generateAllContactSummaries();
      // Reschedule for next day
      this.scheduleDailySummarization();
    }, timeUntilNext);

    console.log(`Next message summarization scheduled for: ${scheduledTime.toLocaleString()}`);
  }

  // Manually trigger summarization
  async triggerManualSummarization(): Promise<MessageSummary[]> {
    console.log('Manual message summarization triggered');
    return this.generateAllContactSummaries();
  }

  // Save settings to localStorage
  private saveSettings(): void {
    try {
      localStorage.setItem('messageSummarizationSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save summarization settings:', error);
    }
  }

  // Load settings from localStorage
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('messageSummarizationSettings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load summarization settings:', error);
    }
  }
}

// Export singleton instance
export const messageSummarizationService = MessageSummarizationService.getInstance();