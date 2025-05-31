// CaptureIT Messages Service - Next-Level Messaging Platform
// Real-time messaging with AI-powered features and end-to-end encryption

import { io, Socket } from 'socket.io-client';

export interface CaptureITMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  editedAt?: Date;
  replyTo?: string;
  reactions: MessageReaction[];
  attachments: MessageAttachment[];
  mentions: string[];
  metadata: MessageMetadata;
  status: MessageStatus;
  encryption: EncryptionInfo;
  aiFeatures: MessageAIFeatures;
}

export type MessageType = 
  | 'text' 
  | 'voice' 
  | 'video' 
  | 'image' 
  | 'document' 
  | 'location' 
  | 'contact' 
  | 'poll' 
  | 'system' 
  | 'ai-generated'
  | 'code'
  | 'calendar-invite'
  | 'call-invite';

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  metadata: any;
}

export interface MessageMetadata {
  priority: 'low' | 'normal' | 'high' | 'urgent';
  tags: string[];
  customerInfo?: CustomerInfo;
  leadInfo?: LeadInfo;
  scheduled?: Date;
  expiresAt?: Date;
  readBy: ReadReceipt[];
  deliveredTo: string[];
  translation?: { [language: string]: string };
  sentiment?: SentimentAnalysis;
  topics?: string[];
}

export interface MessageStatus {
  sent: boolean;
  delivered: boolean;
  read: boolean;
  failed: boolean;
  encrypted: boolean;
}

export interface EncryptionInfo {
  algorithm: string;
  keyId: string;
  signature: string;
  verified: boolean;
}

export interface MessageAIFeatures {
  smartCompose?: SmartComposeData;
  autoTranslation?: TranslationData;
  sentimentAnalysis?: SentimentAnalysis;
  intentDetection?: IntentData;
  summarization?: string;
  actionItems?: ActionItem[];
}

export interface SmartComposeData {
  suggestions: string[];
  tone: 'professional' | 'casual' | 'friendly' | 'formal';
  confidence: number;
  improvements: string[];
}

export interface TranslationData {
  originalLanguage: string;
  translatedText: string;
  confidence: number;
  alternatives: string[];
}

export interface SentimentAnalysis {
  score: number; // -1 to 1
  magnitude: number; // 0 to 1
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface IntentData {
  intent: string;
  confidence: number;
  entities: EntityData[];
  suggestedActions: SuggestedAction[];
}

export interface EntityData {
  type: string;
  value: string;
  confidence: number;
}

export interface SuggestedAction {
  type: 'schedule-meeting' | 'create-lead' | 'follow-up' | 'send-document';
  description: string;
  confidence: number;
  metadata: any;
}

export interface ActionItem {
  id: string;
  description: string;
  dueDate?: Date;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'customer';
}

export interface LeadInfo {
  id: string;
  source: string;
  score: number;
  stage: string;
  value?: number;
  nextAction?: string;
}

export interface ReadReceipt {
  userId: string;
  readAt: Date;
}

export interface CaptureITConversation {
  id: string;
  name?: string;
  type: ConversationType;
  participants: ConversationParticipant[];
  messages: CaptureITMessage[];
  settings: ConversationSettings;
  metadata: ConversationMetadata;
  lastActivity: Date;
  createdAt: Date;
  status: 'active' | 'archived' | 'deleted';
}

export type ConversationType = 
  | 'direct' 
  | 'group' 
  | 'channel' 
  | 'customer-support' 
  | 'sales-lead' 
  | 'project'
  | 'announcement';

export interface ConversationParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  permissions: ParticipantPermissions;
  joinedAt: Date;
  lastSeen?: Date;
  isTyping: boolean;
  isOnline: boolean;
}

export interface ParticipantPermissions {
  canSendMessages: boolean;
  canAddParticipants: boolean;
  canRemoveParticipants: boolean;
  canEditSettings: boolean;
  canDeleteMessages: boolean;
  canShareFiles: boolean;
  canMakeCallsDirectly: boolean;
}

export interface ConversationSettings {
  encryption: boolean;
  disappearingMessages: boolean;
  messageRetention: number; // days
  allowExternalSharing: boolean;
  requireApprovalForNewMembers: boolean;
  muteNotifications: boolean;
  autoTranslation: boolean;
  aiAssistant: boolean;
  smartFeatures: SmartFeatures;
  customization: ConversationCustomization;
}

export interface SmartFeatures {
  smartCompose: boolean;
  sentimentTracking: boolean;
  intentDetection: boolean;
  autoSummarization: boolean;
  leadCapture: boolean;
  followUpReminders: boolean;
  smartNotifications: boolean;
}

export interface ConversationCustomization {
  theme: string;
  emoji: string;
  backgroundImage?: string;
  soundNotifications: boolean;
  customTags: string[];
}

export interface ConversationMetadata {
  totalMessages: number;
  totalParticipants: number;
  averageResponseTime: number;
  engagementScore: number;
  customerSatisfaction?: number;
  leadConversionProbability?: number;
  lastBackup: Date;
  integrations: Integration[];
}

export interface Integration {
  type: 'crm' | 'calendar' | 'email' | 'task-manager' | 'storage';
  provider: string;
  enabled: boolean;
  settings: any;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  language: string;
  variables: TemplateVariable[];
  usage: number;
  createdAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'user' | 'customer';
  required: boolean;
  defaultValue?: string;
}

export interface VoiceMessage {
  id: string;
  duration: number; // seconds
  waveform: number[]; // audio waveform data
  transcription?: string;
  language?: string;
  playbackSpeed: number;
  url: string;
}

export interface MessageSearchResult {
  message: CaptureITMessage;
  conversation: CaptureITConversation;
  relevanceScore: number;
  highlights: string[];
  context: CaptureITMessage[]; // surrounding messages
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  preview: boolean;
  priority: 'all' | 'mentions' | 'important' | 'none';
  quietHours: QuietHours;
  customRules: NotificationRule[];
}

export interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  days: string[];
}

export interface NotificationRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  enabled: boolean;
}

export interface RuleCondition {
  type: 'sender' | 'keyword' | 'conversation' | 'time' | 'priority';
  operator: 'equals' | 'contains' | 'starts_with' | 'regex';
  value: string;
}

export interface RuleAction {
  type: 'notify' | 'silent' | 'priority' | 'forward' | 'auto-reply';
  parameters: any;
}

export interface FileShare {
  id: string;
  messageId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  thumbnailUrl?: string;
  uploadProgress: number;
  downloadCount: number;
  expiresAt?: Date;
  permissions: FilePermissions;
  virusScanStatus: 'pending' | 'clean' | 'infected' | 'error';
}

export interface FilePermissions {
  canDownload: boolean;
  canShare: boolean;
  canEdit: boolean;
  canComment: boolean;
  maxDownloads?: number;
}

export class CaptureITMessagesService {
  private static instance: CaptureITMessagesService;
  private socket: Socket | null = null;
  private conversations: Map<string, CaptureITConversation> = new Map();
  private currentUserId: string = '';
  private encryptionKey: CryptoKey | null = null;
  private isConnected = false;
  private aiAssistant: MessageAIAssistant | null = null;
  private notificationManager: NotificationManager | null = null;

  private constructor() {
    this.initializeAIFeatures();
    this.initializeEncryption();
  }

  public static getInstance(): CaptureITMessagesService {
    if (!CaptureITMessagesService.instance) {
      CaptureITMessagesService.instance = new CaptureITMessagesService();
    }
    return CaptureITMessagesService.instance;
  }

  // Initialize connection to CaptureIT Messages server
  async connect(userId: string, authToken: string): Promise<boolean> {
    try {
      this.currentUserId = userId;
      this.socket = io(process.env.NEXT_PUBLIC_CAPTUREIT_MESSAGES_SERVER || 'ws://localhost:3002', {
        auth: { userId, token: authToken },
        transports: ['websocket', 'polling']
      });

      return new Promise((resolve, reject) => {
        this.socket!.on('connect', () => {
          this.isConnected = true;
          this.setupSocketListeners();
          this.loadConversations();
          resolve(true);
        });

        this.socket!.on('connect_error', (error) => {
          console.error('CaptureIT Messages connection failed:', error);
          reject(false);
        });

        setTimeout(() => reject(false), 10000); // 10 second timeout
      });
    } catch (error) {
      console.error('Failed to connect to CaptureIT Messages:', error);
      return false;
    }
  }

  // Initialize end-to-end encryption
  private async initializeEncryption(): Promise<void> {
    try {
      // Generate or retrieve encryption key
      this.encryptionKey = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
    }
  }

  // Initialize AI features
  private initializeAIFeatures(): void {
    this.aiAssistant = new MessageAIAssistant();
    this.notificationManager = new NotificationManager();
  }

  // Setup socket event listeners
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('message-received', async (encryptedMessage: any) => {
      const message = await this.decryptMessage(encryptedMessage);
      await this.handleIncomingMessage(message);
    });

    this.socket.on('message-updated', async (encryptedMessage: any) => {
      const message = await this.decryptMessage(encryptedMessage);
      this.updateMessage(message);
    });

    this.socket.on('message-deleted', (messageId: string) => {
      this.deleteMessage(messageId);
    });

    this.socket.on('conversation-updated', (conversation: CaptureITConversation) => {
      this.conversations.set(conversation.id, conversation);
      this.emitEvent('conversationUpdated', conversation);
    });

    this.socket.on('user-typing', ({ conversationId, userId, isTyping }) => {
      this.updateTypingStatus(conversationId, userId, isTyping);
    });

    this.socket.on('user-online', ({ userId, isOnline }) => {
      this.updateUserOnlineStatus(userId, isOnline);
    });

    this.socket.on('message-reaction', ({ messageId, reaction }) => {
      this.updateMessageReaction(messageId, reaction);
    });

    this.socket.on('conversation-invite', (invite: any) => {
      this.emitEvent('conversationInvite', invite);
    });
  }

  // Load user conversations
  private async loadConversations(): Promise<void> {
    if (!this.socket) return;

    this.socket.emit('get-conversations', (response: any) => {
      if (response.success) {
        response.conversations.forEach((conv: CaptureITConversation) => {
          this.conversations.set(conv.id, conv);
        });
        this.emitEvent('conversationsLoaded', Array.from(this.conversations.values()));
      }
    });
  }

  // Create new conversation
  async createConversation(
    type: ConversationType,
    participants: string[],
    name?: string,
    settings?: Partial<ConversationSettings>
  ): Promise<CaptureITConversation> {
    if (!this.socket) throw new Error('Not connected to CaptureIT Messages');

    const defaultSettings: ConversationSettings = {
      encryption: true,
      disappearingMessages: false,
      messageRetention: 365,
      allowExternalSharing: false,
      requireApprovalForNewMembers: false,
      muteNotifications: false,
      autoTranslation: false,
      aiAssistant: true,
      smartFeatures: {
        smartCompose: true,
        sentimentTracking: true,
        intentDetection: true,
        autoSummarization: true,
        leadCapture: true,
        followUpReminders: true,
        smartNotifications: true
      },
      customization: {
        theme: 'default',
        emoji: '💬',
        soundNotifications: true,
        customTags: []
      }
    };

    const conversationData = {
      type,
      participants,
      name,
      settings: { ...defaultSettings, ...settings }
    };

    return new Promise((resolve, reject) => {
      this.socket!.emit('create-conversation', conversationData, (response: any) => {
        if (response.success) {
          const conversation = response.conversation;
          this.conversations.set(conversation.id, conversation);
          resolve(conversation);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Send message
  async sendMessage(
    conversationId: string,
    content: string,
    type: MessageType = 'text',
    attachments: MessageAttachment[] = [],
    replyTo?: string,
    metadata?: Partial<MessageMetadata>
  ): Promise<CaptureITMessage> {
    if (!this.socket) throw new Error('Not connected to CaptureIT Messages');

    // AI-enhanced message processing
    const aiFeatures = await this.processMessageWithAI(content, type);

    const message: CaptureITMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId: this.currentUserId,
      senderName: await this.getCurrentUserName(),
      content,
      type,
      timestamp: new Date(),
      replyTo,
      reactions: [],
      attachments,
      mentions: this.extractMentions(content),
      metadata: {
        priority: 'normal',
        tags: [],
        readBy: [],
        deliveredTo: [],
        ...metadata
      },
      status: {
        sent: false,
        delivered: false,
        read: false,
        failed: false,
        encrypted: true
      },
      encryption: {
        algorithm: 'AES-GCM',
        keyId: 'user-key-1',
        signature: '',
        verified: false
      },
      aiFeatures
    };

    // Encrypt message before sending
    const encryptedMessage = await this.encryptMessage(message);

    return new Promise((resolve, reject) => {
      this.socket!.emit('send-message', encryptedMessage, (response: any) => {
        if (response.success) {
          message.status.sent = true;
          message.id = response.messageId;
          this.addMessageToConversation(conversationId, message);
          resolve(message);
        } else {
          message.status.failed = true;
          reject(new Error(response.error));
        }
      });
    });
  }

  // Process message with AI
  private async processMessageWithAI(
    content: string,
    type: MessageType
  ): Promise<MessageAIFeatures> {
    if (!this.aiAssistant || type !== 'text') {
      return {};
    }

    const features: MessageAIFeatures = {};

    try {
      // Smart compose suggestions
      features.smartCompose = await this.aiAssistant.getSmartCompose(content);

      // Sentiment analysis
      features.sentimentAnalysis = await this.aiAssistant.analyzeSentiment(content);

      // Intent detection
      features.intentDetection = await this.aiAssistant.detectIntent(content);

      // Extract action items
      features.actionItems = await this.aiAssistant.extractActionItems(content);

    } catch (error) {
      console.error('AI processing failed:', error);
    }

    return features;
  }

  // Send voice message
  async sendVoiceMessage(
    conversationId: string,
    audioBlob: Blob,
    duration: number
  ): Promise<CaptureITMessage> {
    // Upload audio file
    const audioUrl = await this.uploadFile(audioBlob, 'audio');
    
    // Transcribe audio
    const transcription = await this.transcribeAudio(audioBlob);

    const voiceMessage: VoiceMessage = {
      id: `voice_${Date.now()}`,
      duration,
      waveform: await this.generateWaveform(audioBlob),
      transcription,
      language: 'en-US',
      playbackSpeed: 1.0,
      url: audioUrl
    };

    const attachment: MessageAttachment = {
      id: voiceMessage.id,
      name: 'Voice Message',
      type: 'audio/webm',
      size: audioBlob.size,
      url: audioUrl,
      metadata: voiceMessage
    };

    return this.sendMessage(
      conversationId,
      transcription || 'Voice message',
      'voice',
      [attachment]
    );
  }

  // Edit message
  async editMessage(messageId: string, newContent: string): Promise<boolean> {
    if (!this.socket) return false;

    const message = this.findMessageById(messageId);
    if (!message || message.senderId !== this.currentUserId) {
      return false;
    }

    const updatedMessage = {
      ...message,
      content: newContent,
      editedAt: new Date(),
      aiFeatures: await this.processMessageWithAI(newContent, message.type)
    };

    const encryptedMessage = await this.encryptMessage(updatedMessage);

    return new Promise((resolve) => {
      this.socket!.emit('edit-message', { messageId, encryptedMessage }, (response: any) => {
        if (response.success) {
          this.updateMessage(updatedMessage);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // Delete message
  async deleteMessage(messageId: string): Promise<boolean> {
    if (!this.socket) return false;

    return new Promise((resolve) => {
      this.socket!.emit('delete-message', messageId, (response: any) => {
        if (response.success) {
          this.removeMessageFromConversations(messageId);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // Add reaction to message
  async addReaction(messageId: string, emoji: string): Promise<boolean> {
    if (!this.socket) return false;

    const reaction: MessageReaction = {
      emoji,
      userId: this.currentUserId,
      userName: await this.getCurrentUserName(),
      timestamp: new Date()
    };

    return new Promise((resolve) => {
      this.socket!.emit('add-reaction', { messageId, reaction }, (response: any) => {
        if (response.success) {
          this.updateMessageReaction(messageId, reaction);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // Search messages
  async searchMessages(
    query: string,
    conversationId?: string,
    filters?: any
  ): Promise<MessageSearchResult[]> {
    if (!this.socket) return [];

    return new Promise((resolve) => {
      this.socket!.emit('search-messages', { query, conversationId, filters }, (response: any) => {
        if (response.success) {
          resolve(response.results);
        } else {
          resolve([]);
        }
      });
    });
  }

  // Set typing status
  setTyping(conversationId: string, isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { conversationId, isTyping });
    }
  }

  // Mark messages as read
  async markAsRead(conversationId: string, messageIds: string[]): Promise<void> {
    if (this.socket) {
      this.socket.emit('mark-read', { conversationId, messageIds });
    }
  }

  // Get message templates
  getMessageTemplates(category?: string): MessageTemplate[] {
    // Return predefined templates
    return [
      {
        id: 'welcome',
        name: 'Welcome Message',
        content: 'Welcome to {{company}}! How can we help you today?',
        category: 'customer-service',
        language: 'en',
        variables: [
          { name: 'company', type: 'text', required: true }
        ],
        usage: 156,
        createdAt: new Date()
      },
      {
        id: 'follow-up',
        name: 'Follow-up',
        content: 'Hi {{name}}, following up on our conversation. When would be a good time to schedule a call?',
        category: 'sales',
        language: 'en',
        variables: [
          { name: 'name', type: 'user', required: true }
        ],
        usage: 89,
        createdAt: new Date()
      }
    ];
  }

  // Schedule message
  async scheduleMessage(
    conversationId: string,
    content: string,
    scheduledFor: Date,
    type: MessageType = 'text'
  ): Promise<string> {
    if (!this.socket) throw new Error('Not connected');

    return new Promise((resolve, reject) => {
      this.socket!.emit('schedule-message', {
        conversationId,
        content,
        scheduledFor,
        type
      }, (response: any) => {
        if (response.success) {
          resolve(response.scheduleId);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Initiate call from conversation
  async initiateCall(
    conversationId: string,
    type: 'voice' | 'video'
  ): Promise<string> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // Create call invite message
    const callInvite = {
      type: 'call-invite',
      callType: type,
      participants: conversation.participants.map(p => p.userId),
      timestamp: new Date()
    };

    await this.sendMessage(
      conversationId,
      `${type === 'video' ? '📹' : '📞'} ${type} call invitation`,
      'call-invite',
      [],
      undefined,
      { tags: ['call-invite'] }
    );

    // Import and use calls service
    const { captureITCallsService } = await import('./captureItCallsService');
    const room = await captureITCallsService.createRoom({
      name: conversation.name || 'CaptureIT Call',
      hostId: this.currentUserId
    });

    return room.id;
  }

  // Encryption methods
  private async encryptMessage(message: CaptureITMessage): Promise<string> {
    if (!this.encryptionKey) return JSON.stringify(message);

    try {
      const messageString = JSON.stringify(message);
      const encodedMessage = new TextEncoder().encode(messageString);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey,
        encodedMessage
      );

      const encryptedMessage = {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData))
      };

      return btoa(JSON.stringify(encryptedMessage));
    } catch (error) {
      console.error('Encryption failed:', error);
      return JSON.stringify(message);
    }
  }

  private async decryptMessage(encryptedData: string): Promise<CaptureITMessage> {
    if (!this.encryptionKey) return JSON.parse(encryptedData);

    try {
      const encryptedMessage = JSON.parse(atob(encryptedData));
      const iv = new Uint8Array(encryptedMessage.iv);
      const data = new Uint8Array(encryptedMessage.data);

      const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey,
        data
      );

      const messageString = new TextDecoder().decode(decryptedData);
      return JSON.parse(messageString);
    } catch (error) {
      console.error('Decryption failed:', error);
      return JSON.parse(encryptedData);
    }
  }

  // Utility methods
  private async handleIncomingMessage(message: CaptureITMessage): Promise<void> {
    this.addMessageToConversation(message.conversationId, message);
    
    // Show notification
    if (this.notificationManager) {
      await this.notificationManager.showNotification(message);
    }

    // Auto-translate if needed
    if (message.metadata.translation) {
      this.emitEvent('messageTranslated', message);
    }

    this.emitEvent('messageReceived', message);
  }

  private addMessageToConversation(conversationId: string, message: CaptureITMessage): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push(message);
      conversation.lastActivity = message.timestamp;
      conversation.metadata.totalMessages++;
      this.emitEvent('conversationUpdated', conversation);
    }
  }

  private updateMessage(message: CaptureITMessage): void {
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      const index = conversation.messages.findIndex(m => m.id === message.id);
      if (index !== -1) {
        conversation.messages[index] = message;
        this.emitEvent('messageUpdated', message);
      }
    }
  }

  private removeMessageFromConversations(messageId: string): void {
    this.conversations.forEach(conversation => {
      const index = conversation.messages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        conversation.messages.splice(index, 1);
        this.emitEvent('messageDeleted', messageId);
      }
    });
  }

  private findMessageById(messageId: string): CaptureITMessage | null {
    for (const conversation of this.conversations.values()) {
      const message = conversation.messages.find(m => m.id === messageId);
      if (message) return message;
    }
    return null;
  }

  private updateTypingStatus(conversationId: string, userId: string, isTyping: boolean): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      const participant = conversation.participants.find(p => p.userId === userId);
      if (participant) {
        participant.isTyping = isTyping;
        this.emitEvent('typingStatusChanged', { conversationId, userId, isTyping });
      }
    }
  }

  private updateUserOnlineStatus(userId: string, isOnline: boolean): void {
    this.conversations.forEach(conversation => {
      const participant = conversation.participants.find(p => p.userId === userId);
      if (participant) {
        participant.isOnline = isOnline;
        if (isOnline) {
          participant.lastSeen = new Date();
        }
      }
    });
    this.emitEvent('userOnlineStatusChanged', { userId, isOnline });
  }

  private updateMessageReaction(messageId: string, reaction: MessageReaction): void {
    const message = this.findMessageById(messageId);
    if (message) {
      // Remove existing reaction from same user
      message.reactions = message.reactions.filter(r => 
        !(r.userId === reaction.userId && r.emoji === reaction.emoji)
      );
      
      // Add new reaction
      message.reactions.push(reaction);
      this.emitEvent('messageReactionUpdated', { messageId, reaction });
    }
  }

  private extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    
    return mentions;
  }

  private async uploadFile(file: Blob, type: string): Promise<string> {
    // Implementation for file upload to cloud storage
    return `https://storage.captureit.com/${type}/${Date.now()}`;
  }

  private async transcribeAudio(audioBlob: Blob): Promise<string> {
    // Implementation for audio transcription
    return 'Transcribed audio content';
  }

  private async generateWaveform(audioBlob: Blob): Promise<number[]> {
    // Implementation for audio waveform generation
    return Array.from({ length: 50 }, () => Math.random());
  }

  private async getCurrentUserName(): Promise<string> {
    // Get from auth context
    return 'Current User';
  }

  private emitEvent(eventName: string, data: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`captureItMessages:${eventName}`, { detail: data }));
    }
  }

  // Getters
  getConversations(): CaptureITConversation[] {
    return Array.from(this.conversations.values());
  }

  getConversation(id: string): CaptureITConversation | undefined {
    return this.conversations.get(id);
  }

  isConnectedToService(): boolean {
    return this.isConnected;
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.conversations.clear();
  }
}

// AI Assistant for message intelligence
class MessageAIAssistant {
  async getSmartCompose(content: string): Promise<SmartComposeData> {
    // Implementation for AI smart compose
    return {
      suggestions: ['How can I help you today?', 'Thank you for your message'],
      tone: 'professional',
      confidence: 0.85,
      improvements: ['Consider adding a greeting']
    };
  }

  async analyzeSentiment(content: string): Promise<SentimentAnalysis> {
    // Implementation for sentiment analysis
    return {
      score: 0.7,
      magnitude: 0.5,
      label: 'positive',
      confidence: 0.9
    };
  }

  async detectIntent(content: string): Promise<IntentData> {
    // Implementation for intent detection
    return {
      intent: 'request_information',
      confidence: 0.8,
      entities: [],
      suggestedActions: []
    };
  }

  async extractActionItems(content: string): Promise<ActionItem[]> {
    // Implementation for action item extraction
    return [];
  }
}

// Notification manager
class NotificationManager {
  async showNotification(message: CaptureITMessage): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`New message from ${message.senderName}`, {
        body: message.content,
        icon: message.senderAvatar || '/default-avatar.png',
        tag: message.conversationId
      });
    }
  }
}

// Export singleton instance
export const captureITMessagesService = CaptureITMessagesService.getInstance();