"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Key, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Settings,
  Zap,
  Image,
  Video,
  Mic
} from "lucide-react";
import { 
  ALL_PROVIDERS, 
  AI_PROVIDERS, 
  IMAGE_PROVIDERS, 
  VIDEO_PROVIDERS, 
  AUDIO_PROVIDERS,
  apiKeyService,
  type UserAPIKey,
  type APIKeyConfig 
} from "@/lib/apiKeyManagement";

interface APIKeyManagerProps {
  userId: string;
  userTier: 'premium'; // Only available for premium users
}

export function APIKeyManager({ userId, userTier }: APIKeyManagerProps) {
  const [userAPIKeys, setUserAPIKeys] = useState<UserAPIKey[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [keyValues, setKeyValues] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserAPIKeys();
  }, [userId]);

  const loadUserAPIKeys = async () => {
    try {
      const keys = await apiKeyService.getUserAPIKeys(userId);
      setUserAPIKeys(keys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const handleAddAPIKey = async () => {
    if (!selectedProvider) return;
    
    setLoading(true);
    try {
      await apiKeyService.addAPIKey(userId, selectedProvider, keyValues);
      await loadUserAPIKeys();
      setIsAddDialogOpen(false);
      setSelectedProvider('');
      setKeyValues({});
    } catch (error) {
      console.error('Failed to add API key:', error);
    }
    setLoading(false);
  };

  const handleDeleteAPIKey = async (keyId: string) => {
    try {
      await apiKeyService.deleteAPIKey(userId, keyId);
      await loadUserAPIKeys();
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const handleToggleStatus = async (keyId: string, currentStatus: boolean) => {
    try {
      await apiKeyService.updateAPIKeyStatus(userId, keyId, !currentStatus);
      await loadUserAPIKeys();
    } catch (error) {
      console.error('Failed to update API key status:', error);
    }
  };

  const renderProvidersByCategory = (providers: Record<string, APIKeyConfig>, icon: React.ReactNode) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(providers).map(([key, provider]) => (
        <Card 
          key={key}
          className={`p-4 cursor-pointer transition-all hover:border-blue-500 ${
            selectedProvider === key ? 'border-blue-500 bg-blue-50/5' : 'border-gray-700'
          }`}
          onClick={() => setSelectedProvider(key)}
        >
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 className="font-semibold text-white">{provider.name}</h3>
              <p className="text-sm text-gray-400">{provider.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderKeyFields = (provider: APIKeyConfig) => (
    <div className="space-y-4 mt-4">
      {provider.keyFields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className="text-white">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={keyValues[field.name] || ''}
            onChange={(e) => setKeyValues(prev => ({
              ...prev,
              [field.name]: e.target.value
            }))}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>
      ))}
    </div>
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Zap className="w-5 h-5 text-blue-500" />;
      case 'image': return <Image className="w-5 h-5 text-green-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'audio': return <Mic className="w-5 h-5 text-orange-500" />;
      default: return <Key className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-white">API Key Management</h2>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            Premium Feature
          </Badge>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Add New API Key</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600">
                  <Zap className="w-4 h-4 mr-2" />
                  AI Models
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-green-600">
                  <Image className="w-4 h-4 mr-2" />
                  Image Gen
                </TabsTrigger>
                <TabsTrigger value="video" className="data-[state=active]:bg-purple-600">
                  <Video className="w-4 h-4 mr-2" />
                  Video Gen
                </TabsTrigger>
                <TabsTrigger value="audio" className="data-[state=active]:bg-orange-600">
                  <Mic className="w-4 h-4 mr-2" />
                  Audio Gen
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">AI Language Models</h3>
                {renderProvidersByCategory(AI_PROVIDERS, <Zap className="w-5 h-5 text-blue-500" />)}
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Image Generation Services</h3>
                {renderProvidersByCategory(IMAGE_PROVIDERS, <Image className="w-5 h-5 text-green-500" />)}
              </TabsContent>
              
              <TabsContent value="video" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Video Generation Services (2025)</h3>
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-semibold">Latest 2025 Services</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    These are the newest video generation services available in 2025, including Runway Gen-4, Gen-4 Turbo, and other cutting-edge platforms.
                  </p>
                </div>
                {renderProvidersByCategory(VIDEO_PROVIDERS, <Video className="w-5 h-5 text-purple-500" />)}
              </TabsContent>
              
              <TabsContent value="audio" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Audio Generation Services</h3>
                {renderProvidersByCategory(AUDIO_PROVIDERS, <Mic className="w-5 h-5 text-orange-500" />)}
              </TabsContent>
            </Tabs>
            
            {selectedProvider && (
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Configure {ALL_PROVIDERS[selectedProvider].name}
                </h4>
                {renderKeyFields(ALL_PROVIDERS[selectedProvider])}
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddAPIKey} 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Adding...' : 'Add API Key'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Current API Keys */}
      <div className="grid grid-cols-1 gap-4">
        {userAPIKeys.length === 0 ? (
          <Card className="p-8 text-center bg-gray-900/50 border-gray-700">
            <Key className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No API Keys Added</h3>
            <p className="text-gray-400 mb-4">
              Add your own API keys to use your preferred AI, image, and video generation services with your own billing.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First API Key
            </Button>
          </Card>
        ) : (
          userAPIKeys.map((apiKey) => {
            const provider = ALL_PROVIDERS[apiKey.provider];
            return (
              <Card key={apiKey.id} className="p-4 bg-gray-900/50 border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(provider?.category || 'ai')}
                    <div>
                      <h3 className="font-semibold text-white">{apiKey.name}</h3>
                      <p className="text-sm text-gray-400">
                        Added {apiKey.createdAt.toLocaleDateString()}
                        {apiKey.lastUsed && ` • Last used ${apiKey.lastUsed.toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={apiKey.isActive ? "default" : "secondary"}
                      className={apiKey.isActive ? "bg-green-600" : "bg-gray-600"}
                    >
                      {apiKey.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(apiKey.id, apiKey.isActive)}
                      className="border-gray-600"
                    >
                      {apiKey.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAPIKey(apiKey.id)}
                      className="border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Show masked API key info */}
                <div className="mt-3 space-y-2">
                  {Object.entries(apiKey.keys).map(([keyName, keyValue]) => (
                    <div key={keyName} className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 capitalize">{keyName}:</span>
                      <code className="text-sm bg-gray-800 px-2 py-1 rounded">
                        {showKeys[apiKey.id + keyName] 
                          ? keyValue 
                          : keyValue.substring(0, 8) + '...'}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowKeys(prev => ({
                          ...prev,
                          [apiKey.id + keyName]: !prev[apiKey.id + keyName]
                        }))}
                      >
                        {showKeys[apiKey.id + keyName] ? 
                          <EyeOff className="w-4 h-4" /> : 
                          <Eye className="w-4 h-4" />
                        }
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-semibold">Premium Feature</span>
        </div>
        <p className="text-sm text-gray-400">
          With your Premium plan, you can add unlimited API keys for any AI, image, or video generation service. 
          When you use these services, costs will be billed directly to your API keys instead of your CaptureIT LS credits.
        </p>
      </div>
    </div>
  );
}