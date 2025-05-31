interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    userContext?: any;
    researchData?: any;
    actionItems?: any[];
  };
}

interface ConversationMemory {
  conversationId: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  context: CompressedContext;
  createdAt: Date;
  lastUpdated: Date;
  tokenCount: number;
  isActive: boolean;
}

interface CompressedContext {
  userProfile: {
    name: string;
    company: string;
    industry?: string;
    role: string;
    goals?: string[];
  };
  businessContext: {
    targetCustomer?: string;
    challenges?: string[];
    budget?: string;
    timeframe?: string;
  };
  conversationSummary: string;
  keyInsights: string[];
  nextActions: string[];
  researchConducted: string[];
}

interface MemorySettings {
  maxContextTokens: number;
  compressionThreshold: number;
  retentionDays: number;
  autoCompress: boolean;
}

export class MemoryService {
  private conversations = new Map<string, ConversationMemory>();
  private userConversations = new Map<string, string[]>(); // userId -> conversationIds
  private settings: MemorySettings = {
    maxContextTokens: 8000,
    compressionThreshold: 6000,
    retentionDays: 90,
    autoCompress: true
  };

  constructor() {
    // Load settings from storage if available
    this.loadSettings();
  }

  private loadSettings(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('memorySettings');
        if (stored) {
          this.settings = { ...this.settings, ...JSON.parse(stored) };
        }
      }
    } catch (error) {
      console.error('Error loading memory settings:', error);
    }
  }

  private saveSettings(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('memorySettings', JSON.stringify(this.settings));
      }
    } catch (error) {
      console.error('Error saving memory settings:', error);
    }
  }

  async createConversation(
    userId: string, 
    title: string = 'Marketing Strategy Session',
    userContext?: any
  ): Promise<string> {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const conversation: ConversationMemory = {
      conversationId,
      userId,
      title,
      messages: [],
      context: this.initializeContext(userContext),
      createdAt: new Date(),
      lastUpdated: new Date(),
      tokenCount: 0,
      isActive: true
    };

    this.conversations.set(conversationId, conversation);
    
    // Track user conversations
    if (!this.userConversations.has(userId)) {
      this.userConversations.set(userId, []);
    }
    this.userConversations.get(userId)!.push(conversationId);

    await this.persistConversation(conversationId);
    
    return conversationId;
  }

  async addMessage(
    conversationId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const chatMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    conversation.messages.push(chatMessage);
    conversation.lastUpdated = new Date();
    conversation.tokenCount = this.estimateTokenCount(conversation.messages);

    // Update context with message insights
    await this.updateContext(conversation, chatMessage);

    // Check if compression is needed
    if (this.settings.autoCompress && conversation.tokenCount > this.settings.compressionThreshold) {
      await this.compressConversation(conversationId);
    }

    await this.persistConversation(conversationId);
  }

  async getConversation(conversationId: string): Promise<ConversationMemory | null> {
    let conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      // Try to load from persistent storage
      const loadedConversation = await this.loadConversation(conversationId);
      if (loadedConversation) {
        conversation = loadedConversation;
      }
    }

    return conversation || null;
  }

  async getConversationContext(conversationId: string): Promise<CompressedContext | null> {
    const conversation = await this.getConversation(conversationId);
    return conversation?.context || null;
  }

  async getUserConversations(userId: string, limit: number = 50): Promise<ConversationMemory[]> {
    const conversationIds = this.userConversations.get(userId) || [];
    const conversations: ConversationMemory[] = [];

    for (const id of conversationIds.slice(-limit)) {
      const conversation = await this.getConversation(id);
      if (conversation) {
        conversations.push(conversation);
      }
    }

    return conversations.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  }

  async compressConversation(conversationId: string): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return;

    // Keep recent messages, compress older ones into context
    const recentMessages = conversation.messages.slice(-10);
    const messagesToCompress = conversation.messages.slice(0, -10);

    if (messagesToCompress.length === 0) return;

    // Create summary of compressed messages
    const summary = await this.createMessagesSummary(messagesToCompress);
    
    // Update context with compressed information
    conversation.context.conversationSummary = summary;
    conversation.context.keyInsights = this.extractKeyInsights(messagesToCompress);
    
    // Keep only recent messages
    conversation.messages = recentMessages;
    conversation.tokenCount = this.estimateTokenCount(recentMessages);
    conversation.lastUpdated = new Date();

    await this.persistConversation(conversationId);
  }

  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    this.conversations.delete(conversationId);
    
    // Remove from user conversations
    const userConvs = this.userConversations.get(userId);
    if (userConvs) {
      const index = userConvs.indexOf(conversationId);
      if (index > -1) {
        userConvs.splice(index, 1);
      }
    }

    // Remove from persistent storage
    await this.removePersistedConversation(conversationId);
  }

  getMemoryUsage(conversationId: string): {
    tokenCount: number;
    maxTokens: number;
    usagePercentage: number;
    compressionNeeded: boolean;
  } {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      return {
        tokenCount: 0,
        maxTokens: this.settings.maxContextTokens,
        usagePercentage: 0,
        compressionNeeded: false
      };
    }

    const usagePercentage = (conversation.tokenCount / this.settings.maxContextTokens) * 100;
    
    return {
      tokenCount: conversation.tokenCount,
      maxTokens: this.settings.maxContextTokens,
      usagePercentage,
      compressionNeeded: usagePercentage > 85
    };
  }

  async getContextForNewMessage(conversationId: string): Promise<string> {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) return '';

    let context = '';

    // Add compressed context summary
    if (conversation.context.conversationSummary) {
      context += `Previous conversation summary: ${conversation.context.conversationSummary}\n\n`;
    }

    // Add key insights
    if (conversation.context.keyInsights.length > 0) {
      context += `Key insights from our discussion:\n${conversation.context.keyInsights.map(insight => `- ${insight}`).join('\n')}\n\n`;
    }

    // Add business context
    if (conversation.context.businessContext.targetCustomer) {
      context += `Target customer: ${conversation.context.businessContext.targetCustomer}\n`;
    }
    if (conversation.context.businessContext.challenges?.length) {
      context += `Current challenges: ${conversation.context.businessContext.challenges.join(', ')}\n`;
    }

    // Add user profile context
    context += `User: ${conversation.context.userProfile.name} (${conversation.context.userProfile.role}) at ${conversation.context.userProfile.company}\n`;
    if (conversation.context.userProfile.industry) {
      context += `Industry: ${conversation.context.userProfile.industry}\n`;
    }

    return context;
  }

  updateSettings(newSettings: Partial<MemorySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  getSettings(): MemorySettings {
    return { ...this.settings };
  }

  // Private helper methods
  private initializeContext(userContext?: any): CompressedContext {
    return {
      userProfile: {
        name: userContext?.name || 'User',
        company: userContext?.companyName || '',
        industry: userContext?.industry || '',
        role: userContext?.jobTitle || '',
        goals: []
      },
      businessContext: {
        targetCustomer: '',
        challenges: [],
        budget: '',
        timeframe: ''
      },
      conversationSummary: '',
      keyInsights: [],
      nextActions: [],
      researchConducted: []
    };
  }

  private async updateContext(conversation: ConversationMemory, message: ChatMessage): Promise<void> {
    // Extract insights from the message
    if (message.role === 'user') {
      // Extract business context from user messages
      this.extractBusinessContext(conversation.context, message.content);
    } else if (message.role === 'assistant') {
      // Extract key insights and action items from assistant messages
      this.extractAssistantInsights(conversation.context, message.content);
    }

    // Update research conducted if metadata contains research data
    if (message.metadata?.researchData) {
      conversation.context.researchConducted.push(
        `Research conducted: ${message.metadata.researchData.type || 'General research'}`
      );
    }
  }

  private extractBusinessContext(context: CompressedContext, content: string): void {
    const lowerContent = content.toLowerCase();
    
    // Extract budget mentions
    const budgetMatch = content.match(/budget.*?[\$\d,]+/i);
    if (budgetMatch) {
      context.businessContext.budget = budgetMatch[0];
    }

    // Extract timeframe mentions
    const timeframes = ['month', 'quarter', 'year', 'week', 'asap', 'urgent'];
    timeframes.forEach(timeframe => {
      if (lowerContent.includes(timeframe)) {
        context.businessContext.timeframe = timeframe;
      }
    });

    // Extract challenges
    const challengeKeywords = ['problem', 'challenge', 'issue', 'difficult', 'struggle'];
    challengeKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        const sentence = this.extractSentenceContaining(content, keyword);
        if (sentence && !context.businessContext.challenges?.includes(sentence)) {
          context.businessContext.challenges?.push(sentence);
        }
      }
    });
  }

  private extractAssistantInsights(context: CompressedContext, content: string): void {
    // Extract key insights from assistant responses
    const insights = this.extractListItems(content, ['insight', 'key point', 'important', 'strategy']);
    insights.forEach(insight => {
      if (!context.keyInsights.includes(insight)) {
        context.keyInsights.push(insight);
      }
    });

    // Extract next actions
    const actions = this.extractListItems(content, ['next step', 'action', 'recommend', 'should']);
    actions.forEach(action => {
      if (!context.nextActions.includes(action)) {
        context.nextActions.push(action);
      }
    });
  }

  private extractSentenceContaining(text: string, keyword: string): string | null {
    const sentences = text.split(/[.!?]+/);
    const sentence = sentences.find(s => s.toLowerCase().includes(keyword.toLowerCase()));
    return sentence?.trim() || null;
  }

  private extractListItems(text: string, keywords: string[]): string[] {
    const items: string[] = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      keywords.forEach(keyword => {
        if (line.toLowerCase().includes(keyword.toLowerCase()) && 
            (line.includes('-') || line.includes('•') || line.includes('*'))) {
          items.push(line.replace(/^[-•*]\s*/, '').trim());
        }
      });
    });

    return items;
  }

  private estimateTokenCount(messages: ChatMessage[]): number {
    // Rough estimation: ~4 characters per token
    const totalChars = messages.reduce((total, message) => total + message.content.length, 0);
    return Math.ceil(totalChars / 4);
  }

  private async createMessagesSummary(messages: ChatMessage[]): Promise<string> {
    // Simple summarization - in production, could use AI for better summaries
    const userMessages = messages.filter(m => m.role === 'user');
    const assistantMessages = messages.filter(m => m.role === 'assistant');

    let summary = '';
    
    if (userMessages.length > 0) {
      summary += `User discussed: ${userMessages.map(m => m.content.substring(0, 100)).join('; ')}\n`;
    }
    
    if (assistantMessages.length > 0) {
      summary += `Assistant provided: ${assistantMessages.map(m => m.content.substring(0, 100)).join('; ')}`;
    }

    return summary;
  }

  private extractKeyInsights(messages: ChatMessage[]): string[] {
    const insights: string[] = [];
    
    messages.forEach(message => {
      if (message.role === 'assistant') {
        // Extract bullet points and numbered lists
        const lines = message.content.split('\n');
        lines.forEach(line => {
          if (line.match(/^[-•*\d+\.]\s+/)) {
            const insight = line.replace(/^[-•*\d+\.]\s+/, '').trim();
            if (insight.length > 10 && insight.length < 200) {
              insights.push(insight);
            }
          }
        });
      }
    });

    return insights.slice(0, 10); // Keep top 10 insights
  }

  // Persistence methods (mock implementation - use database in production)
  private async persistConversation(conversationId: string): Promise<void> {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) return;

      if (typeof window !== 'undefined') {
        localStorage.setItem(`conversation_${conversationId}`, JSON.stringify({
          ...conversation,
          createdAt: conversation.createdAt.toISOString(),
          lastUpdated: conversation.lastUpdated.toISOString(),
          messages: conversation.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString()
          }))
        }));
      }
    } catch (error) {
      console.error('Error persisting conversation:', error);
    }
  }

  private async loadConversation(conversationId: string): Promise<ConversationMemory | null> {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`conversation_${conversationId}`);
        if (stored) {
          const data = JSON.parse(stored);
          const conversation: ConversationMemory = {
            ...data,
            createdAt: new Date(data.createdAt),
            lastUpdated: new Date(data.lastUpdated),
            messages: data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          };
          
          this.conversations.set(conversationId, conversation);
          return conversation;
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
    
    return null;
  }

  private async removePersistedConversation(conversationId: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`conversation_${conversationId}`);
      }
    } catch (error) {
      console.error('Error removing persisted conversation:', error);
    }
  }
}

export const memoryService = new MemoryService();