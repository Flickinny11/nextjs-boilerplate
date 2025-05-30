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
import type { CRMType } from "src/lib/crmServices";

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
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="crm" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crm">CRM Integration</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
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
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">API Usage & Credits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Available Credits</label>
                    <div className="text-2xl font-bold">{userCredits}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Used This Month</label>
                    <div className="text-2xl font-bold">{usedCredits}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Top Up Credits</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="p-8"
                    onClick={() => handleTopUp("basic")}
                    disabled={loading}
                  >
                    <div>
                      <div className="text-lg font-bold">500 Credits</div>
                      <div className="text-sm text-gray-500">$49.99</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="p-8"
                    onClick={() => handleTopUp("pro")}
                    disabled={loading}
                  >
                    <div>
                      <div className="text-lg font-bold">1,000 Credits</div>
                      <div className="text-sm text-gray-500">$89.99</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="p-8"
                    onClick={() => handleTopUp("enterprise")}
                    disabled={loading}
                  >
                    <div>
                      <div className="text-lg font-bold">2,500 Credits</div>
                      <div className="text-sm text-gray-500">$199.99</div>
                    </div>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">OpenAI API Key</label>
                    <Input
                      type="password"
                      placeholder="Enter your OpenAI API key"
                      value={openAIKey}
                      onChange={onChangeOpenAIKey}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Anthropic API Key</label>
                    <Input
                      type="password"
                      placeholder="Enter your Anthropic API key"
                      value={anthropicKey}
                      onChange={onChangeAnthropicKey}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
