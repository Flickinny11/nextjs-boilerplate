"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  Plus, 
  Calendar, 
  Check, 
  X, 
  ExternalLink,
  Clock,
  Users,
  Settings,
  Link2
} from 'lucide-react';
import { 
  videoConferencingService,
  VIDEO_PROVIDERS,
  VideoAccount,
  MeetingRequest,
  ScheduledMeeting 
} from '@/lib/videoConferencingService';

interface VideoConferencingProps {
  onMeetingScheduled?: (meeting: ScheduledMeeting) => void;
}

export function VideoConferencing({ onMeetingScheduled }: VideoConferencingProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<VideoAccount[]>([]);
  const [showProviders, setShowProviders] = useState(false);
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<VideoAccount | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<ScheduledMeeting[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [meetingForm, setMeetingForm] = useState<MeetingRequest>({
    title: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    attendees: [],
    agenda: '',
    description: ''
  });
  const [attendeeInput, setAttendeeInput] = useState('');

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  useEffect(() => {
    if (connectedAccounts.length > 0) {
      loadUpcomingMeetings();
    }
  }, [connectedAccounts]);

  const loadConnectedAccounts = () => {
    const accounts = videoConferencingService.getConnectedAccounts();
    setConnectedAccounts(accounts);
  };

  const loadUpcomingMeetings = async () => {
    const allMeetings: ScheduledMeeting[] = [];
    
    for (const account of connectedAccounts) {
      try {
        const meetings = await videoConferencingService.getMeetings(account.id);
        allMeetings.push(...meetings);
      } catch (error) {
        console.error(`Failed to load meetings for ${account.email}:`, error);
      }
    }

    // Sort by start time
    allMeetings.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    setUpcomingMeetings(allMeetings.slice(0, 10)); // Show next 10 meetings
  };

  const handleProviderConnect = async (providerId: string) => {
    setIsConnecting(true);
    try {
      const authUrl = await videoConferencingService.initiateOAuthFlow(providerId);
      
      // Open OAuth window
      const popup = window.open(
        authUrl,
        'video_oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for OAuth completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          setShowProviders(false);
          loadConnectedAccounts();
        }
      }, 1000);
    } catch (error) {
      console.error('Provider connection error:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    const success = await videoConferencingService.disconnectAccount(accountId);
    if (success) {
      loadConnectedAccounts();
    }
  };

  const handleAddAttendee = () => {
    if (attendeeInput.trim() && !meetingForm.attendees.includes(attendeeInput.trim())) {
      setMeetingForm(prev => ({
        ...prev,
        attendees: [...prev.attendees, attendeeInput.trim()]
      }));
      setAttendeeInput('');
    }
  };

  const handleRemoveAttendee = (email: string) => {
    setMeetingForm(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== email)
    }));
  };

  const handleScheduleMeeting = async () => {
    if (!selectedAccount) return;

    setIsScheduling(true);
    try {
      const scheduledMeeting = await videoConferencingService.scheduleMeeting(
        selectedAccount.id,
        meetingForm
      );

      if (onMeetingScheduled) {
        onMeetingScheduled(scheduledMeeting);
      }

      setShowScheduleMeeting(false);
      setMeetingForm({
        title: '',
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
        attendees: [],
        agenda: '',
        description: ''
      });
      
      loadUpcomingMeetings();
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getProviderIcon = (providerId: string) => {
    const provider = VIDEO_PROVIDERS.find(p => p.id === providerId);
    return provider?.icon || '📹';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Video Conferencing</h2>
          <p className="text-gray-400">Connect with Teams and Zoom to schedule meetings directly from CRM</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowProviders(true)}
            variant="outline"
            className="bg-gray-800 border-gray-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect Account
          </Button>
          {connectedAccounts.length > 0 && (
            <Button 
              onClick={() => setShowScheduleMeeting(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          )}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectedAccounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: account.provider.color + '20' }}
                  >
                    {account.provider.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{account.provider.name}</h3>
                    <p className="text-sm text-gray-400 truncate max-w-[150px]">{account.displayName}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{account.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {account.isConnected ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedAccount(account);
                    setShowScheduleMeeting(true);
                  }}
                  className="flex-1 text-xs"
                  disabled={!account.isConnected}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Schedule
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDisconnect(account.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}

        {connectedAccounts.length === 0 && (
          <div className="col-span-full">
            <Card className="p-8 bg-black/30 backdrop-blur-lg border-gray-800 border-dashed text-center">
              <Video className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Video Accounts Connected</h3>
              <p className="text-gray-500 mb-4">Connect your Teams or Zoom account to start scheduling meetings</p>
              <Button 
                onClick={() => setShowProviders(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect First Account
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Meetings
          </h3>
          
          <div className="space-y-3">
            {upcomingMeetings.map((meeting) => (
              <div
                key={`${meeting.provider}-${meeting.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-xl">{getProviderIcon(meeting.provider)}</div>
                  <div>
                    <h4 className="font-medium text-white">{meeting.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(meeting.startTime)}</span>
                      </div>
                      {meeting.attendees.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{meeting.attendees.length} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => window.open(meeting.joinUrl, '_blank')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Join
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Provider Selection Modal */}
      {showProviders && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowProviders(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Connect Video Platform</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowProviders(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {videoConferencingService.getAvailableProviders().map((provider) => (
                <Button
                  key={provider.id}
                  onClick={() => handleProviderConnect(provider.id)}
                  disabled={isConnecting}
                  className="w-full p-4 h-auto bg-black/50 hover:bg-black/70 border border-gray-700 hover:border-gray-600"
                  variant="outline"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: provider.color + '20' }}
                    >
                      {provider.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{provider.name}</div>
                      <div className="text-xs text-gray-400">
                        Schedule and join meetings directly
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            {videoConferencingService.getAvailableProviders().length === 0 && (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-400 mb-2">No Providers Configured</h4>
                <p className="text-sm text-gray-500">
                  Configure your Teams or Zoom OAuth credentials to enable video conferencing integration.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleMeeting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowScheduleMeeting(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Schedule Meeting</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowScheduleMeeting(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Meeting Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                  Meeting Title
                </Label>
                <Input
                  id="title"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-800 border-gray-700 mt-1"
                  placeholder="Enter meeting title"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-sm font-medium text-gray-300">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={meetingForm.startTime.toISOString().slice(0, 16)}
                    onChange={(e) => setMeetingForm(prev => ({ 
                      ...prev, 
                      startTime: new Date(e.target.value) 
                    }))}
                    className="bg-gray-800 border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="text-sm font-medium text-gray-300">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={meetingForm.endTime.toISOString().slice(0, 16)}
                    onChange={(e) => setMeetingForm(prev => ({ 
                      ...prev, 
                      endTime: new Date(e.target.value) 
                    }))}
                    className="bg-gray-800 border-gray-700 mt-1"
                  />
                </div>
              </div>

              {/* Attendees */}
              <div>
                <Label className="text-sm font-medium text-gray-300">Attendees</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={attendeeInput}
                    onChange={(e) => setAttendeeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAttendee()}
                    className="bg-gray-800 border-gray-700 flex-1"
                    placeholder="Enter email address"
                  />
                  <Button
                    type="button"
                    onClick={handleAddAttendee}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add
                  </Button>
                </div>
                {meetingForm.attendees.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {meetingForm.attendees.map((email) => (
                      <div
                        key={email}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-sm"
                      >
                        <span className="text-blue-300">{email}</span>
                        <button
                          onClick={() => handleRemoveAttendee(email)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Agenda */}
              <div>
                <Label htmlFor="agenda" className="text-sm font-medium text-gray-300">
                  Agenda
                </Label>
                <Textarea
                  id="agenda"
                  value={meetingForm.agenda}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, agenda: e.target.value }))}
                  className="bg-gray-800 border-gray-700 mt-1"
                  placeholder="Meeting agenda (optional)"
                  rows={3}
                />
              </div>

              {/* Account Selection */}
              {!selectedAccount && connectedAccounts.length > 1 && (
                <div>
                  <Label className="text-sm font-medium text-gray-300">Select Account</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    {connectedAccounts.map((account) => (
                      <Button
                        key={account.id}
                        onClick={() => setSelectedAccount(account)}
                        variant="outline"
                        className="p-3 h-auto bg-gray-800 border-gray-700 hover:border-gray-600"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{account.provider.icon}</span>
                          <div className="text-left">
                            <div className="text-sm font-medium">{account.provider.name}</div>
                            <div className="text-xs text-gray-400">{account.email}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowScheduleMeeting(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleMeeting}
                disabled={isScheduling || !meetingForm.title || !selectedAccount}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isScheduling ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}