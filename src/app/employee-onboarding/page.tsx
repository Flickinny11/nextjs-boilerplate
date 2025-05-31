"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users,
  Building2,
  Shield,
  Crown,
  CheckCircle,
  User,
  Mail,
  Briefcase,
  Key,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function EmployeeOnboardingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [organizationInfo, setOrganizationInfo] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    title: '',
    profilePicture: '',
    inviteCode: '',
    phone: '',
    department: ''
  })

  const inviteCode = searchParams.get('code')

  useEffect(() => {
    if (inviteCode) {
      setFormData(prev => ({ ...prev, inviteCode }))
      loadOrganizationInfo()
    }
  }, [inviteCode])

  const loadOrganizationInfo = async () => {
    try {
      // In a real application, this would validate the invite code and fetch organization info
      // Mock Enterprise organization data
      const mockOrgInfo = {
        id: 'org_enterprise_123',
        name: 'Acme Corporation',
        plan: 'Enterprise',
        managerConsoleEnabled: true,
        managerName: 'Sarah Williams',
        managerTitle: 'Sales Manager',
        features: [
          'Manager Console Dashboard',
          'Smart Collaboration Alerts',
          'Performance Insights',
          'Team Communication Tools',
          'Cross-Employee Opportunities'
        ]
      }
      setOrganizationInfo(mockOrgInfo)
    } catch (error) {
      console.error('Error loading organization info:', error)
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      // In a real application, this would create the employee account and link it to the organization
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      // Redirect to dashboard or success page
      router.push('/dashboard?onboarding=complete')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const steps = [
    { number: 1, title: 'Welcome', icon: Users },
    { number: 2, title: 'Profile', icon: User },
    { number: 3, title: 'Role', icon: Briefcase },
    { number: 4, title: 'Complete', icon: CheckCircle }
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to {organizationInfo?.name}!
              </h2>
              <p className="text-gray-400">
                You've been invited to join an amazing team using CaptureIT LS
              </p>
            </div>

            {organizationInfo?.managerConsoleEnabled && (
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-purple-400 mr-3" />
                  <div>
                    <h3 className="text-purple-400 font-semibold">🚀 Enterprise Organization</h3>
                    <p className="text-purple-300 text-sm">Manager Console Enabled</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm text-center mb-4">
                  This organization uses our advanced Manager Console, which means your manager 
                  has special tools to help you succeed and collaborate better with your team.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-purple-300">
                  {organizationInfo.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h3 className="text-blue-400 font-medium mb-2">What's Next?</h3>
              <p className="text-gray-300 text-sm">
                We'll help you set up your profile and get you connected to your team. 
                This should only take a few minutes.
              </p>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <User className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Profile</h2>
              <p className="text-gray-400">Tell us about yourself</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Briefcase className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Your Role</h2>
              <p className="text-gray-400">Help us understand your position</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Sales Representative"
                />
              </div>

              <div>
                <Label htmlFor="department" className="text-gray-300">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => updateFormData('department', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Sales"
                />
              </div>

              <div>
                <Label htmlFor="inviteCode" className="text-gray-300">Invitation Code *</Label>
                <Input
                  id="inviteCode"
                  value={formData.inviteCode}
                  onChange={(e) => updateFormData('inviteCode', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter your invitation code"
                />
              </div>
            </div>

            {organizationInfo?.managerConsoleEnabled && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-green-400 font-medium text-sm">Manager Console Integration</h4>
                    <p className="text-green-300 text-xs mt-1">
                      Your account will be automatically connected to {organizationInfo.managerName}'s 
                      Manager Console, enabling enhanced collaboration and support.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                All Set, {formData.fullName}!
              </h2>
              <p className="text-gray-400">
                Your account is ready to be created
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-white font-medium mb-4">Account Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Title:</span>
                  <span className="text-white">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Organization:</span>
                  <span className="text-white">{organizationInfo?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-white">{organizationInfo?.plan}</span>
                    {organizationInfo?.plan === 'Enterprise' && (
                      <Crown className="w-3 h-3 text-yellow-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {organizationInfo?.managerConsoleEnabled && (
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium text-sm mb-2">🎯 Manager Console Benefits</h4>
                <ul className="text-xs text-blue-300 space-y-1">
                  <li>• Your manager will receive smart alerts to help you succeed</li>
                  <li>• Automatic collaboration opportunities with teammates</li>
                  <li>• Performance insights and improvement suggestions</li>
                  <li>• Enhanced team communication and support</li>
                </ul>
              </div>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-2 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Indicator */}
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
          </p>
        </div>

        {/* Content Card */}
        <Card className="p-8 bg-gray-900/50 border-gray-700">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="border-gray-600"
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={loading || (currentStep === 2 && (!formData.fullName || !formData.email)) || 
                       (currentStep === 3 && (!formData.title || !formData.inviteCode))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : currentStep === 4 ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Creating Account...' : currentStep === 4 ? 'Create Account' : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}