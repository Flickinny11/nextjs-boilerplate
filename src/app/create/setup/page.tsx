"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  ArrowLeft,
  Check,
  Settings,
  Palette,
  Zap,
  Shield,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { canvaIntegrationService } from '@/lib/canvaIntegrationService';
import { adobeExpressService } from '@/lib/adobeExpressService';
import { useRouter } from 'next/navigation';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const integrationOptions = [
  {
    id: 'canva',
    name: 'Canva',
    description: 'Professional design tools with templates and brand management',
    icon: '🎨',
    color: '#8B5CF6',
    features: [
      'Drag-and-drop design editor',
      'Thousands of templates',
      'Brand kit management',
      'Team collaboration',
      'AI-powered design suggestions'
    ],
    pricing: 'Free tier available, Pro from $14.99/month'
  },
  {
    id: 'adobe',
    name: 'Adobe Express',
    description: 'Advanced creative suite with professional editing capabilities',
    icon: '🚀',
    color: '#FF0040',
    features: [
      'Professional photo editing',
      'Video creation tools',
      'Animation capabilities',
      'Creative Cloud integration',
      'Premium fonts and assets'
    ],
    pricing: 'Free tier available, Premium from $9.99/month'
  }
];

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [authStates, setAuthStates] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  const [authErrors, setAuthErrors] = useState<Record<string, string>>({});

  const steps: SetupStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Creative Studio',
      description: 'Set up your design integrations to unlock powerful creative tools',
      completed: true
    },
    {
      id: 'platforms',
      title: 'Choose Platforms',
      description: 'Select which creative platforms you want to integrate',
      completed: selectedPlatforms.length > 0
    },
    {
      id: 'authentication',
      title: 'Connect Accounts',
      description: 'Securely connect your accounts to start creating',
      completed: Object.values(authStates).some(state => state === 'success')
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'You\'re ready to start creating amazing content',
      completed: false
    }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleAuthentication = async (platformId: string) => {
    try {
      setAuthStates(prev => ({ ...prev, [platformId]: 'loading' }));
      setAuthErrors(prev => ({ ...prev, [platformId]: '' }));

      // Get current user ID (in a real app, this would come from your auth system)
      const userId = 'demo-user-id';

      let authResult;
      if (platformId === 'canva') {
        authResult = await canvaIntegrationService.initiateOAuth(userId);
      } else if (platformId === 'adobe') {
        authResult = await adobeExpressService.initiateOAuth(userId);
      } else {
        throw new Error('Unknown platform');
      }

      if (authResult.success && authResult.authUrl) {
        // In a real implementation, you would open this in a popup or redirect
        // For demo purposes, we'll simulate success after a delay
        setTimeout(() => {
          setAuthStates(prev => ({ ...prev, [platformId]: 'success' }));
        }, 2000);
        
        // Open auth URL in new window (for demo, just show success)
        console.log(`Auth URL for ${platformId}:`, authResult.authUrl);
      } else {
        throw new Error(authResult.error || 'Authentication failed');
      }
    } catch (error) {
      console.error(`${platformId} authentication error:`, error);
      setAuthStates(prev => ({ ...prev, [platformId]: 'error' }));
      setAuthErrors(prev => ({ 
        ...prev, 
        [platformId]: error instanceof Error ? error.message : 'Authentication failed'
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Determine where to redirect based on connected platforms
    if (authStates.canva === 'success') {
      router.push('/create/canva');
    } else if (authStates.adobe === 'success') {
      router.push('/create/adobe');
    } else {
      router.push('/create');
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to Creative Studio</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Integrate professional design tools directly into CaptureIT LS. Create stunning visuals, 
                manage brand assets, and leverage AI-powered design assistance all in one place.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                <Settings className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Easy Setup</h3>
                <p className="text-sm text-gray-400">Connect your accounts in just a few clicks</p>
              </Card>
              <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                <Shield className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Secure</h3>
                <p className="text-sm text-gray-400">OAuth 2.0 authentication keeps your data safe</p>
              </Card>
              <Card className="p-4 bg-green-500/10 border-green-500/20">
                <Zap className="w-8 h-8 text-green-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Powerful</h3>
                <p className="text-sm text-gray-400">AI-enhanced workflows boost productivity</p>
              </Card>
            </div>
          </div>
        );

      case 'platforms':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Creative Platforms</h2>
              <p className="text-lg text-gray-300">
                Select which platforms you want to integrate. You can always add more later.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {integrationOptions.map((platform) => (
                <motion.div
                  key={platform.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`p-6 cursor-pointer transition-all duration-300 ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10'
                        : 'border-gray-800 hover:border-gray-600 bg-black/50'
                    }`}
                    style={{
                      borderColor: selectedPlatforms.includes(platform.id) ? platform.color : undefined
                    }}
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ backgroundColor: platform.color + '20' }}
                      >
                        {platform.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-white">{platform.name}</h3>
                          {selectedPlatforms.includes(platform.id) && (
                            <Check className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                        <p className="text-gray-300 mb-3">{platform.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <h4 className="text-sm font-medium text-gray-200">Key Features:</h4>
                          <ul className="space-y-1">
                            {platform.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-sm text-gray-400 flex items-center">
                                <div className="w-1 h-1 bg-gray-500 rounded-full mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
                          {platform.pricing}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Connect Your Accounts</h2>
              <p className="text-lg text-gray-300">
                Securely connect your selected platforms using OAuth 2.0 authentication
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {selectedPlatforms.map((platformId) => {
                const platform = integrationOptions.find(p => p.id === platformId);
                if (!platform) return null;

                const authState = authStates[platformId] || 'idle';
                const error = authErrors[platformId];

                return (
                  <Card key={platformId} className="p-6 bg-black/50 border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                          style={{ backgroundColor: platform.color + '20' }}
                        >
                          {platform.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{platform.name}</h3>
                          <p className="text-sm text-gray-400">
                            {authState === 'idle' && 'Ready to connect'}
                            {authState === 'loading' && 'Connecting...'}
                            {authState === 'success' && 'Connected successfully'}
                            {authState === 'error' && 'Connection failed'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {authState === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {authState === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                        
                        <Button
                          onClick={() => handleAuthentication(platformId)}
                          disabled={authState === 'loading' || authState === 'success'}
                          variant={authState === 'success' ? 'outline' : 'default'}
                          className={
                            authState === 'success' 
                              ? 'border-green-500 text-green-400'
                              : 'bg-purple-600 hover:bg-purple-700'
                          }
                        >
                          {authState === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          {authState === 'success' && <Check className="w-4 h-4 mr-2" />}
                          {authState === 'idle' && <ExternalLink className="w-4 h-4 mr-2" />}
                          {authState === 'error' && <AlertCircle className="w-4 h-4 mr-2" />}
                          
                          {authState === 'idle' && 'Connect'}
                          {authState === 'loading' && 'Connecting'}
                          {authState === 'success' && 'Connected'}
                          {authState === 'error' && 'Retry'}
                        </Button>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {selectedPlatforms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No platforms selected. Go back to choose platforms first.</p>
              </div>
            )}
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Setup Complete!</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Your creative studio is ready. You can now create stunning designs, 
                manage brand assets, and leverage AI-powered tools.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {selectedPlatforms.map(platformId => {
                const platform = integrationOptions.find(p => p.id === platformId);
                const isConnected = authStates[platformId] === 'success';
                
                if (!platform) return null;

                return (
                  <Card key={platformId} className="p-4 bg-black/50 border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: platform.color + '20' }}
                      >
                        {platform.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{platform.name}</h3>
                        <p className="text-sm text-gray-400">
                          {isConnected ? 'Connected and ready' : 'Not connected'}
                        </p>
                      </div>
                      {isConnected && <CheckCircle className="w-5 h-5 text-green-400" />}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === currentStep 
                    ? 'bg-purple-600 text-white'
                    : step.completed || index < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {step.completed || index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-16 mx-2 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-white">{steps[currentStep].title}</h1>
          <p className="text-gray-400">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto mt-12 flex items-center justify-between">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
          className="border-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentStep === 1 && selectedPlatforms.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}