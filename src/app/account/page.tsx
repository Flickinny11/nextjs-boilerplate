"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  CreditCard, 
  Shield, 
  InfoIcon,
  CheckCircle2,
  Crown,
  Calendar,
  MapPin,
  Building2,
  Globe,
  Briefcase,
  Mail,
  Phone,
  Users,
  Target,
  Zap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface UserProfile {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  zipCode: string;
  accountEmail: string;
  companyName: string;
  companyWebsite: string;
  jobTitle: string;
  phone?: string;
  industry?: string;
  companySize?: string;
  marketingBudget?: string;
}

function AccountContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'account');
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    zipCode: '',
    accountEmail: '',
    companyName: '',
    companyWebsite: '',
    jobTitle: '',
    phone: '',
    industry: '',
    companySize: '',
    marketingBudget: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (searchParams?.get('tab')) {
      setActiveTab(searchParams.get('tab') || 'account');
    }
  }, [searchParams]);

  useEffect(() => {
    // Load profile data
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile/get');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleProfileSave = async () => {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'city', 'state', 'zipCode', 'accountEmail', 'companyName', 'companyWebsite', 'jobTitle'];
    const missingFields = requiredFields.filter(field => !profile[field as keyof UserProfile]);
    
    if (missingFields.length > 0) {
      setMessage({
        type: 'error',
        text: `Please fill in all required fields: ${missingFields.join(', ')}`
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile saved successfully!' });
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isRequiredFieldComplete = () => {
    const requiredFields = ['firstName', 'lastName', 'city', 'state', 'zipCode', 'accountEmail', 'companyName', 'companyWebsite', 'jobTitle'];
    return requiredFields.every(field => profile[field as keyof UserProfile]);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center mb-8">
          <User className="w-8 h-8 mr-3 text-purple-500" />
          <h1 className="text-3xl font-bold text-white">Account Management</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex">
            <TabsList className="flex-col h-auto bg-black/50 backdrop-blur-lg border border-gray-800 p-2">
              <TabsTrigger value="account" className="w-full justify-start mb-2">
                <CreditCard className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="profile" className="w-full justify-start mb-2">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="about" className="w-full justify-start mb-2">
                <InfoIcon className="w-4 h-4 mr-2" />
                About Us
              </TabsTrigger>
              <TabsTrigger value="logout" className="w-full justify-start text-red-400 hover:text-red-300">
                <Shield className="w-4 h-4 mr-2" />
                Logout
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 ml-6">
              <TabsContent value="account">
                <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                  <h2 className="text-2xl font-bold text-white mb-6">Account Status</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Account Status */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-white font-semibold">Account Status</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center">
                          <Crown className="w-5 h-5 text-purple-500 mr-3" />
                          <span className="text-white font-semibold">Current Tier</span>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-400">Professional</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                          <span className="text-white font-semibold">Next Payment</span>
                        </div>
                        <span className="text-gray-300">Jan 15, 2024</span>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Payment Information</h3>
                      
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                              <CreditCard className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-white font-semibold">Visa ending in 4242</div>
                              <div className="text-gray-400 text-sm">Expires 12/25</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-white font-semibold mb-2">Billing Address</div>
                        <div className="text-gray-300 text-sm">
                          123 Business Ave<br />
                          Suite 100<br />
                          City, ST 12345
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    {!isRequiredFieldComplete() && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        Required Fields Missing
                      </Badge>
                    )}
                  </div>

                  <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-blue-400 font-semibold mb-1">Your Information is Secure</h3>
                        <p className="text-gray-300 text-sm">
                          The information you provide helps CaptureIT deliver personalized marketing solutions. 
                          Your data is encrypted, secure, and never shared with third parties. It's only used 
                          to enhance your experience and improve our services for you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Required Fields */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <span className="text-red-400 mr-1">*</span>
                        Required Information
                      </h3>
                      
                      <div>
                        <Label htmlFor="firstName" className="text-white">First Name *</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Enter your first name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Enter your last name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-white">City *</Label>
                          <Input
                            id="city"
                            value={profile.city}
                            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                            className="bg-gray-800 border-gray-600 text-white"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-white">State *</Label>
                          <Input
                            id="state"
                            value={profile.state}
                            onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                            className="bg-gray-800 border-gray-600 text-white"
                            placeholder="State"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="zipCode" className="text-white">Zip Code *</Label>
                        <Input
                          id="zipCode"
                          value={profile.zipCode}
                          onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="12345"
                        />
                      </div>

                      <div>
                        <Label htmlFor="accountEmail" className="text-white">Account Email *</Label>
                        <Input
                          id="accountEmail"
                          type="email"
                          value={profile.accountEmail}
                          onChange={(e) => setProfile({ ...profile, accountEmail: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Business Information
                      </h3>
                      
                      <div>
                        <Label htmlFor="companyName" className="text-white">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={profile.companyName}
                          onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Your Company Name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="companyWebsite" className="text-white">Company Website *</Label>
                        <Input
                          id="companyWebsite"
                          value={profile.companyWebsite}
                          onChange={(e) => setProfile({ ...profile, companyWebsite: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="jobTitle" className="text-white">Job Title *</Label>
                        <Input
                          id="jobTitle"
                          value={profile.jobTitle}
                          onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Your Job Title"
                        />
                      </div>

                      {/* Optional Fields */}
                      <h4 className="text-md font-semibold text-gray-300 mt-6">Optional Information</h4>
                      <p className="text-sm text-gray-400">
                        The more we know about you and your company, the better CaptureIT works for you.
                      </p>

                      <div>
                        <Label htmlFor="phone" className="text-white">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <Label htmlFor="industry" className="text-white">Industry</Label>
                        <Input
                          id="industry"
                          value={profile.industry}
                          onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="e.g., Commercial Roofing, HVAC, etc."
                        />
                      </div>

                      <div>
                        <Label htmlFor="companySize" className="text-white">Company Size</Label>
                        <Input
                          id="companySize"
                          value={profile.companySize}
                          onChange={(e) => setProfile({ ...profile, companySize: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="e.g., 1-10, 11-50, 51-200, 200+"
                        />
                      </div>

                      <div>
                        <Label htmlFor="marketingBudget" className="text-white">Monthly Marketing Budget</Label>
                        <Input
                          id="marketingBudget"
                          value={profile.marketingBudget}
                          onChange={(e) => setProfile({ ...profile, marketingBudget: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="e.g., $1,000-$5,000"
                        />
                      </div>
                    </div>
                  </div>

                  {message && (
                    <Alert className={`mb-4 ${message.type === 'success' ? 'border-green-500/20 bg-green-900/20' : 'border-red-500/20 bg-red-900/20'}`}>
                      <AlertDescription className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                        {message.text}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    onClick={handleProfileSave}
                    disabled={loading || !isRequiredFieldComplete()}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="about">
                <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                  <div className="max-w-4xl">
                    <h2 className="text-2xl font-bold text-white mb-6">About CaptureIT LS</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
                        <p className="text-gray-300 leading-relaxed">
                          CaptureIT LS is revolutionizing how businesses capture, manage, and convert leads through 
                          cutting-edge AI technology. We believe that every business deserves access to enterprise-level 
                          marketing automation and lead generation tools, regardless of size or budget.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">What We Do</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Target className="w-5 h-5 text-purple-500 mr-2" />
                              <h4 className="font-semibold text-white">Smart Lead Capture</h4>
                            </div>
                            <p className="text-gray-400 text-sm">
                              AI-powered lead identification and capture from multiple sources with intelligent qualification.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Zap className="w-5 h-5 text-blue-500 mr-2" />
                              <h4 className="font-semibold text-white">Marketing Automation</h4>
                            </div>
                            <p className="text-gray-400 text-sm">
                              Automated campaigns, content creation, and multi-platform marketing orchestration.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Users className="w-5 h-5 text-green-500 mr-2" />
                              <h4 className="font-semibold text-white">CRM Integration</h4>
                            </div>
                            <p className="text-gray-400 text-sm">
                              Seamless integration with your existing CRM and business tools for unified operations.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Briefcase className="w-5 h-5 text-orange-500 mr-2" />
                              <h4 className="font-semibold text-white">Business Intelligence</h4>
                            </div>
                            <p className="text-gray-400 text-sm">
                              Advanced analytics, competitor research, and market insights to drive strategic decisions.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Our Technology</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">
                          Built on the latest AI models including Claude Opus 4, our platform combines machine learning, 
                          natural language processing, and advanced automation to deliver results that were previously 
                          only available to Fortune 500 companies.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">99.9%</div>
                            <div className="text-xs text-gray-400">Uptime</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">< 500ms</div>
                            <div className="text-xs text-gray-400">Response Time</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">256-bit</div>
                            <div className="text-xs text-gray-400">Encryption</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-orange-400">24/7</div>
                            <div className="text-xs text-gray-400">Support</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Contact Us</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center p-3 bg-gray-800/30 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-500 mr-3" />
                            <div>
                              <div className="text-white font-semibold">Email</div>
                              <div className="text-gray-400 text-sm">support@captureit.com</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-3 bg-gray-800/30 rounded-lg">
                            <Phone className="w-5 h-5 text-green-500 mr-3" />
                            <div>
                              <div className="text-white font-semibold">Phone</div>
                              <div className="text-gray-400 text-sm">1-800-CAPTURE</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-3 bg-gray-800/30 rounded-lg">
                            <Globe className="w-5 h-5 text-purple-500 mr-3" />
                            <div>
                              <div className="text-white font-semibold">Website</div>
                              <div className="text-gray-400 text-sm">www.captureit.com</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="logout">
                <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 text-center">
                  <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">Sign Out</h2>
                  <p className="text-gray-400 mb-6">Are you sure you want to sign out of your account?</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" onClick={() => setActiveTab('account')}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        // Handle logout
                        window.location.href = '/login';
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}