import { 
  Organization, 
  OrganizationMember, 
  OrganizationInvitation, 
  OrganizationUsage,
  OrganizationRole,
  MemberStatus,
  InvitationStatus,
  ORGANIZATION_PLANS,
  DEFAULT_ORGANIZATION_SETTINGS,
  OrganizationBilling,
  BillingRecord
} from './organizationTypes';

export class OrganizationService {
  private static instance: OrganizationService;
  private organizations: Map<string, Organization> = new Map();
  private members: Map<string, OrganizationMember[]> = new Map();
  private invitations: Map<string, OrganizationInvitation[]> = new Map();
  private usage: Map<string, OrganizationUsage> = new Map();

  private constructor() {
    // Initialize with demo data for development
    this.initializeDemoData();
  }

  public static getInstance(): OrganizationService {
    if (!OrganizationService.instance) {
      OrganizationService.instance = new OrganizationService();
    }
    return OrganizationService.instance;
  }

  private initializeDemoData() {
    // Demo organization
    const demoOrg: Organization = {
      id: 'org_demo_123',
      name: 'Acme Corporation',
      domain: 'acme.com',
      plan: ORGANIZATION_PLANS[1], // Business plan
      settings: DEFAULT_ORGANIZATION_SETTINGS,
      billing: {
        currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        creditsAllocated: 25000,
        creditsUsed: 8500,
        creditsRemaining: 16500,
        lastBillingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        billingHistory: []
      },
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      ownerId: 'user_owner_123'
    };

    this.organizations.set(demoOrg.id, demoOrg);

    // Demo members
    const demoMembers: OrganizationMember[] = [
      {
        id: 'member_1',
        userId: 'user_owner_123',
        organizationId: demoOrg.id,
        email: 'owner@acme.com',
        name: 'John Owner',
        role: 'owner',
        status: 'active',
        invitedBy: 'system',
        invitedAt: demoOrg.createdAt,
        joinedAt: demoOrg.createdAt,
        lastActive: new Date()
      },
      {
        id: 'member_2',
        userId: 'user_admin_123',
        organizationId: demoOrg.id,
        email: 'admin@acme.com',
        name: 'Jane Admin',
        role: 'admin',
        status: 'active',
        invitedBy: 'user_owner_123',
        invitedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'member_3',
        userId: 'user_manager_123',
        organizationId: demoOrg.id,
        email: 'manager@acme.com',
        name: 'Bob Manager',
        role: 'manager',
        status: 'active',
        invitedBy: 'user_admin_123',
        invitedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 'member_4',
        userId: 'user_employee_123',
        organizationId: demoOrg.id,
        email: 'employee@acme.com',
        name: 'Alice Employee',
        role: 'employee',
        status: 'active',
        invitedBy: 'user_manager_123',
        invitedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ];

    this.members.set(demoOrg.id, demoMembers);
  }

  // Organization management
  async createOrganization(name: string, ownerId: string, planId: string, domain?: string): Promise<Organization> {
    const plan = ORGANIZATION_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    const org: Organization = {
      id: `org_${Date.now()}`,
      name,
      domain,
      plan,
      settings: DEFAULT_ORGANIZATION_SETTINGS,
      billing: {
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        creditsAllocated: plan.creditsPerMonth,
        creditsUsed: 0,
        creditsRemaining: plan.creditsPerMonth,
        lastBillingDate: new Date(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        billingHistory: []
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId
    };

    this.organizations.set(org.id, org);

    // Add owner as first member
    const ownerMember: OrganizationMember = {
      id: `member_${Date.now()}`,
      userId: ownerId,
      organizationId: org.id,
      email: 'owner@company.com', // This would come from user profile
      name: 'Organization Owner',
      role: 'owner',
      status: 'active',
      invitedBy: 'system',
      invitedAt: new Date(),
      joinedAt: new Date()
    };

    this.members.set(org.id, [ownerMember]);

    return org;
  }

  async getOrganization(orgId: string): Promise<Organization | null> {
    return this.organizations.get(orgId) || null;
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const userOrgs: Organization[] = [];
    
    for (const [orgId, members] of this.members.entries()) {
      const memberFound = members.find(m => m.userId === userId && m.status === 'active');
      if (memberFound) {
        const org = this.organizations.get(orgId);
        if (org) {
          userOrgs.push(org);
        }
      }
    }

    return userOrgs;
  }

  // Member management
  async getOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
    return this.members.get(orgId) || [];
  }

  async addMember(orgId: string, userId: string, email: string, name: string, role: OrganizationRole, invitedBy: string): Promise<OrganizationMember> {
    const org = this.organizations.get(orgId);
    if (!org) {
      throw new Error('Organization not found');
    }

    const members = this.members.get(orgId) || [];
    
    // Check if member already exists
    const existingMember = members.find(m => m.userId === userId || m.email === email);
    if (existingMember) {
      throw new Error('User is already a member of this organization');
    }

    // Check member limit
    if (org.plan.maxMembers !== -1 && members.length >= org.plan.maxMembers) {
      throw new Error('Organization has reached maximum member limit');
    }

    const newMember: OrganizationMember = {
      id: `member_${Date.now()}`,
      userId,
      organizationId: orgId,
      email,
      name,
      role,
      status: 'active',
      invitedBy,
      invitedAt: new Date(),
      joinedAt: new Date(),
      lastActive: new Date()
    };

    members.push(newMember);
    this.members.set(orgId, members);

    return newMember;
  }

  async removeMember(orgId: string, memberId: string): Promise<boolean> {
    const members = this.members.get(orgId) || [];
    const memberIndex = members.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
      return false;
    }

    // Don't allow removing the owner
    if (members[memberIndex].role === 'owner') {
      throw new Error('Cannot remove organization owner');
    }

    members.splice(memberIndex, 1);
    this.members.set(orgId, members);
    
    return true;
  }

  async updateMemberRole(orgId: string, memberId: string, newRole: OrganizationRole): Promise<boolean> {
    const members = this.members.get(orgId) || [];
    const member = members.find(m => m.id === memberId);
    
    if (!member) {
      return false;
    }

    // Don't allow changing owner role
    if (member.role === 'owner' || newRole === 'owner') {
      throw new Error('Cannot change owner role');
    }

    member.role = newRole;
    this.members.set(orgId, members);
    
    return true;
  }

  // Invitation management
  async createInvitation(orgId: string, email: string, role: OrganizationRole, invitedBy: string): Promise<OrganizationInvitation> {
    const org = this.organizations.get(orgId);
    if (!org) {
      throw new Error('Organization not found');
    }

    const members = this.members.get(orgId) || [];
    const existingMember = members.find(m => m.email === email);
    if (existingMember) {
      throw new Error('User is already a member of this organization');
    }

    const invitation: OrganizationInvitation = {
      id: `invite_${Date.now()}`,
      organizationId: orgId,
      email,
      role,
      invitedBy,
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'pending',
      token: this.generateInviteToken()
    };

    const orgInvitations = this.invitations.get(orgId) || [];
    orgInvitations.push(invitation);
    this.invitations.set(orgId, orgInvitations);

    return invitation;
  }

  async acceptInvitation(token: string, userId: string): Promise<{ success: boolean; organization?: Organization; member?: OrganizationMember }> {
    for (const [orgId, invitations] of this.invitations.entries()) {
      const invitation = invitations.find(i => i.token === token && i.status === 'pending');
      
      if (invitation) {
        // Check if invitation is expired
        if (invitation.expiresAt < new Date()) {
          invitation.status = 'expired';
          return { success: false };
        }

        // Create member
        const member = await this.addMember(
          orgId,
          userId,
          invitation.email,
          'Invited User', // Would get actual name from user profile
          invitation.role,
          invitation.invitedBy
        );

        // Mark invitation as accepted
        invitation.status = 'accepted';

        const org = this.organizations.get(orgId);
        return { success: true, organization: org, member };
      }
    }

    return { success: false };
  }

  async getOrganizationInvitations(orgId: string): Promise<OrganizationInvitation[]> {
    return this.invitations.get(orgId) || [];
  }

  // Billing and usage
  async trackOrganizationUsage(orgId: string, userId: string, creditsUsed: number, cost: number): Promise<void> {
    const org = this.organizations.get(orgId);
    if (!org) {
      throw new Error('Organization not found');
    }

    // Update organization billing
    org.billing.creditsUsed += creditsUsed;
    org.billing.creditsRemaining = Math.max(0, org.billing.creditsAllocated - org.billing.creditsUsed);
    
    this.organizations.set(orgId, org);

    // Update usage tracking (implementation would store in database)
    console.log(`Organization ${orgId} used ${creditsUsed} credits (cost: $${cost})`);
  }

  async getOrganizationUsage(orgId: string): Promise<OrganizationUsage | null> {
    // This would typically fetch from database
    // For demo, return mock data
    const org = this.organizations.get(orgId);
    if (!org) {
      return null;
    }

    const members = this.members.get(orgId) || [];
    
    return {
      organizationId: orgId,
      period: {
        start: org.billing.currentPeriodStart,
        end: org.billing.currentPeriodEnd
      },
      totalCost: (org.billing.creditsUsed * 0.01), // $0.01 per credit
      totalTokens: org.billing.creditsUsed * 100, // Estimate
      totalCreditsUsed: org.billing.creditsUsed,
      memberUsage: members.map(member => ({
        userId: member.userId,
        name: member.name,
        email: member.email,
        creditsUsed: Math.floor(Math.random() * 1000),
        cost: Math.floor(Math.random() * 10),
        tokens: Math.floor(Math.random() * 10000),
        apiCalls: Math.floor(Math.random() * 100),
        lastActivity: member.lastActive || new Date()
      })),
      serviceUsage: [
        { service: 'OpenRouter', usage: 60, cost: 51, percentage: 60 },
        { service: 'Segmind', usage: 30, cost: 25.5, percentage: 30 },
        { service: 'Other', usage: 10, cost: 8.5, percentage: 10 }
      ]
    };
  }

  // Utility methods
  private generateInviteToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async hasPermission(userId: string, orgId: string, action: string): Promise<boolean> {
    const members = this.members.get(orgId) || [];
    const member = members.find(m => m.userId === userId && m.status === 'active');
    
    if (!member) {
      return false;
    }

    const permissions: Record<string, OrganizationRole[]> = {
      'manage_billing': ['owner', 'admin'],
      'manage_members': ['owner', 'admin', 'manager'],
      'invite_members': ['owner', 'admin', 'manager'],
      'view_usage': ['owner', 'admin', 'manager'],
      'view_members': ['owner', 'admin', 'manager'],
      'use_credits': ['owner', 'admin', 'manager', 'employee']
    };

    return permissions[action]?.includes(member.role) || false;
  }
}

// Export singleton instance
export const organizationService = OrganizationService.getInstance();