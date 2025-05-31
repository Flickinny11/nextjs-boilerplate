"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Clock, 
  Users, 
  Settings, 
  Play,
  CheckCircle,
  AlertCircle,
  Brain,
  Zap
} from 'lucide-react';
import { 
  messageSummarizationService, 
  SummarizationSettings,
  MessageSummary 
} from '@/lib/messageSummarizationService';

export function MessageSummarizationSettings() {
  const [settings, setSettings] = useState<SummarizationSettings>(
    messageSummarizationService.getSettings()
  );
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunResults, setLastRunResults] = useState<MessageSummary[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Load initial settings
    setSettings(messageSummarizationService.getSettings());
  }, []);

  const handleSettingChange = (key: keyof SummarizationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    messageSummarizationService.updateSettings(newSettings);
  };

  const handleManualRun = async () => {
    setIsRunning(true);
    try {
      const results = await messageSummarizationService.triggerManualSummarization();
      setLastRunResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Manual summarization failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center mb-2">
          <Brain className="w-6 h-6 mr-2 text-purple-400" />
          AI Message Summarization
        </h2>
        <p className="text-gray-400">
          Automatically analyze and summarize email and SMS communications for your CRM contacts
        </p>
      </div>

      {/* Main Settings */}
      <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Automation Settings
        </h3>

        <div className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium text-white">Enable AI Summarization</Label>
              <p className="text-sm text-gray-400">
                Automatically generate daily summaries of contact communications
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
            />
          </div>

          {/* Daily Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-300">Daily Summary Time</Label>
              <Input
                type="time"
                value={settings.dailyTime}
                onChange={(e) => handleSettingChange('dailyTime', e.target.value)}
                className="bg-gray-800 border-gray-700 mt-1"
                disabled={!settings.enabled}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {formatTime(settings.dailyTime)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300">Max Days to Analyze</Label>
              <Select
                value={settings.maxDaysBack.toString()}
                onValueChange={(value) => handleSettingChange('maxDaysBack', parseInt(value))}
                disabled={!settings.enabled}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Advanced Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Include Sentiment Analysis</Label>
                  <p className="text-xs text-gray-500">Analyze emotional tone of messages</p>
                </div>
                <Switch
                  checked={settings.includeSentiment}
                  onCheckedChange={(checked) => handleSettingChange('includeSentiment', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Suggest Next Actions</Label>
                  <p className="text-xs text-gray-500">AI-generated follow-up suggestions</p>
                </div>
                <Switch
                  checked={settings.includeNextActions}
                  onCheckedChange={(checked) => handleSettingChange('includeNextActions', checked)}
                  disabled={!settings.enabled}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300">Minimum Messages Required</Label>
              <Select
                value={settings.minMessageCount.toString()}
                onValueChange={(value) => handleSettingChange('minMessageCount', parseInt(value))}
                disabled={!settings.enabled}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 message</SelectItem>
                  <SelectItem value="2">2 messages</SelectItem>
                  <SelectItem value="3">3 messages</SelectItem>
                  <SelectItem value="5">5 messages</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Only contacts with this many messages will be summarized
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Manual Run */}
      <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          Manual Execution
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300">Run summarization now for all contacts</p>
            <p className="text-sm text-gray-500">
              This will analyze recent messages and create summary reports in your CRM
            </p>
          </div>
          <Button
            onClick={handleManualRun}
            disabled={isRunning || !settings.enabled}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Now
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results Display */}
      {showResults && lastRunResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Summary Results ({lastRunResults.length} contacts processed)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{lastRunResults.length}</div>
                <div className="text-sm text-gray-300">Summaries Generated</div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {lastRunResults.reduce((sum, r) => sum + r.emailCount, 0)}
                </div>
                <div className="text-sm text-gray-300">Emails Analyzed</div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {lastRunResults.reduce((sum, r) => sum + r.smsCount, 0)}
                </div>
                <div className="text-sm text-gray-300">SMS Analyzed</div>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-3">
              {lastRunResults.map((summary) => (
                <div
                  key={summary.contactId}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{summary.contactName}</h4>
                      <p className="text-sm text-gray-400">{summary.contactEmail}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>{summary.emailCount} emails, {summary.smsCount} SMS</div>
                      <div className={`capitalize ${
                        summary.sentiment === 'positive' ? 'text-green-400' :
                        summary.sentiment === 'negative' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {summary.sentiment}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 truncate">{summary.summary}</p>
                  {summary.keyTopics.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {summary.keyTopics.slice(0, 3).map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-500/10 text-blue-300 rounded"
                        >
                          {topic}
                        </span>
                      ))}
                      {summary.keyTopics.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-500/10 text-gray-400 rounded">
                          +{summary.keyTopics.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <Button
                onClick={() => window.open('/crm/activities', '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                View Reports in CRM
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Info Card */}
      <Card className="p-6 bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">How It Works</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Analyzes email and SMS communications for each CRM contact</li>
              <li>• Uses AI to identify key topics, sentiment, and suggested actions</li>
              <li>• Automatically creates detailed call reports in your CRM</li>
              <li>• Runs daily at your specified time, or manually on-demand</li>
              <li>• Respects excluded contacts and minimum message requirements</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}