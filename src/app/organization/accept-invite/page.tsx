"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  ArrowRight,
  Shield,
  Crown,
  Users
} from 'lucide-react'

export default function AcceptInvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'expired' | 'accepted'>('loading')
  const [invitation, setInvitation] = useState<any>(null)
  const [organization, setOrganization] = useState<any>(null)

  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      validateInvitation()
    } else {
      setStatus('invalid')
    }
  }, [token])

  const validateInvitation = async () => {
    try {
      // In a real implementation, this would validate the token on the server
      // For demo purposes, we'll simulate the validation
      setLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock invitation data - in production this would come from the API
      const mockInvitation = {
        id: 'invite_123',
        email: 'newuser@example.com',
        role: 'employee',
        invitedBy: 'Admin User',
        invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'pending'
      }
      
      const mockOrganization = {
        id: 'org_123',
        name: 'Acme Corporation',
        plan: { 
          name: 'Enterprise', 
          price: 1999,
          features: ['Manager Console', 'Advanced Analytics', 'Team Collaboration Tools']
        },
        domain: 'acme.com',
        managerConsoleEnabled: true
      }
      
      // Check if invitation is expired
      if (mockInvitation.expiresAt < new Date()) {
        setStatus('expired')
      } else {
        setInvitation(mockInvitation)
        setOrganization(mockOrganization)
        setStatus('valid')
      }
      
    } catch (error) {
      console.error('Error validating invitation:', error)
      setStatus('invalid')
    } finally {
      setLoading(false)
    }
  }

  const acceptInvitation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/organization/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user-456' // Would come from auth context
        },
        body: JSON.stringify({ token })
      })
      
      if (response.ok) {
        setStatus('accepted')
        // Redirect to organization dashboard after 3 seconds
        setTimeout(() => {
          router.push('/organization')
        }, 3000)
      } else {
        throw new Error('Failed to accept invitation')
      }
    } catch (error) {
      console.error('Error accepting invitation:', error)
      setStatus('invalid')
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Validating Invitation</h2>
            <p className="text-gray-400">Please wait while we verify your invitation...</p>
          </motion.div>
        )

      case 'valid':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              You're Invited to Join {organization?.name}!
            </h1>
            
            <p className="text-gray-400 mb-6">
              {invitation?.invitedBy} has invited you to join their organization on CaptureIT LS
            </p>

            <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <h3 className="text-white font-medium mb-2">Organization Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{organization?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plan:</span>
                      <span className="text-white">{organization?.plan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Domain:</span>
                      <span className="text-white">{organization?.domain}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Your Role</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Position:</span>
                      <span className="text-white capitalize">{invitation?.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Invited by:</span>
                      <span className="text-white">{invitation?.invitedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expires:</span>
                      <span className="text-white">
                        {invitation?.expiresAt ? new Date(invitation.expiresAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
              <h3 className="text-blue-400 font-medium mb-2">What you'll get access to:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Shared credit pool for AI-powered content creation</li>
                <li>• Team collaboration tools and workflows</li>
                <li>• Organization-wide analytics and reporting</li>
                <li>• Access to premium features and integrations</li>
                {organization?.managerConsoleEnabled && (
                  <li>• Manager-assisted collaboration and support</li>
                )}
              </ul>
            </div>

            {/* Enterprise Manager Console Highlight */}
            {organization?.plan.name === 'Enterprise' && organization?.managerConsoleEnabled && (
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-purple-400 font-semibold text-lg">🚀 Enterprise Exclusive</h3>
                    <p className="text-purple-300 text-sm">Manager Console Enabled</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-4">
                    As part of this Enterprise organization, you'll benefit from our revolutionary Manager Console - 
                    where your manager gets smart alerts and suggestions to help you succeed.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-purple-300">
                    <div className="flex items-center gap-2">
                      <Crown className="w-3 h-3" />
                      <span>Smart collaboration opportunities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>Team performance insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      <span>Manager assistance tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3" />
                      <span>Advanced team analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                className="border-gray-600"
                onClick={() => router.push('/')}
              >
                Decline
              </Button>
              <Button 
                onClick={acceptInvitation}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Joining...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Accept Invitation
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        )

      case 'accepted':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to {organization?.name}!
            </h1>
            
            <p className="text-gray-400 mb-6">
              You've successfully joined the organization. Redirecting to your dashboard...
            </p>

            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
              <p className="text-green-400">
                🎉 You now have access to all organization features and shared credits!
              </p>
            </div>

            <Button 
              onClick={() => router.push('/organization')}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          </motion.div>
        )

      case 'expired':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Invitation Expired
            </h1>
            
            <p className="text-gray-400 mb-6">
              This invitation has expired. Please request a new invitation from your organization administrator.
            </p>

            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6">
              <p className="text-yellow-400">
                ⏰ Invitations are valid for 7 days from the time they were sent.
              </p>
            </div>

            <Button 
              onClick={() => router.push('/contact')}
              variant="outline"
              className="border-gray-600"
            >
              Contact Support
            </Button>
          </motion.div>
        )

      case 'invalid':
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Invalid Invitation
            </h1>
            
            <p className="text-gray-400 mb-6">
              This invitation link is invalid or has already been used. Please check the link or request a new invitation.
            </p>

            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-400">
                ❌ The invitation token could not be validated.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => router.push('/contact')}
                variant="outline"
                className="border-gray-600"
              >
                Contact Support
              </Button>
              <Button 
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Go Home
              </Button>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 bg-gray-900/50 border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <Building2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              CaptureIT LS
            </h1>
            <p className="text-gray-400 mt-2">Organization Invitation</p>
          </div>

          {/* Content */}
          {renderContent()}
        </Card>
      </motion.div>
    </div>
  )
}