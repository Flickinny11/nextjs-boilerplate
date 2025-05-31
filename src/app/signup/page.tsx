"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { 
  User, 
  Building2, 
  Shield, 
  CheckCircle2,
  Globe,
  Briefcase,
  Mail,
  MapPin,
  ArrowRight,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface SignupData {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  zipCode: string;
  accountEmail: string;
  companyName: string;
  companyWebsite: string;
  jobTitle: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    zipCode: '',
    accountEmail: '',
    companyName: '',
    companyWebsite: '',
    jobTitle: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { login } = useAuth();

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    const requiredFields: (keyof SignupData)[] = [
      'firstName', 'lastName', 'city', 'state', 'zipCode', 
      'accountEmail', 'companyName', 'companyWebsite', 'jobTitle', 
      'password', 'confirmPassword'
    ];

    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.accountEmail && !emailRegex.test(formData.accountEmail)) {
      errors.push('Please enter a valid email address');
    }

    // Website validation
    const websiteRegex = /^https?:\/\/.+\..+/;
    if (formData.companyWebsite && !websiteRegex.test(formData.companyWebsite)) {
      errors.push('Please enter a valid website URL (including http:// or https://)');
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setMessage({ type: 'error', text: errors.join(', ') });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/signup/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'Account created successfully! Redirecting...' });
        
        // Auto-redirect the user
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create account');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to create account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return validateForm().length === 0;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4"
          >
            Join CaptureIT LS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            Complete your business profile to get started with AI-powered marketing automation
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <User className="w-6 h-6 mr-3 text-purple-500" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-white">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="accountEmail" className="text-white">Email Address *</Label>
                    <Input
                      id="accountEmail"
                      type="email"
                      value={formData.accountEmail}
                      onChange={(e) => handleInputChange('accountEmail', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="city" className="text-white">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-white">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-white">Zip Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="12345"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-blue-500" />
                  Business Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName" className="text-white">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Your Company Name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="companyWebsite" className="text-white">Company Website *</Label>
                    <Input
                      id="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="https://yourcompany.com"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="jobTitle" className="text-white">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Your Job Title"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-green-500" />
                  Account Security
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="password" className="text-white">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Minimum 8 characters"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="text-white">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-6 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-blue-400 font-semibold mb-2">Your Privacy is Protected</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      Your information is completely secure with military-grade encryption. We never sell your data, 
                      use it for advertising, or share it with third parties. It's exclusively used to provide you 
                      with personalized marketing solutions and enhance your CaptureIT experience.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center text-sm text-green-400">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        256-bit encryption
                      </div>
                      <div className="flex items-center text-sm text-green-400">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Never sold or shared
                      </div>
                      <div className="flex items-center text-sm text-green-400">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        GDPR compliant
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {message && (
                <Alert className={`${message.type === 'success' ? 'border-green-500/20 bg-green-900/20' : 'border-red-500/20 bg-red-900/20'}`}>
                  <AlertDescription className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col space-y-4">
                <Button 
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                >
                  {loading ? (
                    'Creating Account...'
                  ) : (
                    <>
                      Create My Account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-400 text-xs">
                  By creating an account, you agree to our{" "}
                  <a href="/terms" className="text-blue-500 hover:text-blue-400">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-500 hover:text-blue-400">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}