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
    features: [
      'Unlimited team members',
      '100,000 credits per month',
      'Full organization management',
      'Custom roles and permissions',
      'Advanced analytics',
      'Dedicated support',
      'Custom integrations',
      'SSO integration',
      'Audit logs'
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