import { NextRequest, NextResponse } from 'next/server'
import { 
  ManagerDashboardData,
  EmployeeCard,
  ManagerAlert,
  CollaborationOpportunity,
  PerformanceInsight,
  TeamOverview,
  EmployeeDayStats,
  EmployeeWeekStats,
  EmployeeMonthStats,
  QuickAction
} from '@/lib/organizationTypes'

// GET /api/manager-console/dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const managerId = searchParams.get('managerId')
    const timeFilter = searchParams.get('timeFilter') || 'daily'

    // In a real application, this would fetch data from the database
    // For now, we'll return comprehensive mock data for the Manager Console

    // Generate realistic employee data
    const employees = [
      {
        id: 'emp_001',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        title: 'Senior Sales Representative',
        status: 'active' as const,
        basePerformance: 85
      },
      {
        id: 'emp_002',
        name: 'Michael Chen',
        email: 'michael@company.com',
        title: 'Sales Representative',
        status: 'active' as const,
        basePerformance: 92
      },
      {
        id: 'emp_003',
        name: 'Emily Rodriguez',
        email: 'emily@company.com',
        title: 'Junior Sales Representative',
        status: 'away' as const,
        basePerformance: 78
      },
      {
        id: 'emp_004',
        name: 'David Kim',
        email: 'david@company.com',
        title: 'Sales Representative',
        status: 'active' as const,
        basePerformance: 88
      },
      {
        id: 'emp_005',
        name: 'Lisa Thompson',
        email: 'lisa@company.com',
        title: 'Senior Sales Representative',
        status: 'offline' as const,
        basePerformance: 75
      }
    ]

    // Generate employee cards with realistic data
    const employeeCards: EmployeeCard[] = employees.map(emp => {
      const todayMultiplier = timeFilter === 'daily' ? 1 : timeFilter === 'weekly' ? 5 : 20
      const performanceVariation = Math.random() * 10 - 5 // -5 to +5 variation
      
      return {
        employeeId: emp.id,
        name: emp.name,
        email: emp.email,
        title: emp.title,
        status: emp.status,
        lastActive: new Date(Date.now() - Math.random() * 3600000), // Within last hour
        performanceScore: Math.max(0, Math.min(100, emp.basePerformance + performanceVariation)),
        alerts: Math.floor(Math.random() * 3),
        opportunities: Math.floor(Math.random() * 4),
        todayStats: {
          crmUpdates: Math.floor(Math.random() * 15 * todayMultiplier) + 5,
          leadsAdded: Math.floor(Math.random() * 8 * todayMultiplier) + 2,
          dealsCreated: Math.floor(Math.random() * 3 * todayMultiplier),
          mediaCreated: Math.floor(Math.random() * 5 * todayMultiplier) + 1,
          servicesUsed: ['Email', 'Video Calls', 'CRM', 'Analytics'].slice(0, Math.floor(Math.random() * 4) + 1),
          emailsSent: Math.floor(Math.random() * 20 * todayMultiplier) + 5,
          meetingsScheduled: Math.floor(Math.random() * 4 * todayMultiplier)
        },
        weekStats: {
          crmUpdates: Math.floor(Math.random() * 50) + 25,
          leadsAdded: Math.floor(Math.random() * 30) + 15,
          dealsCreated: Math.floor(Math.random() * 10) + 3,
          dealsWon: Math.floor(Math.random() * 5) + 1,
          dealValue: Math.floor(Math.random() * 50000) + 10000,
          mediaCreated: Math.floor(Math.random() * 20) + 10,
          conversionRate: Math.random() * 20 + 10
        },
        monthStats: {
          crmUpdates: Math.floor(Math.random() * 200) + 100,
          leadsAdded: Math.floor(Math.random() * 120) + 60,
          dealsCreated: Math.floor(Math.random() * 40) + 15,
          dealsWon: Math.floor(Math.random() * 20) + 5,
          totalDealValue: Math.floor(Math.random() * 200000) + 50000,
          mediaCreated: Math.floor(Math.random() * 80) + 40,
          conversionRate: Math.random() * 25 + 12,
          performanceTrend: ['improving', 'declining', 'stable'][Math.floor(Math.random() * 3)] as any
        }
      }
    })

    // Generate team overview
    const teamOverview: TeamOverview = {
      totalEmployees: employees.length,
      activeToday: employees.filter(e => e.status === 'active').length,
      activeThisWeek: employees.length - 1,
      totalCRMUpdates: employeeCards.reduce((sum, emp) => sum + emp.todayStats.crmUpdates, 0),
      totalLeadsAdded: employeeCards.reduce((sum, emp) => sum + emp.todayStats.leadsAdded, 0),
      totalDealsCreated: employeeCards.reduce((sum, emp) => sum + emp.todayStats.dealsCreated, 0),
      totalMediaCreated: employeeCards.reduce((sum, emp) => sum + emp.todayStats.mediaCreated, 0),
      teamPerformanceScore: Math.round(employeeCards.reduce((sum, emp) => sum + emp.performanceScore, 0) / employees.length),
      improvementTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any
    }

    // Generate smart alerts with realistic collaboration scenarios
    const smartAlerts: ManagerAlert[] = [
      {
        id: 'alert_001',
        managerId: managerId || 'manager_123',
        organizationId: orgId || 'org_123',
        alertType: 'collaboration_opportunity',
        title: 'Cross-Territory Opportunity Detected',
        description: 'Sarah and Michael are both targeting companies in the tech sector. Sarah recently closed a deal with TechCorp while Michael is pursuing InnovateTech - they could share valuable insights.',
        actionSuggestion: 'Facilitate a knowledge sharing session between Sarah and Michael to improve Michael\'s approach with InnovateTech.',
        priority: 'high',
        status: 'pending',
        employeesInvolved: ['emp_001', 'emp_002'],
        createdAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
        quickActions: [
          {
            id: 'action_001',
            label: 'Schedule Team Meeting',
            type: 'schedule_meeting',
            payload: { employees: ['emp_001', 'emp_002'], topic: 'Tech Sector Strategy Sharing' }
          },
          {
            id: 'action_002',
            label: 'Send Introduction Message',
            type: 'introduce_employees',
            payload: { employee1: 'emp_001', employee2: 'emp_002' }
          }
        ]
      },
      {
        id: 'alert_002',
        managerId: managerId || 'manager_123',
        organizationId: orgId || 'org_123',
        alertType: 'performance_insight',
        title: 'Emily Needs Support',
        description: 'Emily\'s conversion rate has dropped to 12% this week, below her usual 18%. Her CRM activity is normal, but deal closure seems to be the challenge.',
        actionSuggestion: 'Pair Emily with David for mentoring sessions focused on closing techniques and objection handling.',
        priority: 'medium',
        status: 'pending',
        employeesInvolved: ['emp_003', 'emp_004'],
        createdAt: new Date(Date.now() - 24 * 3600000), // 1 day ago
        quickActions: [
          {
            id: 'action_003',
            label: 'Send Encouragement',
            type: 'send_message',
            payload: { recipient: 'emp_003', template: 'encouragement' }
          },
          {
            id: 'action_004',
            label: 'Arrange Mentoring',
            type: 'schedule_meeting',
            payload: { mentor: 'emp_004', mentee: 'emp_003' }
          }
        ]
      },
      {
        id: 'alert_003',
        managerId: managerId || 'manager_123',
        organizationId: orgId || 'org_123',
        alertType: 'competitive_intelligence',
        title: 'Winning Strategy Identified',
        description: 'Michael\'s recent success with manufacturing clients shows a 40% higher close rate when he leads with the ROI calculator tool instead of feature demonstrations.',
        actionSuggestion: 'Share Michael\'s ROI-first approach with the entire team, especially for manufacturing prospects.',
        priority: 'medium',
        status: 'pending',
        employeesInvolved: ['emp_002'],
        createdAt: new Date(Date.now() - 6 * 3600000), // 6 hours ago
        quickActions: [
          {
            id: 'action_005',
            label: 'Share Best Practice',
            type: 'send_template',
            payload: { template: 'best_practice_roi_approach', shareWith: 'all_team' }
          },
          {
            id: 'action_006',
            label: 'Schedule Training',
            type: 'schedule_meeting',
            payload: { type: 'team_training', topic: 'ROI-First Sales Approach' }
          }
        ]
      }
    ]

    // Generate performance insights
    const performanceInsights: PerformanceInsight[] = [
      {
        id: 'insight_001',
        type: 'team',
        title: 'Video Calls Drive Higher Conversion',
        description: 'Team members who schedule video calls within 24 hours of initial contact show 35% higher conversion rates.',
        recommendation: 'Implement a policy encouraging immediate video call scheduling for all new leads.',
        impact: 'high',
        metrics: { 'conversion_improvement': 35, 'time_to_call_hours': 24 }
      },
      {
        id: 'insight_002',
        type: 'individual',
        title: 'Sarah\'s Media Strategy Success',
        description: 'Sarah\'s custom video messages have a 60% response rate, significantly higher than team average of 25%.',
        recommendation: 'Train other team members on Sarah\'s video messaging techniques and templates.',
        impact: 'high',
        employeeId: 'emp_001',
        metrics: { 'sarah_response_rate': 60, 'team_average': 25 }
      },
      {
        id: 'insight_003',
        type: 'comparative',
        title: 'Industry-Specific Approach Variance',
        description: 'Healthcare prospects respond 45% better to case study approaches, while tech prospects prefer demo-first strategies.',
        recommendation: 'Develop industry-specific playbooks and ensure team members follow appropriate approaches.',
        impact: 'medium',
        metrics: { 'healthcare_improvement': 45, 'tech_demo_preference': 78 }
      }
    ]

    // Generate collaboration opportunities
    const collaborationOpportunities: CollaborationOpportunity[] = [
      {
        id: 'collab_001',
        type: 'company_overlap',
        title: 'MegaCorp Multi-Division Opportunity',
        description: 'Lisa is working with MegaCorp\'s IT division while David has a contact in their Finance department. Coordinated approach could unlock enterprise-wide adoption.',
        employeesInvolved: ['emp_005', 'emp_004'],
        potentialImpact: 'Could expand single department deal into $200K+ enterprise contract',
        suggestedAction: 'Introduce Lisa and David to coordinate their MegaCorp strategies and potentially present a unified solution.',
        urgency: 'high',
        createdAt: new Date(Date.now() - 12 * 3600000) // 12 hours ago
      },
      {
        id: 'collab_002',
        type: 'skill_sharing',
        title: 'Social Media Content Mastery',
        description: 'Michael has exceptional LinkedIn engagement rates (80% above team average) that could benefit everyone.',
        employeesInvolved: ['emp_002'],
        potentialImpact: 'Could improve team-wide social media lead generation by 50-80%',
        suggestedAction: 'Have Michael lead a lunch-and-learn session on LinkedIn engagement strategies.',
        urgency: 'medium',
        createdAt: new Date(Date.now() - 18 * 3600000) // 18 hours ago
      },
      {
        id: 'collab_003',
        type: 'warm_introduction',
        title: 'Healthcare Network Connection',
        description: 'Sarah\'s contact at HealthSystem Corp mentioned they work closely with Regional Medical (David\'s prospect). A warm introduction could accelerate David\'s deal.',
        employeesInvolved: ['emp_001', 'emp_004'],
        potentialImpact: 'Could reduce David\'s sales cycle by 2-3 weeks and increase close probability',
        suggestedAction: 'Coordinate with Sarah to provide warm introduction from HealthSystem Corp to Regional Medical.',
        urgency: 'high',
        createdAt: new Date(Date.now() - 4 * 3600000) // 4 hours ago
      }
    ]

    const dashboardData: ManagerDashboardData = {
      teamOverview,
      employeeCards,
      smartAlerts,
      performanceInsights,
      collaborationOpportunities
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    console.error('Error fetching manager dashboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch manager dashboard data' },
      { status: 500 }
    )
  }
}