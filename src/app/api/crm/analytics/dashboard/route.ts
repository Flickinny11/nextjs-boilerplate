import { NextRequest, NextResponse } from 'next/server'
import { CRMDashboardMetrics, CRMResponse } from '@/lib/crmTypes'

// GET /api/crm/analytics/dashboard
export async function GET(request: NextRequest) {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return realistic mock data that changes based on time
    
    const now = new Date()
    const currentMonth = now.getMonth()
    const baseMetrics = {
      contacts: {
        total: 1250 + Math.floor(Math.random() * 100),
        new: 45 + Math.floor(Math.random() * 20),
        qualified: 320 + Math.floor(Math.random() * 50),
        converted: 185 + Math.floor(Math.random() * 30)
      },
      deals: {
        total: 89 + Math.floor(Math.random() * 20),
        totalValue: 425000 + Math.floor(Math.random() * 100000),
        averageValue: 4775 + Math.floor(Math.random() * 1000),
        closedWon: 23 + Math.floor(Math.random() * 10),
        closedLost: 12 + Math.floor(Math.random() * 5),
        inProgress: 54 + Math.floor(Math.random() * 15)
      },
      activities: {
        total: 234 + Math.floor(Math.random() * 50),
        completed: 156 + Math.floor(Math.random() * 30),
        overdue: 12 + Math.floor(Math.random() * 8),
        upcoming: 66 + Math.floor(Math.random() * 20)
      },
      performance: {
        conversionRate: 14.8 + Math.random() * 5,
        avgSalesCycle: 32 + Math.floor(Math.random() * 10),
        winRate: 65.7 + Math.random() * 10,
        avgDealSize: 4775 + Math.floor(Math.random() * 1000)
      }
    }

    // Adjust metrics based on current month for seasonal variation
    const seasonalFactor = Math.sin((currentMonth / 12) * 2 * Math.PI) * 0.1 + 1
    
    const metrics: CRMDashboardMetrics = {
      contacts: {
        ...baseMetrics.contacts,
        new: Math.floor(baseMetrics.contacts.new * seasonalFactor)
      },
      deals: {
        ...baseMetrics.deals,
        totalValue: Math.floor(baseMetrics.deals.totalValue * seasonalFactor),
        inProgress: Math.floor(baseMetrics.deals.inProgress * seasonalFactor)
      },
      activities: {
        ...baseMetrics.activities,
        upcoming: Math.floor(baseMetrics.activities.upcoming * seasonalFactor)
      },
      performance: {
        ...baseMetrics.performance,
        conversionRate: Math.round((baseMetrics.performance.conversionRate * seasonalFactor) * 10) / 10,
        winRate: Math.round((baseMetrics.performance.winRate * seasonalFactor) * 10) / 10
      }
    }

    const response: CRMResponse<CRMDashboardMetrics> = {
      success: true,
      data: metrics
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}