"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Target,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { crmService } from '@/lib/crmService'
import type { CRMDashboardMetrics } from '@/lib/crmTypes'

export default function CRMDashboard() {
  const [metrics, setMetrics] = useState<CRMDashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await crmService.getDashboardMetrics()
      if (response.success && response.data) {
        setMetrics(response.data)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      // Fallback to mock data if API fails
      const mockMetrics: CRMDashboardMetrics = {
        contacts: {
          total: 1250,
          new: 45,
          qualified: 320,
          converted: 185
        },
        deals: {
          total: 89,
          totalValue: 425000,
          averageValue: 4775,
          closedWon: 23,
          closedLost: 12,
          inProgress: 54
        },
        activities: {
          total: 234,
          completed: 156,
          overdue: 12,
          upcoming: 66
        },
        performance: {
          conversionRate: 14.8,
          avgSalesCycle: 32,
          winRate: 65.7,
          avgDealSize: 4775
        }
      }
      setMetrics(mockMetrics)
    } finally {
      setLoading(false)
    }
  }

  const dashboardCards = [
    {
      title: 'Total Contacts',
      value: metrics?.contacts.total || 0,
      change: '+12%',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Active Deals',
      value: metrics?.deals.inProgress || 0,
      change: '+8%',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Pipeline Value',
      value: `$${((metrics?.deals.totalValue || 0) / 1000).toFixed(0)}K`,
      change: '+15%',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Upcoming Activities',
      value: metrics?.activities.upcoming || 0,
      change: '+5%',
      icon: Calendar,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ]

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
            CRM Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your sales pipeline and customer relationships
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/crm/contacts">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Contacts
            </Button>
          </Link>
          <Link href="/crm/deals">
            <Button className="bg-green-600 hover:bg-green-700">
              <Target className="w-4 h-4 mr-2" />
              Deals
            </Button>
          </Link>
          <Link href="/crm/pipeline">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Pipeline
            </Button>
          </Link>
          <Link href="/crm/activities">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Calendar className="w-4 h-4 mr-2" />
              Activities
            </Button>
          </Link>
          <Link href="/crm/reports">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </Link>
          <Link href="/crm/settings">
            <Button variant="outline" className="border-gray-600">
              <Users className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : card.value.toLocaleString()}
                  </p>
                  <p className="text-green-500 text-sm mt-1">
                    {card.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
      >
        {/* Recent Contacts */}
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Contacts</h3>
            <Link href="/crm/contacts">
              <Button variant="outline" size="sm" className="border-gray-600">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {String.fromCharCode(65 + i)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Contact {i}</p>
                  <p className="text-gray-400 text-sm">contact{i}@example.com</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                  New
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Activities</h3>
            <Link href="/crm/activities">
              <Button variant="outline" size="sm" className="border-gray-600">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { type: 'call', text: 'Called John Doe', time: '2 hours ago' },
              { type: 'email', text: 'Emailed Jane Smith', time: '4 hours ago' },
              { type: 'meeting', text: 'Meeting with Tech Corp', time: '1 day ago' }
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.text}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {metrics?.performance.conversionRate.toFixed(1)}%
              </p>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {metrics?.performance.avgSalesCycle}
              </p>
              <p className="text-gray-400 text-sm">Avg Sales Cycle (days)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">
                {metrics?.performance.winRate.toFixed(1)}%
              </p>
              <p className="text-gray-400 text-sm">Win Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">
                ${metrics?.performance.avgDealSize.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm">Avg Deal Size</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}