"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield,
  Crown,
  Users,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react'
import ManagerConsole from '@/components/manager-console/ManagerDashboard'

export default function ManagerConsolePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [organizationPlan, setOrganizationPlan] = useState<string>('')
  const [organizationId, setOrganizationId] = useState<string>('')

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      // In a real application, this would check:
      // 1. User authentication status
      // 2. User's role in their organization (manager, admin, or owner)
      // 3. Organization's plan (must be Enterprise for Manager Console access)
      
      // Mock access check - simulating Enterprise user with manager role
      const mockUser = {
        id: 'demo-manager-123',
        role: 'manager', // 'manager', 'admin', or 'owner'
        organizationId: 'org_enterprise_123',
        organizationPlan: 'enterprise'
      }

      setUserRole(mockUser.role)
      setOrganizationPlan(mockUser.organizationPlan)
      setOrganizationId(mockUser.organizationId)

      // Check if user has manager console access
      const hasManagerRole = ['manager', 'admin', 'owner'].includes(mockUser.role)
      const hasEnterprisePlan = mockUser.organizationPlan === 'enterprise'

      setHasAccess(hasManagerRole && hasEnterprisePlan)
    } catch (error) {
      console.error('Error checking access:', error)
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Access denied - not manager role
  if (!['manager', 'admin', 'owner'].includes(userRole)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="p-8 bg-gray-900/50 border-gray-700">
            <Shield className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Access Restricted</h1>
            <p className="text-gray-400 mb-6">
              The Manager Console is only available to users with Manager, Admin, or Owner roles.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.back()} variant="outline" className="border-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => router.push('/organization')} className="bg-blue-600 hover:bg-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Organization Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Access denied - not Enterprise plan
  if (organizationPlan !== 'enterprise') {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="p-8 bg-gray-900/50 border-gray-700">
            <Crown className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Enterprise Feature</h1>
            <p className="text-gray-400 mb-6">
              The Manager Console is an exclusive feature of our Enterprise plan. Upgrade to unlock powerful team management and collaboration tools.
            </p>
            
            <Alert className="mb-6 border-yellow-500 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                <strong>Current Plan:</strong> {organizationPlan || 'Basic'}
                <br />
                <strong>Required:</strong> Enterprise Plan
              </AlertDescription>
            </Alert>

            {/* Enterprise Features Highlight */}
            <div className="text-left bg-gray-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-3">Manager Console Features:</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Real-time employee activity monitoring</li>
                <li>• Smart collaboration opportunity alerts</li>
                <li>• Performance insights and analytics</li>
                <li>• One-click team communication tools</li>
                <li>• Cross-employee opportunity detection</li>
                <li>• Competitive intelligence sharing</li>
                <li>• Predictive team analytics</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.back()} variant="outline" className="border-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => router.push('/subscribe')} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Enterprise
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Access granted - show Manager Console
  return (
    <div className="min-h-screen bg-black">
      <ManagerConsole 
        organizationId={organizationId}
        managerId="demo-manager-123"
      />
    </div>
  )
}