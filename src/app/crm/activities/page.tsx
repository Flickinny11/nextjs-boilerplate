"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { crmService, formatDateTime, getActivityIcon, getPriorityColor } from '@/lib/crmService'
import type { CRMActivity, CRMListResponse } from '@/lib/crmTypes'

interface ActivitiesPageState {
  activities: CRMActivity[]
  loading: boolean
  searchTerm: string
  selectedActivities: string[]
  showCreateModal: boolean
}

// Mock activities for demonstration
const MOCK_ACTIVITIES: CRMActivity[] = [
  {
    id: 'activity_1',
    type: 'call',
    subject: 'Follow-up call with John Smith',
    description: 'Discuss proposal details and timeline',
    contactId: 'contact_1',
    scheduledAt: new Date('2024-01-25T10:00:00'),
    status: 'scheduled',
    priority: 'high',
    assignedTo: 'current-user',
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user'
  },
  {
    id: 'activity_2',
    type: 'email',
    subject: 'Send pricing information',
    description: 'Include detailed breakdown and terms',
    contactId: 'contact_2',
    dealId: 'deal_1',
    scheduledAt: new Date('2024-01-24T14:30:00'),
    completedAt: new Date('2024-01-24T14:45:00'),
    status: 'completed',
    priority: 'medium',
    assignedTo: 'current-user',
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user'
  },
  {
    id: 'activity_3',
    type: 'meeting',
    subject: 'Product demo with Tech Corp',
    description: 'Demonstrate key features and answer questions',
    contactId: 'contact_3',
    dealId: 'deal_2',
    scheduledAt: new Date('2024-01-26T16:00:00'),
    duration: 60,
    status: 'scheduled',
    priority: 'high',
    assignedTo: 'current-user',
    participants: ['john@example.com', 'jane@example.com'],
    meetingLink: 'https://zoom.us/j/123456789',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user'
  },
  {
    id: 'activity_4',
    type: 'task',
    subject: 'Prepare contract documents',
    description: 'Create customized contract for enterprise deal',
    dealId: 'deal_3',
    scheduledAt: new Date('2024-01-23T09:00:00'),
    status: 'overdue',
    priority: 'high',
    assignedTo: 'current-user',
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user'
  }
]

export default function ActivitiesPage() {
  const [state, setState] = useState<ActivitiesPageState>({
    activities: [],
    loading: true,
    searchTerm: '',
    selectedActivities: [],
    showCreateModal: false
  })

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      // Using mock data for demonstration
      setState(prev => ({ ...prev, activities: MOCK_ACTIVITIES }))
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const handleSearch = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }))
  }

  const filteredActivities = state.activities.filter(activity =>
    activity.subject.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    activity.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: CRMActivity['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (activity: CRMActivity) => {
    const isOverdue = activity.status === 'scheduled' && 
      activity.scheduledAt && 
      new Date(activity.scheduledAt) < new Date()

    if (isOverdue) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">Overdue</span>
    }

    switch (activity.status) {
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">Completed</span>
      case 'scheduled':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">Scheduled</span>
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">Cancelled</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500 text-white">Unknown</span>
    }
  }

  const getActivityMetrics = () => {
    const total = filteredActivities.length
    const completed = filteredActivities.filter(a => a.status === 'completed').length
    const scheduled = filteredActivities.filter(a => a.status === 'scheduled').length
    const overdue = filteredActivities.filter(a => 
      a.status === 'scheduled' && 
      a.scheduledAt && 
      new Date(a.scheduledAt) < new Date()
    ).length

    return { total, completed, scheduled, overdue }
  }

  const metrics = getActivityMetrics()

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
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
            Activities
          </h1>
          <p className="text-gray-400 mt-2">
            Track your tasks, calls, meetings, and follow-ups
          </p>
        </div>
        <Button 
          onClick={() => setState(prev => ({ ...prev, showCreateModal: true }))}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Activity
        </Button>
      </motion.div>

      {/* Activity Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Activities</p>
              <p className="text-xl font-bold text-white">{metrics.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-xl font-bold text-white">{metrics.completed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Scheduled</p>
              <p className="text-xl font-bold text-white">{metrics.scheduled}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Overdue</p>
              <p className="text-xl font-bold text-white">{metrics.overdue}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search activities..."
            value={state.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-700"
          />
        </div>
        <Button variant="outline" className="border-gray-600">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      {/* Activities List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        {state.loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <Card className="p-12 bg-gray-900/50 border-gray-700 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No activities found</h3>
            <p className="text-gray-400 mb-4">
              {state.searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first activity'}
            </p>
            <Button 
              onClick={() => setState(prev => ({ ...prev, showCreateModal: true }))}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Activity
            </Button>
          </Card>
        ) : (
          filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-6 bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-gray-800">
                      <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-white">{activity.subject}</h3>
                        {getStatusBadge(activity)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)} text-white`}>
                          {activity.priority}
                        </span>
                      </div>
                      
                      {activity.description && (
                        <p className="text-gray-400 mb-3">{activity.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        {activity.scheduledAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateTime(activity.scheduledAt)}</span>
                          </div>
                        )}
                        
                        {activity.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{activity.duration} minutes</span>
                          </div>
                        )}
                        
                        {activity.participants.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{activity.participants.length} participants</span>
                          </div>
                        )}
                        
                        {activity.meetingLink && (
                          <a 
                            href={activity.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(activity.status)}
                    <Button variant="ghost" size="sm">
                      <Clock className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}