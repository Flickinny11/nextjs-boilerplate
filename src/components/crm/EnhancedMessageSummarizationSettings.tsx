"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Clock, 
  Users, 
  Settings, 
  Mail, 
  MessageCircle,
  Bot,
  CheckCircle,
  AlertCircle,
  Calendar,
  Zap
} from 'lucide-react';
import { 
  messageSummarizationService, 
  SummarizationSettings, 
  Contact, 
  MessageSummary 
} from '@/lib/enhancedMessageSummarizationService';

interface EnhancedMessageSummarizationSettingsProps {
  onSettingsChange?: (settings: SummarizationSettings) => void;
}

const AI_MODELS = [
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Recommended)', speed: 'Fast', quality: 'Excellent' },
  { id: 'openai/gpt-4', name: 'GPT-4', speed: 'Medium', quality: 'Excellent' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', speed: 'Very Fast', quality: 'Good' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', speed: 'Fast', quality: 'Good' }
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney'
];

export function EnhancedMessageSummarizationSettings({ 
  onSettingsChange 
}: EnhancedMessageSummarizationSettingsProps) {
  const [settings, setSettings] = useState<SummarizationSettings>(
    messageSummarizationService.getSettings()
  );
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [recentSummaries, setRecentSummaries] = useState<MessageSummary[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const currentContacts = messageSummarizationService.getContacts();
    const summaries = messageSummarizationService.getRecentSummaries(7);
    
    setContacts(currentContacts);
    setRecentSummaries(summaries);
  };

  const handleSettingChange = <K extends keyof SummarizationSettings>(
    key: K, 
    value: SummarizationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    messageSummarizationService.updateSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleContactToggle = (contactId: string, enabled: boolean) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      const updatedContact = { ...contact, isEnabled: enabled };
      messageSummarizationService.updateContact(updatedContact);
      setContacts(prev => prev.map(c => c.id === contactId ? updatedContact : c));
    }
  };

  const handleExcludeContact = (contactId: string, excluded: boolean) => {
    const newExcluded = excluded 
      ? [...settings.excludedContacts, contactId]
      : settings.excludedContacts.filter(id => id !== contactId);
    
    handleSettingChange('excludedContacts', newExcluded);
  };

  const handleRunNow = async () => {
    setIsRunning(true);
    try {
      const summaries = await messageSummarizationService.runDailySummarization();
      setRecentSummaries(prev => [...summaries, ...prev]);
      setLastRun(new Date());
    } catch (error) {
      console.error('Error running summarization:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Message Summarization</h2>
          <p className="text-gray-400">
            AI-powered daily summaries of email and SMS conversations with your CRM contacts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadData}
            className="border-gray-700"
          >
            Refresh
          </Button>
          <Button
            onClick={handleRunNow}
            disabled={isRunning || !settings.enabled}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isRunning ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Running...
              </div>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Now
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Basic Settings</h3>
          </div>

          <div className="space-y-4">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Enable Summarization</Label>
                <p className="text-xs text-gray-400">Turn on automatic message summarization</p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              />
            </div>

            {/* Schedule Time */}
            <div className="space-y-2">
              <Label className="text-white">Daily Summary Time</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={settings.summaryTime}
                  onChange={(e) => handleSettingChange('summaryTime', e.target.value)}
                  className="bg-gray-900 border-gray-700"
                />
                <span className="text-sm text-gray-400">
                  ({formatTime(settings.summaryTime)})
                </span>
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label className="text-white">Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => handleSettingChange('timezone', value)}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label className="text-white">Summary Frequency</Label>
              <Select 
                value={settings.summaryFrequency} 
                onValueChange={(value: any) => handleSettingChange('summaryFrequency', value)}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Message Sources */}
        <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Message Sources</h3>
          </div>

          <div className="space-y-4">
            {/* Include Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <div>
                  <Label className="text-white">Email Messages</Label>
                  <p className="text-xs text-gray-400">Include email conversations</p>
                </div>
              </div>
              <Switch
                checked={settings.includeEmail}
                onCheckedChange={(checked) => handleSettingChange('includeEmail', checked)}
              />
            </div>

            {/* Include SMS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-green-400" />
                <div>
                  <Label className="text-white">SMS Messages</Label>
                  <p className="text-xs text-gray-400">Include SMS conversations</p>
                </div>
              </div>
              <Switch
                checked={settings.includeSMS}
                onCheckedChange={(checked) => handleSettingChange('includeSMS', checked)}
              />
            </div>

            {/* Minimum Messages */}
            <div className="space-y-2">
              <Label className="text-white">Minimum Messages</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={settings.minMessagesThreshold}
                onChange={(e) => handleSettingChange('minMessagesThreshold', parseInt(e.target.value) || 1)}
                className="bg-gray-900 border-gray-700"
              />
              <p className="text-xs text-gray-400">
                Minimum messages required to generate a summary
              </p>
            </div>

            {/* AI Model */}
            <div className="space-y-2">
              <Label className="text-white">AI Model</Label>
              <Select 
                value={settings.aiModel} 
                onValueChange={(value) => handleSettingChange('aiModel', value)}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-gray-400">
                          Speed: {model.speed} • Quality: {model.quality}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Contact Management */}
      <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Contact Settings</h3>
        </div>

        {contacts.length > 0 ? (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-300">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{contact.name}</h4>
                    <p className="text-xs text-gray-400">{contact.email}</p>
                    {contact.lastSummaryDate && (
                      <p className="text-xs text-gray-500">
                        Last summary: {contact.lastSummaryDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={!settings.excludedContacts.includes(contact.id)}
                      onCheckedChange={(checked) => handleExcludeContact(contact.id, !checked)}
                    />
                    <Label className="text-sm text-gray-300">Include</Label>
                  </div>
                  <Switch
                    checked={contact.isEnabled}
                    onCheckedChange={(checked) => handleContactToggle(contact.id, checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h4 className="text-white font-medium mb-2">No Contacts Found</h4>
            <p className="text-gray-400 text-sm">
              Contacts will appear here once you sync your CRM data
            </p>
          </div>
        )}
      </Card>

      {/* Recent Summaries */}
      <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <Bot className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Recent Summaries</h3>
          {lastRun && (
            <span className="text-xs text-gray-400">
              Last run: {lastRun.toLocaleString()}
            </span>
          )}
        </div>

        {recentSummaries.length > 0 ? (
          <div className="space-y-3">
            {recentSummaries.slice(0, 5).map((summary) => {
              const contact = contacts.find(c => c.id === summary.contactId);
              return (
                <div key={summary.id} className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">
                        {contact?.name || 'Unknown Contact'}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {summary.date.toLocaleDateString()} • {summary.messageCount} messages
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        summary.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                        summary.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {summary.sentiment}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(summary.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{summary.summary}</p>
                  {summary.keyTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {summary.keyTopics.map((topic, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h4 className="text-white font-medium mb-2">No Summaries Yet</h4>
            <p className="text-gray-400 text-sm">
              Summaries will appear here after the first run
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}