"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Building2,
  Users,
  CreditCard,
  Settings,
  Plus,
  Mail,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  UserPlus,
  Trash2
} from 'lucide-react'
import { 
  Organization, 
  OrganizationMember, 
  OrganizationInvitation, 
  OrganizationUsage,
  OrganizationRole,
  ORGANIZATION_PLANS
} from '@/lib/organizationTypes'

export default function OrganizationDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([])
  const [usage, setUsage] = useState<OrganizationUsage | null>(null)
  const [showCreateOrg, setShowCreateOrg] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    domain: '',
    planId: 'team'
  })

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'employee' as OrganizationRole
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  useEffect(() => {
    loadOrganizations()
  }, [])

  useEffect(() => {
    if (selectedOrg) {
      loadOrganizationData(selectedOrg.id)
    }
  }, [selectedOrg])

  const loadOrganizations = async () => {
    try {
      // Mock API call - would use real API with auth headers
      const response = await fetch('/api/organization', {
        headers: {
          'x-user-id': 'demo-user-123' // Mock user ID
        }
      })
      const data = await response.json()
      setOrganizations(data.organizations || [])
      
      // Select first organization by default
      if (data.organizations?.length > 0) {
        setSelectedOrg(data.organizations[0])
      }
    } catch (error) {
      console.error('Error loading organizations:', error)
    }
  }

  const loadOrganizationData = async (orgId: string) => {
    try {
      // Load members
      const membersResponse = await fetch(`/api/organization/members?orgId=${orgId}`, {
        headers: {
          'x-user-id': 'demo-user-123'
        }
      })
      const membersData = await membersResponse.json()
      setMembers(membersData.members || [])
      setInvitations(membersData.invitations || [])

      // Load billing/usage
      const billingResponse = await fetch(`/api/organization/billing?orgId=${orgId}`, {
        headers: {
          'x-user-id': 'demo-user-123'
        }
      })
      const billingData = await billingResponse.json()
      setUsage(billingData.usage)
    } catch (error) {
      console.error('Error loading organization data:', error)
    }
  }

  const createOrganization = async () => {
    if (!newOrgForm.name.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user-123'
        },
        body: JSON.stringify(newOrgForm)
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrganizations(prev => [...prev, data.organization])
        setSelectedOrg(data.organization)
        setNewOrgForm({ name: '', domain: '', planId: 'team' })
        setShowCreateOrg(false)
      }
    } catch (error) {
      console.error('Error creating organization:', error)
    }
    setLoading(false)
  }

  const sendInvitation = async () => {
    if (!selectedOrg || !inviteForm.email.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/organization/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user-123'
        },
        body: JSON.stringify({
          organizationId: selectedOrg.id,
          email: inviteForm.email,
          role: inviteForm.role
        })
      })
      
      if (response.ok) {
        await loadOrganizationData(selectedOrg.id)
        setInviteForm({ email: '', role: 'employee' })
        setShowInviteModal(false)
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
    }
    setLoading(false)
  }

  const removeMember = async (memberId: string) => {
    if (!selectedOrg) return

    try {
      const response = await fetch(`/api/organization/members?orgId=${selectedOrg.id}&memberId=${memberId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'demo-user-123'
        }
      })
      
      if (response.ok) {
        await loadOrganizationData(selectedOrg.id)
      }
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  const getRoleColor = (role: OrganizationRole) => {
    switch (role) {
      case 'owner': return 'bg-purple-500/20 text-purple-400'
      case 'admin': return 'bg-blue-500/20 text-blue-400'
      case 'manager': return 'bg-green-500/20 text-green-400'
      case 'employee': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getInvitationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'accepted': return 'bg-green-500/20 text-green-400'
      case 'expired': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (organizations.length === 0 && !showCreateOrg) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">No Organizations Found</h1>
          <p className="text-gray-400 mb-6">Create your first organization to get started with team management and billing.</p>
          <Button onClick={() => setShowCreateOrg(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Organization Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your organization, members, and billing
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowCreateOrg(true)}
            variant="outline" 
            className="border-gray-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Organization
          </Button>
          {selectedOrg && (
            <Button 
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          )}
        </div>
      </motion.div>

      {/* Organization Selector */}
      {organizations.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <select
            value={selectedOrg?.id || ''}
            onChange={(e) => {
              const org = organizations.find(o => o.id === e.target.value)
              setSelectedOrg(org || null)
            }}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
          className="lg:col-span-3"
        >
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            {/* Overview Tab */}
            {activeTab === 'overview' && selectedOrg && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Organization Overview</h2>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-blue-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Members</p>
                        <p className="text-white text-xl font-semibold">{members.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Credits Used</p>
                        <p className="text-white text-xl font-semibold">
                          {selectedOrg.billing.creditsUsed.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-purple-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Monthly Cost</p>
                        <p className="text-white text-xl font-semibold">${selectedOrg.plan.price}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-orange-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Usage</p>
                        <p className="text-white text-xl font-semibold">
                          {Math.round((selectedOrg.billing.creditsUsed / selectedOrg.billing.creditsAllocated) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Chart Placeholder */}
                <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-4">Credit Usage This Month</h3>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full" 
                      style={{ 
                        width: `${Math.min((selectedOrg.billing.creditsUsed / selectedOrg.billing.creditsAllocated) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>{selectedOrg.billing.creditsUsed.toLocaleString()} used</span>
                    <span>{selectedOrg.billing.creditsAllocated.toLocaleString()} total</span>
                  </div>
                </div>

                {/* Recent Activity */}
                {usage && (
                  <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="text-white font-medium mb-4">Top Users This Month</h3>
                    <div className="space-y-3">
                      {usage.memberUsage.slice(0, 5).map((member, index) => (
                        <div key={member.userId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white text-sm">{member.name}</p>
                              <p className="text-gray-400 text-xs">{member.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm">{member.creditsUsed.toLocaleString()} credits</p>
                            <p className="text-gray-400 text-xs">${member.cost.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Team Members</h2>
                  <Button 
                    onClick={() => setShowInviteModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </div>

                {/* Active Members */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 text-gray-400 font-medium">Name</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Role</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Joined</th>
                        <th className="text-right py-3 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b border-gray-800">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {member.name.charAt(0)}
                              </div>
                              <span className="text-white">{member.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-gray-400">{member.email}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400">
                            {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="py-3 text-right">
                            {member.role !== 'owner' && (
                              <Button 
                                onClick={() => removeMember(member.id)}
                                variant="ghost" 
                                size="sm" 
                                className="text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Pending Invitations</h3>
                    <div className="space-y-3">
                      {invitations.map((invitation) => (
                        <div key={invitation.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-white">{invitation.email}</p>
                                <p className="text-gray-400 text-sm">
                                  Invited {new Date(invitation.invitedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(invitation.role)}`}>
                                {invitation.role}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvitationStatusColor(invitation.status)}`}>
                                {invitation.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && selectedOrg && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Billing & Usage</h2>
                
                {/* Current Plan */}
                <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-medium">{selectedOrg.plan.name} Plan</h3>
                      <p className="text-gray-400">${selectedOrg.plan.price}/month</p>
                    </div>
                    <Button variant="outline" className="border-gray-600">
                      Change Plan
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Credits Allocated</p>
                      <p className="text-white text-lg font-semibold">{selectedOrg.billing.creditsAllocated.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Credits Used</p>
                      <p className="text-white text-lg font-semibold">{selectedOrg.billing.creditsUsed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Credits Remaining</p>
                      <p className="text-white text-lg font-semibold">{selectedOrg.billing.creditsRemaining.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Usage Breakdown */}
                {usage && (
                  <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="text-white font-medium mb-4">Service Usage Breakdown</h3>
                    <div className="space-y-4">
                      {usage.serviceUsage.map((service, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-white">{service.service}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-400">{service.percentage}%</span>
                            <span className="text-white">${service.cost.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Billing History */}
                <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-4">Billing History</h3>
                  <div className="text-gray-400 text-center py-8">
                    No billing history available yet.
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && selectedOrg && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Organization Settings</h2>
                
                {/* Organization Info */}
                <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-4">Organization Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Organization Name
                      </label>
                      <Input
                        value={selectedOrg.name}
                        className="bg-gray-800 border-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Domain
                      </label>
                      <Input
                        value={selectedOrg.domain || ''}
                        className="bg-gray-800 border-gray-600"
                        placeholder="yourcompany.com"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Member Settings */}
                <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-4">Member Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Allow domain auto-join</p>
                        <p className="text-gray-400 text-sm">Users with your domain can join automatically</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Require approval for new members</p>
                        <p className="text-gray-400 text-sm">New members need approval before joining</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 bg-red-900/20 rounded-lg border border-red-700">
                  <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    These actions cannot be undone. Please be careful.
                  </p>
                  <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-500/20">
                    Delete Organization
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Create Organization Modal */}
      {showCreateOrg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Create Organization</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Organization Name
                </label>
                <Input
                  value={newOrgForm.name}
                  onChange={(e) => setNewOrgForm(prev => ({...prev, name: e.target.value}))}
                  className="bg-gray-800 border-gray-600"
                  placeholder="Acme Corporation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Domain (Optional)
                </label>
                <Input
                  value={newOrgForm.domain}
                  onChange={(e) => setNewOrgForm(prev => ({...prev, domain: e.target.value}))}
                  className="bg-gray-800 border-gray-600"
                  placeholder="acme.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Plan
                </label>
                <select
                  value={newOrgForm.planId}
                  onChange={(e) => setNewOrgForm(prev => ({...prev, planId: e.target.value}))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                >
                  {ORGANIZATION_PLANS.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price}/month
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => setShowCreateOrg(false)}
                variant="outline" 
                className="border-gray-600 flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={createOrganization}
                disabled={loading || !newOrgForm.name.trim()}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Invite Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({...prev, email: e.target.value}))}
                  className="bg-gray-800 border-gray-600"
                  placeholder="colleague@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Role
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({...prev, role: e.target.value as OrganizationRole}))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => setShowInviteModal(false)}
                variant="outline" 
                className="border-gray-600 flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={sendInvitation}
                disabled={loading || !inviteForm.email.trim()}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                {loading ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}