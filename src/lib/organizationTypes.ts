// Organization and Employee Management Types

export interface Organization {
  id: string;
  name: string;
  domain?: string; // For auto-joining employees with company email
  plan: OrganizationPlan;
  settings: OrganizationSettings;
  billing: OrganizationBilling;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string; // Primary admin/owner
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  email: string;
  name: string;
  role: OrganizationRole;
  status: MemberStatus;
  invitedBy: string;
  invitedAt: Date;
  joinedAt?: Date;
  lastActive?: Date;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: InvitationStatus;
  token: string;
}

export type OrganizationRole = 
  | 'owner'      // Full organization control
  | 'admin'      // Can manage members and billing
  | 'manager'    // Can manage team and view billing
  | 'employee';  // Basic access

export type MemberStatus = 
  | 'active'
  | 'inactive' 
  | 'suspended';

export type InvitationStatus = 
  | 'pending'
  | 'accepted' 
  | 'expired'
  | 'cancelled';

export interface OrganizationPlan {
  id: string;
  name: string;
  maxMembers: number;
  creditsPerMonth: number;
  price: number;
  features: string[];
  managerConsoleEnabled?: boolean;
  enterpriseFeatures?: EnterpriseFeatures;
}

export interface EnterpriseFeatures {
  managerConsole: boolean;
  employeeMonitoring: boolean;
  smartCollaboration: boolean;
  advancedAnalytics: boolean;
  teamCommunication: boolean;
  performanceInsights: boolean;
  crossEmployeeAlerts: boolean;
  competitiveIntelligence: boolean;
  predictiveAnalytics: boolean;
}

export interface OrganizationSettings {
  allowDomainAutoJoin: boolean;
  requireApprovalForNewMembers: boolean;
  defaultRole: OrganizationRole;
  allowMemberInvites: boolean;
  billingNotifications: boolean;
  usageAlerts: {
    enabled: boolean;
    threshold: number; // percentage of credits used
  };
}

export interface OrganizationBilling {
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  creditsAllocated: number;
  creditsUsed: number;
  creditsRemaining: number;
  lastBillingDate: Date;
  nextBillingDate: Date;
  paymentMethodId?: string;
  billingHistory: BillingRecord[];
}

export interface BillingRecord {
  id: string;
  date: Date;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

export interface OrganizationUsage {
  organizationId: string;
  period: {
    start: Date;
    end: Date;
  };
  totalCost: number;
  totalTokens: number;
  totalCreditsUsed: number;
  memberUsage: MemberUsage[];
  serviceUsage: ServiceUsage[];
}

export interface MemberUsage {
  userId: string;
  name: string;
  email: string;
  creditsUsed: number;
  cost: number;
  tokens: number;
  apiCalls: number;
  lastActivity: Date;
}

// Employee Activity Tracking for Manager Console
export interface EmployeeActivity {
  id: string;
  employeeId: string;
  managerId: string;
  organizationId: string;
  activityType: 'crm_update' | 'lead_added' | 'deal_created' | 'media_creation' | 'service_usage' | 'email_sent' | 'meeting_scheduled';
  timestamp: Date;
  description: string;
  metadata: {
    entityType?: 'lead' | 'contact' | 'deal' | 'campaign';
    entityId?: string;
    entityName?: string;
    serviceUsed?: string;
    mediaType?: string;
    dealValue?: number;
    companyName?: string;
    [key: string]: any;
  };
}

// Smart Alerts for Manager Assistance
export interface ManagerAlert {
  id: string;
  managerId: string;
  organizationId: string;
  alertType: 'collaboration_opportunity' | 'performance_insight' | 'resource_suggestion' | 'competitive_intelligence' | 'team_coordination';
  title: string;
  description: string;
  actionSuggestion: string;
  quickActions: QuickAction[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'acknowledged' | 'acted' | 'dismissed';
  employeesInvolved: string[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface QuickAction {
  id: string;
  label: string;
  type: 'send_message' | 'schedule_meeting' | 'share_resource' | 'introduce_employees' | 'send_template';
  payload: Record<string, any>;
}

// Manager Console Dashboard Data
export interface ManagerDashboardData {
  teamOverview: TeamOverview;
  employeeCards: EmployeeCard[];
  smartAlerts: ManagerAlert[];
  performanceInsights: PerformanceInsight[];
  collaborationOpportunities: CollaborationOpportunity[];
}

export interface TeamOverview {
  totalEmployees: number;
  activeToday: number;
  activeThisWeek: number;
  totalCRMUpdates: number;
  totalLeadsAdded: number;
  totalDealsCreated: number;
  totalMediaCreated: number;
  teamPerformanceScore: number;
  improvementTrend: 'up' | 'down' | 'stable';
}

export interface EmployeeCard {
  employeeId: string;
  name: string;
  email: string;
  title: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline';
  lastActive: Date;
  todayStats: EmployeeDayStats;
  weekStats: EmployeeWeekStats;
  monthStats: EmployeeMonthStats;
  performanceScore: number;
  alerts: number;
  opportunities: number;
}

export interface EmployeeDayStats {
  crmUpdates: number;
  leadsAdded: number;
  dealsCreated: number;
  mediaCreated: number;
  servicesUsed: string[];
  emailsSent: number;
  meetingsScheduled: number;
}

export interface EmployeeWeekStats {
  crmUpdates: number;
  leadsAdded: number;
  dealsCreated: number;
  dealsWon: number;
  dealValue: number;
  mediaCreated: number;
  conversionRate: number;
}

export interface EmployeeMonthStats {
  crmUpdates: number;
  leadsAdded: number;
  dealsCreated: number;
  dealsWon: number;
  totalDealValue: number;
  mediaCreated: number;
  conversionRate: number;
  performanceTrend: 'improving' | 'declining' | 'stable';
}

export interface PerformanceInsight {
  id: string;
  type: 'individual' | 'team' | 'comparative';
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  employeeId?: string;
  metrics: Record<string, number>;
}

export interface CollaborationOpportunity {
  id: string;
  type: 'company_overlap' | 'skill_sharing' | 'resource_sharing' | 'warm_introduction';
  title: string;
  description: string;
  employeesInvolved: string[];
  potentialImpact: string;
  suggestedAction: string;
  urgency: 'high' | 'medium' | 'low';
  createdAt: Date;
}

export interface ServiceUsage {
  service: string;
  model?: string;
  usage: number;
  cost: number;
  percentage: number;
}

// Organization Plans
export const ORGANIZATION_PLANS: OrganizationPlan[] = [
  {
    id: 'team',
    name: 'Team',
    maxMembers: 10,
    creditsPerMonth: 5000,
    price: 199,
    features: [
      'Up to 10 team members',
      '5,000 credits per month',
      'Basic team management',
      'Usage analytics',
      'Email support'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    maxMembers: 50,
    creditsPerMonth: 25000,
    price: 499,
    features: [
      'Up to 50 team members',
      '25,000 credits per month',
      'Advanced team management',
      'Role-based permissions',
      'Usage analytics',
      'Priority support',
      'API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    maxMembers: -1, // unlimited
    creditsPerMonth: 100000,
    price: 1999,
    managerConsoleEnabled: true,
    enterpriseFeatures: {
      managerConsole: true,
      employeeMonitoring: true,
      smartCollaboration: true,
      advancedAnalytics: true,
      teamCommunication: true,
      performanceInsights: true,
      crossEmployeeAlerts: true,
      competitiveIntelligence: true,
      predictiveAnalytics: true
    },
    features: [
      'Unlimited team members',
      '100,000 credits per month',
      'Full organization management',
      'Custom roles and permissions',
      'Manager Console Dashboard',
      'Employee Activity Monitoring',
      'Smart Collaboration Alerts',
      'Performance Insights & Analytics',
      'Team Communication Tools',
      'Cross-Employee Opportunity Detection',
      'Competitive Intelligence Sharing',
      'Predictive Team Analytics',
      'Advanced reporting and insights',
      'Dedicated support',
      'Custom integrations',
      'SSO integration',
      'Audit logs',
      'Priority feature requests'
    ]
  }
];

export const DEFAULT_ORGANIZATION_SETTINGS: OrganizationSettings = {
  allowDomainAutoJoin: false,
  requireApprovalForNewMembers: true,
  defaultRole: 'employee',
  allowMemberInvites: false,
  billingNotifications: true,
  usageAlerts: {
    enabled: true,
    threshold: 80
  }
};