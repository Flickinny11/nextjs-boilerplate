"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Alert, AlertDescription } from "components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Badge } from "components/ui/badge";
import { Crown } from "lucide-react";
import type { CRMType } from "src/lib/crmServices";
import { APIKeyManager } from "@/components/settings/APIKeyManager";
import { TIER_CONFIGURATIONS } from "@/lib/tierModelConfig";

interface CRMConfig {
  type: CRMType;
  apiKey: string;
  baseUrl?: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);
  const [crmConfig, setCrmConfig] = useState<CRMConfig>({
    type: "salesforce",
    apiKey: "",
    baseUrl: "",
  });

  const [openAIKey, setOpenAIKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [userCredits, setUserCredits] = useState(0);
  const [usedCredits, setUsedCredits] = useState(0);
  const [userTier, setUserTier] = useState<'entry' | 'professional' | 'business' | 'premium'>('entry');
  const [userId] = useState('demo-user'); // In real app, get from auth context

  useEffect(() => {
    // Fetch user settings and credits on mount
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings/get");
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        if (data.crm) setCrmConfig(data.crm);
        if (data.apiKeys) {
          setOpenAIKey(data.apiKeys.openai || "");
          setAnthropicKey(data.apiKeys.anthropic || "");
        }
        if (data.credits) {
          setUserCredits(data.credits.available);
          setUsedCredits(data.credits.used);
          setUserTier(data.credits.tier || 'entry');
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchSettings();
  }, []);

  const handleCRMTest = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/crm/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(crmConfig),
      });

      if (!response.ok) {
        throw new Error("Failed to test CRM connection");
      }

      setMessage({ type: "success", text: "CRM connection successful!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to connect to CRM. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crm: crmConfig,
          apiKeys: {
            openai: openAIKey,
            anthropic: anthropicKey,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to save settings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (planId: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/payment/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      const data = await response.json();
      setUserCredits((prev) => prev + (data.credits || 0));
      setMessage({
        type: "success",
        text: `Successfully added ${data.credits} credits`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Payment failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onChangeCRMType = (value: CRMType) => {
    setCrmConfig({ ...crmConfig, type: value });
  };

  const onChangeCRMApiKey = (e: ChangeEvent<HTMLInputElement>) => {
    setCrmConfig({ ...crmConfig, apiKey: e.target.value });
  };

  const onChangeCRMBaseUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setCrmConfig({ ...crmConfig, baseUrl: e.target.value });
  };

  const onChangeOpenAIKey = (e: ChangeEvent<HTMLInputElement>) => {
    setOpenAIKey(e.target.value);
  };

  const onChangeAnthropicKey = (e: ChangeEvent<HTMLInputElement>) => {
    setAnthropicKey(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <Badge 
          variant="outline" 
          className={`${
            userTier === 'premium' 
              ? 'text-purple-400 border-purple-400' 
              : userTier === 'business'
              ? 'text-blue-400 border-blue-400'
              : userTier === 'professional'
              ? 'text-green-400 border-green-400'
              : 'text-gray-400 border-gray-400'
          }`}
        >
          {userTier === 'premium' && <Crown className="w-3 h-3 mr-1" />}
          {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan
        </Badge>
      </div>

      <Tabs defaultValue="crm" className="w-full">
        <TabsList className={`grid w-full ${userTier === 'premium' ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="crm">CRM Integration</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="tier">Tier Information</TabsTrigger>
          {userTier === 'premium' && (
            <TabsTrigger value="premium-apis" className="text-purple-400">
              <Crown className="w-4 h-4 mr-1" />
              Premium API Keys
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="crm">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">CRM Platform</label>
                <Select value={crmConfig.type} onValueChange={onChangeCRMType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CRM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your CRM API key"
                  value={crmConfig.apiKey}
                  onChange={onChangeCRMApiKey}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Base URL (Optional)</label>
                <Input
                  placeholder="Enter CRM base URL if required"
                  value={crmConfig.baseUrl}
                  onChange={onChangeCRMBaseUrl}
                />
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleCRMTest} disabled={loading}>
                  {loading ? "Testing..." : "Test Connection"}
                </Button>
                <Button onClick={handleSaveSettings} disabled={loading} variant="outline">
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
              </div>

              {message && (
                <Alert variant={message.type === "success" ? "default" : "destructive"}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">API Usage & Credits</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-400">Available Credits</label>
                    <div className="text-2xl font-bold text-white">{userCredits.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-400">Used This Month</label>
                    <div className="text-2xl font-bold text-white">{usedCredits.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-400">Monthly Limit</label>
                    <div className="text-2xl font-bold text-white">
                      {TIER_CONFIGURATIONS[userTier]?.maxCreditsPerMonth.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-400">Current Tier</label>
                    <div className="text-lg font-bold text-white capitalize">{userTier}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Legacy API Configuration</h3>
                <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 font-semibold">⚠️ Legacy Settings</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    These settings are for backward compatibility. Premium users should use the new comprehensive API Key Management system.
                  </p>
                </div>
                <div className="space-y-4 opacity-60">
                  <div>
                    <label className="text-sm font-medium">OpenAI API Key (Legacy)</label>
                    <Input
                      type="password"
                      placeholder="Enter your OpenAI API key"
                      value={openAIKey}
                      onChange={onChangeOpenAIKey}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Anthropic API Key (Legacy)</label>
                    <Input
                      type="password"
                      placeholder="Enter your Anthropic API key"
                      value={anthropicKey}
                      onChange={onChangeAnthropicKey}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "Saving..." : "Save Legacy Settings"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tier">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Current Plan: {userTier.charAt(0).toUpperCase() + userTier.slice(1)}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Plan Features</h4>
                    <ul className="space-y-2">
                      {TIER_CONFIGURATIONS[userTier]?.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-300">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Plan Limits</h4>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">AI Models Available</div>
                      <div className="text-white font-semibold">
                        {TIER_CONFIGURATIONS[userTier]?.allowedModels.length || 0} models
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">Monthly Credits</div>
                      <div className="text-white font-semibold">
                        {TIER_CONFIGURATIONS[userTier]?.maxCreditsPerMonth.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {userTier !== 'premium' && (
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-semibold">Upgrade to Premium</span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Get access to unlimited API key management, all AI models, and use your own API keys to avoid credit costs.
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Upgrade Now
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {userTier === 'premium' && (
          <TabsContent value="premium-apis">
            <Card className="p-6">
              <APIKeyManager userId={userId} userTier="premium" />
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
