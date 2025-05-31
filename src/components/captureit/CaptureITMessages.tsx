"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Mic,
  Camera,
  Phone,
  Video,
  Search,
  Filter,
  Settings,
  Star,
  Archive,
  Trash2,
  Edit3,
  Reply,
  Forward,
  Copy,
  Download,
  Upload,
  Globe,
  Lock,
  Shield,
  Brain,
  Zap,
  Clock,
  Check,
  CheckCheck,
  MoreVertical,
  User,
  Users,
  Hash,
  Bell,
  BellOff,
  Pin,
  Unpin,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  PlayCircle,
  PauseCircle,
  Loader2,
  AlertCircle,
  Info,
  Calendar,
  FileText,
  Image as ImageIcon,
  Music,
  Video as VideoIcon,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Laugh,
  Angry,
  Sad
} from 'lucide-react';
import { 
  captureITMessagesService,
  CaptureITConversation,
  CaptureITMessage,
  MessageType,
  ConversationType,
  VoiceMessage,
  MessageTemplate,
  MessageSearchResult
} from '@/lib/captureItMessagesService';

interface CaptureITMessagesProps {
  onCallInitiated?: (roomId: string) => void;
}

export function CaptureITMessages({ onCallInitiated }: CaptureITMessagesProps) {
  const [conversations, setConversations] = useState<CaptureITConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<CaptureITConversation | null>(null);
  const [messages, setMessages] = useState<CaptureITMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MessageSearchResult[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isTyping, setIsTyping] = useState<Map<string, boolean>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<CaptureITMessage | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordingDuration, setVoiceRecordingDuration] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'important' | 'media'>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);

  const reactionEmojis = ['👍', '👎', '❤️', '😂', '😮', '😢', '😡'];

  useEffect(() => {
    initializeMessaging();
    return () => {
      captureITMessagesService.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(selectedConversation.messages || []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Setup event listeners
    const handleConversationsLoaded = (event: CustomEvent) => {
      const loadedConversations: CaptureITConversation[] = event.detail;
      setConversations(loadedConversations);
      setIsLoading(false);
    };

    const handleMessageReceived = (event: CustomEvent) => {
      const message: CaptureITMessage = event.detail;
      if (selectedConversation && message.conversationId === selectedConversation.id) {
        setMessages(prev => [...prev, message]);
      }
      updateConversationWithMessage(message);
    };

    const handleMessageUpdated = (event: CustomEvent) => {
      const message: CaptureITMessage = event.detail;
      if (selectedConversation && message.conversationId === selectedConversation.id) {
        setMessages(prev => prev.map(m => m.id === message.id ? message : m));
      }
    };

    const handleTypingStatusChanged = (event: CustomEvent) => {
      const { conversationId, userId, isTyping: typing } = event.detail;
      if (selectedConversation && conversationId === selectedConversation.id) {
        setIsTyping(prev => new Map(prev.set(userId, typing)));
      }
    };

    const handleUserOnlineStatusChanged = (event: CustomEvent) => {
      const { userId, isOnline } = event.detail;
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (isOnline) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    };

    window.addEventListener('captureItMessages:conversationsLoaded', handleConversationsLoaded as EventListener);
    window.addEventListener('captureItMessages:messageReceived', handleMessageReceived as EventListener);
    window.addEventListener('captureItMessages:messageUpdated', handleMessageUpdated as EventListener);
    window.addEventListener('captureItMessages:typingStatusChanged', handleTypingStatusChanged as EventListener);
    window.addEventListener('captureItMessages:userOnlineStatusChanged', handleUserOnlineStatusChanged as EventListener);

    return () => {
      window.removeEventListener('captureItMessages:conversationsLoaded', handleConversationsLoaded as EventListener);
      window.removeEventListener('captureItMessages:messageReceived', handleMessageReceived as EventListener);
      window.removeEventListener('captureItMessages:messageUpdated', handleMessageUpdated as EventListener);
      window.removeEventListener('captureItMessages:typingStatusChanged', handleTypingStatusChanged as EventListener);
      window.removeEventListener('captureItMessages:userOnlineStatusChanged', handleUserOnlineStatusChanged as EventListener);
    };
  }, [selectedConversation]);

  const initializeMessaging = async () => {
    try {
      const connected = await captureITMessagesService.connect('current-user-id', 'auth-token');
      setIsConnected(connected);
      
      if (connected) {
        // Load templates
        const messageTemplates = captureITMessagesService.getMessageTemplates();
        setTemplates(messageTemplates);
      }
    } catch (error) {
      console.error('Failed to initialize messaging:', error);
      setIsLoading(false);
    }
  };

  const updateConversationWithMessage = (message: CaptureITMessage) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === message.conversationId) {
        return {
          ...conv,
          lastActivity: message.timestamp,
          metadata: {
            ...conv.metadata,
            totalMessages: conv.metadata.totalMessages + 1
          }
        };
      }
      return conv;
    }));
  };

  const createNewConversation = async (type: ConversationType, participants: string[], name?: string) => {
    try {
      const conversation = await captureITMessagesService.createConversation(
        type,
        participants,
        name
      );
      setConversations(prev => [conversation, ...prev]);
      setSelectedConversation(conversation);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || (!newMessage.trim() && attachments.length === 0)) return;

    try {
      const messageAttachments = await Promise.all(
        attachments.map(async (file) => ({
          id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: await uploadFile(file),
          metadata: {}
        }))
      );

      await captureITMessagesService.sendMessage(
        selectedConversation.id,
        newMessage,
        'text',
        messageAttachments
      );

      setNewMessage('');
      setAttachments([]);
      setAISuggestions([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob, duration: number) => {
    if (!selectedConversation) return;

    try {
      await captureITMessagesService.sendVoiceMessage(
        selectedConversation.id,
        audioBlob,
        duration
      );
    } catch (error) {
      console.error('Failed to send voice message:', error);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      voiceRecorderRef.current = mediaRecorder;
      voiceChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        voiceChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        sendVoiceMessage(audioBlob, voiceRecordingDuration);
        stream.getTracks().forEach(track => track.stop());
        setIsRecordingVoice(false);
        setVoiceRecordingDuration(0);
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);

      // Start duration timer
      const startTime = Date.now();
      const timer = setInterval(() => {
        setVoiceRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Stop timer when recording stops
      mediaRecorder.onstop = () => {
        clearInterval(timer);
        const audioBlob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        sendVoiceMessage(audioBlob, voiceRecordingDuration);
        stream.getTracks().forEach(track => track.stop());
        setIsRecordingVoice(false);
        setVoiceRecordingDuration(0);
      };
    } catch (error) {
      console.error('Failed to start voice recording:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (voiceRecorderRef.current && isRecordingVoice) {
      voiceRecorderRef.current.stop();
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await captureITMessagesService.addReaction(messageId, emoji);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Simulate file upload - in real implementation, upload to cloud storage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://storage.captureit.com/files/${Date.now()}_${file.name}`);
      }, 1000);
    });
  };

  const initiateCall = async (type: 'voice' | 'video') => {
    if (!selectedConversation) return;

    try {
      const roomId = await captureITMessagesService.initiateCall(selectedConversation.id, type);
      onCallInitiated?.(roomId);
    } catch (error) {
      console.error('Failed to initiate call:', error);
    }
  };

  const searchMessages = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await captureITMessagesService.searchMessages(
        searchQuery,
        selectedConversation?.id
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search messages:', error);
    }
  };

  const handleTyping = () => {
    if (selectedConversation) {
      captureITMessagesService.setTyping(selectedConversation.id, true);
      
      // Stop typing after 3 seconds of inactivity
      const timer = setTimeout(() => {
        captureITMessagesService.setTyping(selectedConversation.id, false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  };

  const getAISuggestions = async (content: string) => {
    // Simulate AI suggestions - in real implementation, call AI service
    if (content.toLowerCase().includes('meeting')) {
      setAISuggestions([
        'Would you like to schedule a meeting?',
        'Let me know what time works for you',
        'I can send you a calendar invite'
      ]);
    } else if (content.toLowerCase().includes('help')) {
      setAISuggestions([
        'I\'m happy to help!',
        'What specific assistance do you need?',
        'Let me connect you with the right person'
      ]);
    } else {
      setAISuggestions([]);
    }
  };

  const applyTemplate = (template: MessageTemplate) => {
    setNewMessage(template.content);
    setShowTemplates(false);
    messageInputRef.current?.focus();
  };

  const scheduleMessage = async (scheduledFor: Date) => {
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      await captureITMessagesService.scheduleMessage(
        selectedConversation.id,
        newMessage,
        scheduledFor
      );
      setNewMessage('');
    } catch (error) {
      console.error('Failed to schedule message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (type.startsWith('video/')) return <VideoIcon className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getConversationIcon = (type: ConversationType) => {
    switch (type) {
      case 'direct': return <User className="w-4 h-4" />;
      case 'group': return <Users className="w-4 h-4" />;
      case 'channel': return <Hash className="w-4 h-4" />;
      case 'customer-support': return <Info className="w-4 h-4" />;
      case 'sales-lead': return <Star className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Connecting to CaptureIT Messages</h3>
            <p className="text-gray-400">Loading your conversations...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-black/50 backdrop-blur-lg border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">CaptureIT Messages</h1>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="bg-black/50 border-gray-700"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="bg-black/50 border-gray-700"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4"
              >
                <div className="flex space-x-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchMessages()}
                    placeholder="Search messages..."
                    className="bg-gray-800 border-gray-700"
                  />
                  <Button onClick={searchMessages} size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Tabs */}
          <div className="flex space-x-1">
            {(['all', 'unread', 'important', 'media'] as const).map((filter) => (
              <Button
                key={filter}
                variant={messageFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMessageFilter(filter)}
                className="flex-1 text-xs"
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              className={`p-3 border-b border-gray-800/50 cursor-pointer transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-blue-500/20 border-blue-500/30' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                    {getConversationIcon(conversation.type)}
                  </div>
                  {onlineUsers.has(conversation.participants[0]?.userId) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white truncate">
                      {conversation.name || conversation.participants[0]?.name || 'Unknown'}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {formatTime(conversation.lastActivity)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.messages?.slice(-1)[0]?.content || 'No messages yet'}
                    </p>
                    
                    <div className="flex items-center space-x-1">
                      {conversation.settings.encryption && (
                        <Lock className="w-3 h-3 text-green-400" />
                      )}
                      {conversation.settings.aiAssistant && (
                        <Brain className="w-3 h-3 text-purple-400" />
                      )}
                      {conversation.metadata.totalMessages > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {conversation.metadata.totalMessages}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  {Array.from(isTyping.entries()).some(([userId, typing]) => 
                    typing && conversation.participants.some(p => p.userId === userId)
                  ) && (
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-100" />
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-200" />
                      </div>
                      <span className="text-xs text-blue-400">typing...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {conversations.length === 0 && (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Conversations</h3>
              <p className="text-gray-500 text-sm">Start a new conversation to begin messaging</p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-black/30 backdrop-blur-lg border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {getConversationIcon(selectedConversation.type)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {selectedConversation.name || 'Direct Message'}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>{selectedConversation.participants.length} participants</span>
                    {selectedConversation.settings.encryption && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-green-400" />
                          <span>Encrypted</span>
                        </div>
                      </>
                    )}
                    {selectedConversation.settings.aiAssistant && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Brain className="w-3 h-3 text-purple-400" />
                          <span>AI Enhanced</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => initiateCall('voice')}
                  className="bg-black/50 border-gray-700"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => initiateCall('video')}
                  className="bg-black/50 border-gray-700"
                >
                  <Video className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIAssistant(!showAIAssistant)}
                  className="bg-black/50 border-gray-700"
                >
                  <Brain className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/50 border-gray-700"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.senderId === 'current-user-id' ? 'order-2' : 'order-1'
                  }`}>
                    <div className={`rounded-lg p-3 ${
                      message.senderId === 'current-user-id'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-200'
                    }`}>
                      {/* Message Content */}
                      {message.type === 'text' && (
                        <p className="text-sm">{message.content}</p>
                      )}

                      {message.type === 'voice' && message.attachments[0] && (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <PlayCircle className="w-4 h-4" />
                          </Button>
                          <div className="flex-1">
                            <div className="flex space-x-1 items-center h-6">
                              {(message.attachments[0].metadata as VoiceMessage)?.waveform?.map((height, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-current opacity-70"
                                  style={{ height: `${height * 100}%` }}
                                />
                              ))}
                            </div>
                            <p className="text-xs opacity-70">
                              {Math.floor((message.attachments[0].metadata as VoiceMessage)?.duration / 60)}:
                              {String((message.attachments[0].metadata as VoiceMessage)?.duration % 60).padStart(2, '0')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* File Attachments */}
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="mt-2 p-2 bg-black/20 rounded border">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(attachment.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{attachment.name}</p>
                              <p className="text-xs opacity-70">{formatFileSize(attachment.size)}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Message Reactions */}
                      {message.reactions.length > 0 && (
                        <div className="flex space-x-1 mt-2">
                          {Array.from(new Set(message.reactions.map(r => r.emoji))).map((emoji) => {
                            const count = message.reactions.filter(r => r.emoji === emoji).length;
                            return (
                              <Button
                                key={emoji}
                                size="sm"
                                variant="outline"
                                className="text-xs h-6 px-2"
                                onClick={() => addReaction(message.id, emoji)}
                              >
                                {emoji} {count}
                              </Button>
                            );
                          })}
                        </div>
                      )}

                      {/* AI Features */}
                      {message.aiFeatures?.sentimentAnalysis && (
                        <div className="mt-2 p-1 bg-black/20 rounded text-xs opacity-70">
                          <div className="flex items-center space-x-1">
                            <Brain className="w-3 h-3" />
                            <span>Sentiment: {message.aiFeatures.sentimentAnalysis.label}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message Info */}
                    <div className={`flex items-center space-x-2 mt-1 text-xs text-gray-400 ${
                      message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.editedAt && <span>(edited)</span>}
                      {message.senderId === 'current-user-id' && (
                        <div className="flex items-center space-x-1">
                          {message.status.sent && <Check className="w-3 h-3" />}
                          {message.status.delivered && <CheckCheck className="w-3 h-3" />}
                          {message.status.read && <CheckCheck className="w-3 h-3 text-blue-400" />}
                        </div>
                      )}
                    </div>

                    {/* Quick Reactions */}
                    <div className="flex space-x-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {reactionEmojis.map((emoji) => (
                        <Button
                          key={emoji}
                          size="sm"
                          variant="outline"
                          className="text-xs h-6 w-6 p-0"
                          onClick={() => addReaction(message.id, emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* AI Suggestions */}
          <AnimatePresence>
            {aiSuggestions.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="px-4 py-2 bg-purple-500/10 border-t border-purple-500/20"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">AI Suggestions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => setNewMessage(suggestion)}
                      className="text-xs bg-purple-500/20 border-purple-500/30 text-purple-300"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Input */}
          <div className="p-4 bg-black/30 backdrop-blur-lg border-t border-gray-800">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-800 rounded p-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm text-gray-300 truncate max-w-32">{file.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeAttachment(index)}
                      className="w-6 h-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Voice Recording */}
            {isRecordingVoice && (
              <div className="mb-3 flex items-center space-x-3 bg-red-500/20 rounded p-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400">Recording... {voiceRecordingDuration}s</span>
                <Button
                  size="sm"
                  onClick={stopVoiceRecording}
                  className="bg-red-500 hover:bg-red-600 ml-auto"
                >
                  Stop
                </Button>
              </div>
            )}

            <div className="flex items-end space-x-2">
              {/* Message Templates */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="bg-black/50 border-gray-700"
              >
                <FileText className="w-4 h-4" />
              </Button>

              {/* File Upload */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-black/50 border-gray-700"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              {/* Voice Message */}
              <Button
                variant="outline"
                size="sm"
                onMouseDown={startVoiceRecording}
                onMouseUp={stopVoiceRecording}
                onMouseLeave={stopVoiceRecording}
                className="bg-black/50 border-gray-700"
              >
                <Mic className="w-4 h-4" />
              </Button>

              {/* Message Input */}
              <div className="flex-1 relative">
                <Textarea
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                    getAISuggestions(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="bg-gray-800 border-gray-700 resize-none"
                  rows={1}
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() && attachments.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-black/30">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Welcome to CaptureIT Messages</h3>
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Message Templates</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(false)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    onClick={() => applyTemplate(template)}
                    className="w-full text-left bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-400 truncate">{template.content}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}