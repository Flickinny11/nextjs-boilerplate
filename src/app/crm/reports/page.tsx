"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Users,
  Target,
  DollarSign,
  PieChart,
  LineChart
} from 'lucide-react'

interface ReportData {
  salesFunnel: {
    stage: string
    deals: number
    value: number
  }[]
  monthlyTrends: {
    month: string
    newDeals: number
    closedDeals: number
    revenue: number
  }[]
  teamPerformance: {
    user: string
    dealsWon: number
    revenue: number
    activities: number
  }[]
  conversionRates: {
    source: string
    leads: number
    converted: number
    rate: number
  }[]
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadReportData()
  }, [dateRange])

  const loadReportData = async () => {
    try {
      setLoading(true)
      
      // Mock report data
      const mockData: ReportData = {
        salesFunnel: [
          { stage: 'Prospecting', deals: 45, value: 225000 },
          { stage: 'Qualification', deals: 32, value: 480000 },
          { stage: 'Proposal', deals: 18, value: 540000 },
          { stage: 'Negotiation', deals: 12, value: 600000 },
          { stage: 'Closed Won', deals: 8, value: 400000 }
        ],
        monthlyTrends: [
          { month: 'Oct', newDeals: 23, closedDeals: 12, revenue: 145000 },
          { month: 'Nov', newDeals: 28, closedDeals: 15, revenue: 189000 },
          { month: 'Dec', newDeals: 31, closedDeals: 18, revenue: 234000 },
          { month: 'Jan', newDeals: 26, closedDeals: 14, revenue: 198000 }
        ],
        teamPerformance: [
          { user: 'John Smith', dealsWon: 8, revenue: 125000, activities: 45 },
          { user: 'Jane Doe', dealsWon: 6, revenue: 98000, activities: 38 },
          { user: 'Mike Johnson', dealsWon: 7, revenue: 110000, activities: 42 },
          { user: 'Sarah Wilson', dealsWon: 5, revenue: 85000, activities: 35 }
        ],
        conversionRates: [
          { source: 'Website', leads: 120, converted: 18, rate: 15.0 },
          { source: 'Referral', leads: 85, converted: 25, rate: 29.4 },
          { source: 'Cold Email', leads: 200, converted: 12, rate: 6.0 },
          { source: 'Social Media', leads: 95, converted: 14, rate: 14.7 },
          { source: 'Trade Show', leads: 60, converted: 22, rate: 36.7 }
        ]
      }
      
      setReportData(mockData)
    } catch (error) {
      console.error('Failed to load report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading reports...</p>
        </div>
      </div>
    )
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
            CRM Reports
          </h1>
          <p className="text-gray-400 mt-2">
            Analyze your sales performance and track key metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => exportReport('csv')}
            variant="outline" 
            className="border-gray-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            onClick={() => exportReport('pdf')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Date Range Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Date Range:</span>
          <Input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="bg-gray-900/50 border-gray-700 w-auto"
          />
          <span className="text-gray-400">to</span>
          <Input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="bg-gray-900/50 border-gray-700 w-auto"
          />
        </div>
      </motion.div>

      {/* Key Metrics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">$766K</p>
              <p className="text-green-500 text-sm">+23% vs last period</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Deals Closed</p>
              <p className="text-2xl font-bold text-white">59</p>
              <p className="text-green-500 text-sm">+15% vs last period</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">18.2%</p>
              <p className="text-green-500 text-sm">+2.1% vs last period</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/20">
              <Users className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Deal Size</p>
              <p className="text-2xl font-bold text-white">$12.9K</p>
              <p className="text-green-500 text-sm">+8% vs last period</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Funnel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Sales Funnel</h3>
            </div>
            <div className="space-y-4">
              {reportData?.salesFunnel.map((stage, index) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-300">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-medium">{stage.deals} deals</p>
                      <p className="text-gray-400 text-sm">${(stage.value / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(stage.deals / 45) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <LineChart className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Monthly Trends</h3>
            </div>
            <div className="space-y-4">
              {reportData?.monthlyTrends.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-gray-300 w-12">{month.month}</span>
                  <div className="flex-1 flex items-center gap-4 ml-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-400">New: {month.newDeals}</span>
                        <span className="text-green-400">Closed: {month.closedDeals}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${(month.closedDeals / month.newDeals) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right w-20">
                      <p className="text-white font-medium">${(month.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Team Performance & Conversion Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Team Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-400 font-medium">Team Member</th>
                    <th className="text-right py-2 text-gray-400 font-medium">Deals Won</th>
                    <th className="text-right py-2 text-gray-400 font-medium">Revenue</th>
                    <th className="text-right py-2 text-gray-400 font-medium">Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.teamPerformance.map((member, index) => (
                    <tr key={member.user} className="border-b border-gray-800">
                      <td className="py-3 text-white">{member.user}</td>
                      <td className="py-3 text-right text-green-400 font-medium">{member.dealsWon}</td>
                      <td className="py-3 text-right text-white">${(member.revenue / 1000).toFixed(0)}K</td>
                      <td className="py-3 text-right text-blue-400">{member.activities}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Conversion Rates by Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-orange-400" />
              <h3 className="text-xl font-semibold text-white">Conversion by Source</h3>
            </div>
            <div className="space-y-4">
              {reportData?.conversionRates.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <span className="text-gray-300">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="text-white">{source.converted}/{source.leads}</p>
                      <p className="text-gray-400">{source.rate.toFixed(1)}%</p>
                    </div>
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(source.rate * 2.5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}