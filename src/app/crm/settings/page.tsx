"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Settings,
  Save,
  Trash2,
  Plus,
  ExternalLink,
  Users,
  Database,
  Bell,
  Shield,
  Palette,
  Globe
} from 'lucide-react'

export default function CRMSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    general: {
      companyName: 'CaptureIT LS',
      defaultCurrency: 'USD',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      workingHours: {
        start: '09:00',
        end: '17:00'
      }
    },
    pipeline: {
      stages: [
        { id: 'stage_1', name: 'Prospecting', probability: 10, color: '#6B7280' },
        { id: 'stage_2', name: 'Qualification', probability: 25, color: '#3B82F6' },
        { id: 'stage_3', name: 'Proposal', probability: 50, color: '#EAB308' },
        { id: 'stage_4', name: 'Negotiation', probability: 75, color: '#F97316' },
        { id: 'stage_5', name: 'Closed Won', probability: 100, color: '#10B981' }
      ],
      rotting: 30 // days
    },
    integrations: {
      salesforce: { enabled: false, apiKey: '', baseUrl: '' },
      hubspot: { enabled: false, apiKey: '', baseUrl: '' },
      pipedrive: { enabled: false, apiKey: '', baseUrl: '' },
      slack: { enabled: false, webhookUrl: '' },
      zapier: { enabled: false, apiKey: '' }
    },
    notifications: {
      emailNotifications: true,
      dealReminders: true,
      activityReminders: true,
      weeklyReports: true,
      overdueAlerts: true
    },
    team: {
      users: [
        { id: 'user_1', name: 'John Smith', email: 'john@example.com', role: 'Admin' },
        { id: 'user_2', name: 'Jane Doe', email: 'jane@example.com', role: 'Sales Rep' },
        { id: 'user_3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Sales Rep' },
        { id: 'user_4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Manager' }
      ]
    }
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'pipeline', label: 'Pipeline', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    alert('Settings saved successfully!')
  }

  const addPipelineStage = () => {
    const newStage = {
      id: `stage_${Date.now()}`,
      name: 'New Stage',
      probability: 0,
      color: '#6B7280'
    }
    setSettings(prev => ({
      ...prev,
      pipeline: {
        ...prev.pipeline,
        stages: [...prev.pipeline.stages, newStage]
      }
    }))
  }

  const removePipelineStage = (stageId: string) => {
    setSettings(prev => ({
      ...prev,
      pipeline: {
        ...prev.pipeline,
        stages: prev.pipeline.stages.filter(stage => stage.id !== stageId)
      }
    }))
  }

  const updatePipelineStage = (stageId: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      pipeline: {
        ...prev.pipeline,
        stages: prev.pipeline.stages.map(stage =>
          stage.id === stageId ? { ...stage, [field]: value } : stage
        )
      }
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            CRM Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Configure your CRM system and integrations
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Company Name
                    </label>
                    <Input
                      value={settings.general.companyName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, companyName: e.target.value }
                      }))}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={settings.general.defaultCurrency}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, defaultCurrency: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, timezone: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, dateFormat: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Working Hours
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                      <Input
                        type="time"
                        value={settings.general.workingHours.start}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            workingHours: { ...prev.general.workingHours, start: e.target.value }
                          }
                        }))}
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Time</label>
                      <Input
                        type="time"
                        value={settings.general.workingHours.end}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            workingHours: { ...prev.general.workingHours, end: e.target.value }
                          }
                        }))}
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pipeline Settings */}
            {activeTab === 'pipeline' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Pipeline Settings</h2>
                  <Button onClick={addPipelineStage} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stage
                  </Button>
                </div>

                <div className="space-y-4">
                  {settings.pipeline.stages.map((stage, index) => (
                    <div key={stage.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Stage Name</label>
                          <Input
                            value={stage.name}
                            onChange={(e) => updatePipelineStage(stage.id, 'name', e.target.value)}
                            className="bg-gray-800 border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Probability (%)</label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={stage.probability}
                            onChange={(e) => updatePipelineStage(stage.id, 'probability', parseInt(e.target.value))}
                            className="bg-gray-800 border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color</label>
                          <Input
                            type="color"
                            value={stage.color}
                            onChange={(e) => updatePipelineStage(stage.id, 'color', e.target.value)}
                            className="bg-gray-800 border-gray-600 h-10"
                          />
                        </div>
                        <div className="flex justify-end">
                          {settings.pipeline.stages.length > 2 && (
                            <Button
                              onClick={() => removePipelineStage(stage.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Deal Rotting (days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.pipeline.rotting}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      pipeline: { ...prev.pipeline, rotting: parseInt(e.target.value) }
                    }))}
                    className="bg-gray-800 border-gray-600 w-32"
                    placeholder="30"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Deals will be marked as "rotting" after this many days without activity
                  </p>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">External Integrations</h2>
                
                {Object.entries(settings.integrations).map(([key, integration]) => (
                  <div key={key} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {key.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-white font-medium capitalize">{key}</h3>
                          <p className="text-gray-400 text-sm">
                            {integration.enabled ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={integration.enabled}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              integrations: {
                                ...prev.integrations,
                                [key]: { ...integration, enabled: e.target.checked }
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        {key !== 'slack' && key !== 'zapier' && (
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {integration.enabled && (
                      <div className="space-y-3">
                        {'apiKey' in integration && (
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">API Key</label>
                            <Input
                              type="password"
                              value={integration.apiKey}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                integrations: {
                                  ...prev.integrations,
                                  [key]: { ...integration, apiKey: e.target.value }
                                }
                              }))}
                              className="bg-gray-800 border-gray-600"
                              placeholder="Enter API key..."
                            />
                          </div>
                        )}
                        
                        {'baseUrl' in integration && (
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Base URL</label>
                            <Input
                              value={integration.baseUrl}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                integrations: {
                                  ...prev.integrations,
                                  [key]: { ...integration, baseUrl: e.target.value }
                                }
                              }))}
                              className="bg-gray-800 border-gray-600"
                              placeholder="https://..."
                            />
                          </div>
                        )}
                        
                        {'webhookUrl' in integration && (
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Webhook URL</label>
                            <Input
                              value={integration.webhookUrl}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                integrations: {
                                  ...prev.integrations,
                                  [key]: { ...integration, webhookUrl: e.target.value }
                                }
                              }))}
                              className="bg-gray-800 border-gray-600"
                              placeholder="https://..."
                            />
                          </div>
                        )}
                        
                        {key === 'slack' && (
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Webhook URL</label>
                            <Input
                              value={(integration as any).webhookUrl}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                integrations: {
                                  ...prev.integrations,
                                  [key]: { ...integration, webhookUrl: e.target.value }
                                }
                              }))}
                              className="bg-gray-800 border-gray-600"
                              placeholder="https://hooks.slack.com/..."
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div>
                        <h3 className="text-white font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {key === 'emailNotifications' && 'Receive email notifications for important events'}
                          {key === 'dealReminders' && 'Get reminders about upcoming deal activities'}
                          {key === 'activityReminders' && 'Notifications for scheduled activities and tasks'}
                          {key === 'weeklyReports' && 'Weekly performance and pipeline reports'}
                          {key === 'overdueAlerts' && 'Alerts for overdue tasks and activities'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [key]: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Management */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Team Management</h2>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite User
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 text-gray-400 font-medium">Name</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Role</th>
                        <th className="text-right py-3 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings.team.users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800">
                          <td className="py-3 text-white">{user.name}</td>
                          <td className="py-3 text-gray-400">{user.email}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' :
                              user.role === 'Manager' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20">
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="text-white font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="text-white font-medium mb-2">API Access</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Manage API keys and access tokens
                    </p>
                    <Button variant="outline" className="border-gray-600">
                      Manage API Keys
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="text-white font-medium mb-2">Data Export</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Export all your CRM data for backup or migration
                    </p>
                    <Button variant="outline" className="border-gray-600">
                      Export Data
                    </Button>
                  </div>

                  <div className="p-4 bg-red-900/20 rounded-lg border border-red-700">
                    <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Permanently delete all CRM data. This action cannot be undone.
                    </p>
                    <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-500/20">
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}