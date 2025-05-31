"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff,
  Mic, 
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff,
  Settings,
  Users,
  MessageCircle,
  Hand,
  Smile,
  Camera,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  MoreVertical,
  Share2,
  Download,
  Upload,
  Zap,
  Brain,
  Globe,
  Eye,
  Palette,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Star
} from 'lucide-react';
import { 
  captureITCallsService,
  CaptureITCallsRoom,
  CaptureITCallsUser,
  CallMessage,
  AITranscription,
  VirtualBackground,
  GestureCommand
} from '@/lib/captureItCallsService';

interface CaptureITCallsProps {
  roomId?: string;
  onCallEnd?: () => void;
}

export function CaptureITCalls({ roomId, onCallEnd }: CaptureITCallsProps) {
  const [currentRoom, setCurrentRoom] = useState<CaptureITCallsRoom | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState<CallMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [transcriptions, setTranscriptions] = useState<AITranscription[]>([]);
  const [virtualBackgrounds, setVirtualBackgrounds] = useState<VirtualBackground[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string>('none');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiInsights, setAIInsights] = useState<string[]>([]);
  const [handRaised, setHandRaised] = useState(false);
  const [reactions, setReactions] = useState<Map<string, string>>(new Map());

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeCall();
    return () => {
      captureITCallsService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (roomId) {
      joinExistingRoom(roomId);
    }
  }, [roomId]);

  useEffect(() => {
    // Setup event listeners
    const handleRemoteStream = (event: CustomEvent) => {
      const { userId, stream } = event.detail;
      setRemoteStreams(prev => new Map(prev.set(userId, stream)));
      
      // Update video element
      const videoElement = remoteVideoRefs.current.get(userId);
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    };

    const handleUserJoined = (event: CustomEvent) => {
      const user: CaptureITCallsUser = event.detail;
      if (currentRoom) {
        setCurrentRoom(prev => prev ? {
          ...prev,
          participants: [...prev.participants, user]
        } : null);
      }
    };

    const handleUserLeft = (event: CustomEvent) => {
      const userId: string = event.detail;
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
      
      if (currentRoom) {
        setCurrentRoom(prev => prev ? {
          ...prev,
          participants: prev.participants.filter(p => p.id !== userId)
        } : null);
      }
    };

    const handleMessage = (event: CustomEvent) => {
      const message: CallMessage = event.detail;
      setChatMessages(prev => [...prev, message]);
      
      // Auto-scroll chat
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    };

    const handleTranscription = (event: CustomEvent) => {
      const transcription: AITranscription = event.detail;
      setTranscriptions(prev => [...prev, transcription]);
    };

    const handleAIInsight = (event: CustomEvent) => {
      const insight: string = event.detail;
      setAIInsights(prev => [...prev, insight]);
    };

    window.addEventListener('captureItCalls:remoteStream', handleRemoteStream as EventListener);
    window.addEventListener('captureItCalls:userJoined', handleUserJoined as EventListener);
    window.addEventListener('captureItCalls:userLeft', handleUserLeft as EventListener);
    window.addEventListener('captureItCalls:message', handleMessage as EventListener);
    window.addEventListener('captureItCalls:transcription', handleTranscription as EventListener);
    window.addEventListener('captureItCalls:aiInsight', handleAIInsight as EventListener);

    return () => {
      window.removeEventListener('captureItCalls:remoteStream', handleRemoteStream as EventListener);
      window.removeEventListener('captureItCalls:userJoined', handleUserJoined as EventListener);
      window.removeEventListener('captureItCalls:userLeft', handleUserLeft as EventListener);
      window.removeEventListener('captureItCalls:message', handleMessage as EventListener);
      window.removeEventListener('captureItCalls:transcription', handleTranscription as EventListener);
      window.removeEventListener('captureItCalls:aiInsight', handleAIInsight as EventListener);
    };
  }, [currentRoom]);

  const initializeCall = async () => {
    try {
      const connected = await captureITCallsService.connect('current-user-id', 'auth-token');
      setIsConnected(connected);
      
      if (connected) {
        const stream = captureITCallsService.getLocalStream();
        setLocalStream(stream);
        
        if (localVideoRef.current && stream) {
          localVideoRef.current.srcObject = stream;
        }

        // Load virtual backgrounds
        const backgrounds = captureITCallsService.getVirtualBackgrounds();
        setVirtualBackgrounds(backgrounds);
      }
    } catch (error) {
      console.error('Failed to initialize call:', error);
    }
  };

  const joinExistingRoom = async (roomId: string) => {
    try {
      const room = await captureITCallsService.joinRoom(roomId, {
        name: 'Current User',
        isHost: false,
        isMuted: false,
        isCameraOn: true,
        isScreenSharing: false
      });
      setCurrentRoom(room);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const createNewRoom = async () => {
    try {
      const room = await captureITCallsService.createRoom({
        name: 'CaptureIT Call',
        hostId: 'current-user-id',
        description: 'AI-powered video call'
      });
      setCurrentRoom(room);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const toggleMute = async () => {
    const muted = await captureITCallsService.toggleMute();
    setIsMuted(muted);
  };

  const toggleCamera = async () => {
    const cameraOff = await captureITCallsService.toggleCamera();
    setIsCameraOn(!cameraOff);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await captureITCallsService.stopScreenShare();
      setIsScreenSharing(false);
    } else {
      const success = await captureITCallsService.startScreenShare();
      setIsScreenSharing(success);
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim()) {
      captureITCallsService.sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const sendReaction = (emoji: string) => {
    captureITCallsService.sendReaction(emoji);
    setReactions(prev => new Map(prev.set('current-user-id', emoji)));
    
    // Clear reaction after 3 seconds
    setTimeout(() => {
      setReactions(prev => {
        const newMap = new Map(prev);
        newMap.delete('current-user-id');
        return newMap;
      });
    }, 3000);
  };

  const raiseHand = () => {
    setHandRaised(!handRaised);
    captureITCallsService.sendReaction(handRaised ? '✋' : '');
  };

  const endCall = async () => {
    await captureITCallsService.leaveRoom();
    setCurrentRoom(null);
    setLocalStream(null);
    setRemoteStreams(new Map());
    onCallEnd?.();
  };

  const setVirtualBackground = async (backgroundId: string) => {
    await captureITCallsService.setVirtualBackground(backgroundId);
    setSelectedBackground(backgroundId);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Connecting to CaptureIT Calls</h3>
            <p className="text-gray-400 mb-6">Please wait while we establish connection...</p>
            <div className="flex space-x-4">
              <Button onClick={createNewRoom} className="bg-blue-600 hover:bg-blue-700">
                <Video className="w-4 h-4 mr-2" />
                Start New Call
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0">
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Call Interface */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-lg border-b border-gray-800"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{currentRoom?.name || 'CaptureIT Call'}</h1>
              <p className="text-sm text-gray-400">
                {currentRoom?.participants.length || 0} participants • {currentRoom?.aiFeatures.transcription.enabled ? 'AI Enhanced' : 'Standard'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* AI Insights Badge */}
            {aiInsights.length > 0 && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Brain className="w-3 h-3 mr-1" />
                {aiInsights.length} AI Insights
              </Badge>
            )}
            
            {/* Recording Indicator */}
            {currentRoom?.settings.allowRecording && (
              <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30 animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                Recording
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-black/50 border-gray-700"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {/* Local Video */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-black/50 rounded-lg overflow-hidden border border-gray-800 backdrop-blur-lg"
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* User Info Overlay */}
              <div className="absolute bottom-3 left-3 bg-black/70 rounded px-2 py-1">
                <span className="text-sm text-white font-medium">You</span>
                {isMuted && <MicOff className="w-3 h-3 text-red-400 ml-1 inline" />}
              </div>

              {/* Hand Raised Indicator */}
              {handRaised && (
                <div className="absolute top-3 right-3 bg-yellow-500 rounded-full p-2 animate-bounce">
                  <Hand className="w-4 h-4 text-black" />
                </div>
              )}

              {/* Reaction Display */}
              <AnimatePresence>
                {reactions.get('current-user-id') && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
                  >
                    {reactions.get('current-user-id')}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Camera Off Overlay */}
              {!isCameraOn && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Camera Off</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Remote Videos */}
            {currentRoom?.participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-black/50 rounded-lg overflow-hidden border border-gray-800 backdrop-blur-lg"
              >
                <video
                  ref={(ref) => {
                    if (ref) {
                      remoteVideoRefs.current.set(participant.id, ref);
                      const stream = remoteStreams.get(participant.id);
                      if (stream) {
                        ref.srcObject = stream;
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Participant Info */}
                <div className="absolute bottom-3 left-3 bg-black/70 rounded px-2 py-1">
                  <span className="text-sm text-white font-medium">{participant.name}</span>
                  {participant.isMuted && <MicOff className="w-3 h-3 text-red-400 ml-1 inline" />}
                  {participant.isScreenSharing && <Monitor className="w-3 h-3 text-blue-400 ml-1 inline" />}
                </div>

                {/* Host Badge */}
                {participant.isHost && (
                  <div className="absolute top-3 left-3 bg-blue-500 rounded px-2 py-1">
                    <span className="text-xs text-white font-medium">Host</span>
                  </div>
                )}

                {/* Camera Off Placeholder */}
                {!participant.isCameraOn && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xl font-bold">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{participant.name}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls Bar */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center p-6 bg-black/30 backdrop-blur-lg border-t border-gray-800"
        >
          <div className="flex items-center space-x-4">
            {/* Microphone */}
            <Button
              onClick={toggleMute}
              size="lg"
              className={`rounded-full w-12 h-12 ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            {/* Camera */}
            <Button
              onClick={toggleCamera}
              size="lg"
              className={`rounded-full w-12 h-12 ${
                !isCameraOn 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            {/* Screen Share */}
            <Button
              onClick={toggleScreenShare}
              size="lg"
              className={`rounded-full w-12 h-12 ${
                isScreenSharing 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </Button>

            {/* Reactions */}
            <div className="flex space-x-1">
              <Button
                onClick={() => sendReaction('👍')}
                size="sm"
                variant="outline"
                className="bg-black/50 border-gray-700 hover:bg-gray-600"
              >
                👍
              </Button>
              <Button
                onClick={() => sendReaction('👎')}
                size="sm"
                variant="outline"
                className="bg-black/50 border-gray-700 hover:bg-gray-600"
              >
                👎
              </Button>
              <Button
                onClick={() => sendReaction('❤️')}
                size="sm"
                variant="outline"
                className="bg-black/50 border-gray-700 hover:bg-gray-600"
              >
                ❤️
              </Button>
              <Button
                onClick={() => sendReaction('😂')}
                size="sm"
                variant="outline"
                className="bg-black/50 border-gray-700 hover:bg-gray-600"
              >
                😂
              </Button>
            </div>

            {/* Hand Raise */}
            <Button
              onClick={raiseHand}
              size="lg"
              className={`rounded-full w-12 h-12 ${
                handRaised 
                  ? 'bg-yellow-500 hover:bg-yellow-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Hand className="w-5 h-5" />
            </Button>

            {/* Chat */}
            <Button
              onClick={() => setShowChat(!showChat)}
              size="lg"
              className={`rounded-full w-12 h-12 ${
                showChat 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              {chatMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chatMessages.length}
                </span>
              )}
            </Button>

            {/* Participants */}
            <Button
              onClick={() => setShowParticipants(!showParticipants)}
              size="lg"
              className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600"
            >
              <Users className="w-5 h-5" />
            </Button>

            {/* Settings */}
            <Button
              onClick={() => setShowSettings(!showSettings)}
              size="lg"
              className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* End Call */}
            <Button
              onClick={endCall}
              size="lg"
              className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600 ml-8"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-lg border-l border-gray-800 z-50"
          >
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Chat</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChat(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {chatMessages.map((message) => (
                  <div key={message.id} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white text-sm">{message.userName}</span>
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{message.message}</p>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type a message..."
                    className="bg-gray-800 border-gray-700"
                  />
                  <Button onClick={sendChatMessage} size="sm">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Participants Sidebar */}
      <AnimatePresence>
        {showParticipants && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-lg border-l border-gray-800 z-50"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    Participants ({(currentRoom?.participants.length || 0) + 1})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowParticipants(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* Current User */}
                <div className="flex items-center space-x-3 p-2 bg-gray-800/30 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">Y</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">You</p>
                    <p className="text-gray-400 text-xs">Host</p>
                  </div>
                  <div className="flex space-x-1">
                    {isMuted && <MicOff className="w-4 h-4 text-red-400" />}
                    {!isCameraOn && <VideoOff className="w-4 h-4 text-red-400" />}
                  </div>
                </div>

                {/* Other Participants */}
                {currentRoom?.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3 p-2 bg-gray-800/30 rounded-lg">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{participant.name}</p>
                      <p className="text-gray-400 text-xs">
                        {participant.isHost ? 'Host' : 'Participant'}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {participant.isMuted && <MicOff className="w-4 h-4 text-red-400" />}
                      {!participant.isCameraOn && <VideoOff className="w-4 h-4 text-red-400" />}
                      {participant.isScreenSharing && <Monitor className="w-4 h-4 text-blue-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Call Settings</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                {/* Virtual Backgrounds */}
                <div>
                  <h4 className="text-white font-medium mb-2">Virtual Backgrounds</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={selectedBackground === 'none' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVirtualBackground('none')}
                      className="aspect-square"
                    >
                      None
                    </Button>
                    {virtualBackgrounds.map((bg) => (
                      <Button
                        key={bg.id}
                        variant={selectedBackground === bg.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setVirtualBackground(bg.id)}
                        className="aspect-square p-1"
                      >
                        <img
                          src={bg.thumbnail}
                          alt={bg.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* AI Features */}
                <div>
                  <h4 className="text-white font-medium mb-2">AI Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Real-time Transcription</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        <Brain className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Language Translation</span>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                        <Globe className="w-3 h-3 mr-1" />
                        Auto
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Smart Camera</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        <Eye className="w-3 h-3 mr-1" />
                        Enhanced
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Transcription Overlay */}
      {transcriptions.length > 0 && currentRoom?.aiFeatures.transcription.enabled && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-24 left-4 right-4 bg-black/80 backdrop-blur-lg rounded-lg p-4 border border-gray-800"
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Live Transcription</span>
          </div>
          <div className="max-h-20 overflow-y-auto">
            {transcriptions.slice(-3).map((transcription) => (
              <p key={transcription.id} className="text-white text-sm mb-1">
                <span className="text-blue-400 font-medium">{transcription.speakerName}:</span>{' '}
                {transcription.text}
              </p>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Insights Notification */}
      <AnimatePresence>
        {aiInsights.length > 0 && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-20 right-4 bg-purple-500/20 backdrop-blur-lg rounded-lg p-4 border border-purple-500/30 max-w-sm"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-medium">AI Insight</span>
            </div>
            <p className="text-white text-sm">{aiInsights[aiInsights.length - 1]}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}