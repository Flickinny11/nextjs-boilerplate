"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users,
  TrendingUp,
  Bell,
  MessageSquare,
  BarChart3,
  Lightbulb,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Mail,
  Calendar,
  Share2,
  Zap,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { 
  ManagerDashboardData,
  EmployeeCard,
  ManagerAlert,
  CollaborationOpportunity,
  PerformanceInsight
} from '@/lib/organizationTypes'

interface ManagerConsoleProps {
  organizationId: string;
  managerId: string;
}

export default function ManagerConsole({ organizationId, managerId }: ManagerConsoleProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('daily')
  const [dashboardData, setDashboardData] = useState<ManagerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [organizationId, managerId, timeFilter])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/manager-console/dashboard?orgId=${organizationId}&managerId=${managerId}&timeFilter=${timeFilter}`, {
        headers: {
          'x-user-id': 'demo-manager-123' // Would come from auth context
        }
      })
      const data = await response.json()
      setDashboardData(data.data)
    } catch (error) {
      console.error('Error loading manager dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeQuickAction = async (alertId: string, actionId: string) => {
    try {
      await fetch('/api/manager-console/quick-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-manager-123'
        },
        body: JSON.stringify({
          alertId,
          actionId,
          organizationId,
          managerId
        })
      })
      // Reload data to reflect changes
      loadDashboardData()
    } catch (error) {
      console.error('Error executing quick action:', error)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'improving':
        return <ArrowUp className="w-4 h-4 text-green-400" />
      case 'down':
      case 'declining':
        return <ArrowDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500 bg-red-500/10'
      case 'high':
        return 'border-orange-500 bg-orange-500/10'
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10'
      default:
        return 'border-gray-600 bg-gray-600/10'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Manager Console</h2>
        <p className="text-gray-400">No team data available</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Manager Console
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor, assist, and optimize your team's performance
          </p>
        </div>
        
        {/* Time Filter */}
        <div className="flex gap-2">
          {(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const).map((filter) => (
            <Button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              variant={timeFilter === filter ? 'default' : 'outline'}
              size="sm"
              className={timeFilter === filter ? 'bg-blue-600' : 'border-gray-600'}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Team Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-gray-400 text-sm">Team Members</p>
              <p className="text-white text-2xl font-bold">{dashboardData.teamOverview.totalEmployees}</p>
              <p className="text-green-400 text-xs">{dashboardData.teamOverview.activeToday} active today</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-gray-400 text-sm">Performance Score</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${getPerformanceColor(dashboardData.teamOverview.teamPerformanceScore)}`}>
                  {dashboardData.teamOverview.teamPerformanceScore}%
                </p>
                {getTrendIcon(dashboardData.teamOverview.improvementTrend)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-gray-400 text-sm">Smart Alerts</p>
              <p className="text-white text-2xl font-bold">{dashboardData.smartAlerts.length}</p>
              <p className="text-orange-400 text-xs">
                {dashboardData.smartAlerts.filter(a => a.priority === 'high' || a.priority === 'urgent').length} high priority
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-gray-400 text-sm">Opportunities</p>
              <p className="text-white text-2xl font-bold">{dashboardData.collaborationOpportunities.length}</p>
              <p className="text-purple-400 text-xs">collaboration chances</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border-gray-700">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Smart Alerts
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.employeeCards.map((employee) => (
              <motion.div
                key={employee.employeeId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-colors">
                  {/* Employee Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {employee.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{employee.name}</h3>
                      <p className="text-gray-400 text-sm">{employee.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          employee.status === 'active' ? 'bg-green-400' : 
                          employee.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-xs text-gray-400 capitalize">{employee.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getPerformanceColor(employee.performanceScore)}`}>
                        {employee.performanceScore}%
                      </div>
                      <div className="text-xs text-gray-400">performance</div>
                    </div>
                  </div>

                  {/* Today's Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">CRM Updates</span>
                      <span className="text-white font-medium">{employee.todayStats.crmUpdates}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Leads Added</span>
                      <span className="text-white font-medium">{employee.todayStats.leadsAdded}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Media Created</span>
                      <span className="text-white font-medium">{employee.todayStats.mediaCreated}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Services Used</span>
                      <span className="text-white font-medium">{employee.todayStats.servicesUsed.length}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 border-gray-600">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600">
                      <Calendar className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Alerts & Opportunities Badges */}
                  {(employee.alerts > 0 || employee.opportunities > 0) && (
                    <div className="flex gap-2 mt-3">
                      {employee.alerts > 0 && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                          {employee.alerts} alert{employee.alerts !== 1 ? 's' : ''}
                        </span>
                      )}
                      {employee.opportunities > 0 && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          {employee.opportunities} opportunity{employee.opportunities !== 1 ? 'ies' : 'y'}
                        </span>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Team Performance Overview</h2>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{dashboardData.teamOverview.totalCRMUpdates}</div>
                <div className="text-gray-400 text-sm">Total CRM Updates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{dashboardData.teamOverview.totalLeadsAdded}</div>
                <div className="text-gray-400 text-sm">Total Leads Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{dashboardData.teamOverview.totalMediaCreated}</div>
                <div className="text-gray-400 text-sm">Total Media Created</div>
              </div>
            </div>

            {/* Employee Performance Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-gray-400 font-medium">Employee</th>
                    <th className="text-right py-3 text-gray-400 font-medium">Performance</th>
                    <th className="text-right py-3 text-gray-400 font-medium">CRM Updates</th>
                    <th className="text-right py-3 text-gray-400 font-medium">Leads Added</th>
                    <th className="text-right py-3 text-gray-400 font-medium">Media Created</th>
                    <th className="text-right py-3 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.employeeCards.map((employee) => (
                    <tr key={employee.employeeId} className="border-b border-gray-800">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{employee.name}</div>
                            <div className="text-gray-400 text-sm">{employee.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`font-bold ${getPerformanceColor(employee.performanceScore)}`}>
                          {employee.performanceScore}%
                        </span>
                      </td>
                      <td className="py-3 text-right text-white">{employee.todayStats.crmUpdates}</td>
                      <td className="py-3 text-right text-white">{employee.todayStats.leadsAdded}</td>
                      <td className="py-3 text-right text-white">{employee.todayStats.mediaCreated}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          employee.status === 'away' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Smart Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            {dashboardData.smartAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className={`p-6 border-2 ${getPriorityColor(alert.priority)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {alert.priority === 'urgent' && <Zap className="w-4 h-4 text-red-400" />}
                          {alert.priority === 'high' && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                          {alert.priority === 'medium' && <Bell className="w-4 h-4 text-yellow-400" />}
                          {alert.priority === 'low' && <Lightbulb className="w-4 h-4 text-blue-400" />}
                          <span className={`text-xs font-medium uppercase tracking-wide ${
                            alert.priority === 'urgent' ? 'text-red-400' :
                            alert.priority === 'high' ? 'text-orange-400' :
                            alert.priority === 'medium' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">{alert.title}</h3>
                      <p className="text-gray-300 mb-3">{alert.description}</p>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                        <p className="text-blue-400 text-sm font-medium">💡 Suggestion:</p>
                        <p className="text-blue-300 text-sm">{alert.actionSuggestion}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    {alert.quickActions.map((action) => (
                      <Button
                        key={action.id}
                        size="sm"
                        onClick={() => executeQuickAction(alert.id, action.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {action.type === 'send_message' && <MessageSquare className="w-3 h-3 mr-1" />}
                        {action.type === 'schedule_meeting' && <Calendar className="w-3 h-3 mr-1" />}
                        {action.type === 'share_resource' && <Share2 className="w-3 h-3 mr-1" />}
                        {action.type === 'introduce_employees' && <UserPlus className="w-3 h-3 mr-1" />}
                        {action.type === 'send_template' && <Mail className="w-3 h-3 mr-1" />}
                        {action.label}
                      </Button>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600"
                    >
                      Dismiss
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {/* Performance Insights */}
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Performance Insights</h2>
            <div className="space-y-4">
              {dashboardData.performanceInsights.map((insight) => (
                <div key={insight.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium">{insight.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                      insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <p className="text-purple-400 text-sm font-medium">🎯 Recommendation:</p>
                    <p className="text-purple-300 text-sm">{insight.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Collaboration Opportunities */}
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Collaboration Opportunities</h2>
            <div className="space-y-4">
              {dashboardData.collaborationOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium">{opportunity.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      opportunity.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                      opportunity.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {opportunity.urgency} urgency
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{opportunity.description}</p>
                  <p className="text-blue-400 text-sm mb-3">
                    <strong>Potential Impact:</strong> {opportunity.potentialImpact}
                  </p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
                    <p className="text-green-400 text-sm font-medium">🚀 Suggested Action:</p>
                    <p className="text-green-300 text-sm">{opportunity.suggestedAction}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>Involves {opportunity.employeesInvolved.length} employee{opportunity.employeesInvolved.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}