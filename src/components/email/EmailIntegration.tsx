"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Plus, 
  Check, 
  X, 
  Settings, 
  RefreshCw,
  ExternalLink,
  Shield
} from 'lucide-react';
import { 
  emailIntegrationService, 
  EMAIL_PROVIDERS,
  EmailProvider,
  EmailAccount 
} from '@/lib/emailIntegrationService';

interface EmailIntegrationProps {
  onAccountConnected?: (account: EmailAccount) => void;
}

export function EmailIntegration({ onAccountConnected }: EmailIntegrationProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<EmailAccount[]>([]);
  const [showProviders, setShowProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<EmailProvider | null>(null);
  const [manualConfig, setManualConfig] = useState({
    email: '',
    password: '',
    imapHost: '',
    imapPort: '993',
    smtpHost: '',
    smtpPort: '587'
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Load stored accounts on component mount
    emailIntegrationService.loadStoredAccounts();
    setConnectedAccounts(emailIntegrationService.getConnectedAccounts());
  }, []);

  const handleProviderSelect = async (provider: EmailProvider) => {
    setSelectedProvider(provider);
    setIsConnecting(true);

    try {
      if (provider.isOAuth) {
        // Initiate OAuth flow
        const authUrl = await emailIntegrationService.initiateOAuthFlow(provider.id);
        
        // Open OAuth window
        const popup = window.open(
          authUrl, 
          'oauth_popup', 
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Listen for OAuth completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setIsConnecting(false);
            setSelectedProvider(null);
            
            // Refresh connected accounts
            setConnectedAccounts(emailIntegrationService.getConnectedAccounts());
          }
        }, 1000);
      } else {
        // Show manual configuration form
        setShowProviders(false);
      }
    } catch (error) {
      console.error('Provider connection error:', error);
      setIsConnecting(false);
      setSelectedProvider(null);
    }
  };

  const handleManualConnect = async () => {
    if (!selectedProvider || !manualConfig.email || !manualConfig.password) {
      return;
    }

    setIsConnecting(true);
    try {
      const account = await emailIntegrationService.connectManualAccount(
        selectedProvider.id,
        manualConfig.email,
        manualConfig.password,
        {
          imapHost: manualConfig.imapHost,
          imapPort: parseInt(manualConfig.imapPort),
          smtpHost: manualConfig.smtpHost,
          smtpPort: parseInt(manualConfig.smtpPort)
        }
      );

      setConnectedAccounts(emailIntegrationService.getConnectedAccounts());
      setSelectedProvider(null);
      setManualConfig({
        email: '',
        password: '',
        imapHost: '',
        imapPort: '993',
        smtpHost: '',
        smtpPort: '587'
      });

      if (onAccountConnected) {
        onAccountConnected(account);
      }
    } catch (error) {
      console.error('Manual connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    const success = await emailIntegrationService.disconnectAccount(accountId);
    if (success) {
      setConnectedAccounts(emailIntegrationService.getConnectedAccounts());
    }
  };

  const handleSync = async (accountId: string) => {
    try {
      await emailIntegrationService.syncMessages(accountId);
      // Update last sync time in UI
      setConnectedAccounts(emailIntegrationService.getConnectedAccounts());
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Email Integration</h2>
          <p className="text-gray-400">Connect your email accounts to sync messages and automate workflows</p>
        </div>
        <Button 
          onClick={() => setShowProviders(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Email Account
        </Button>
      </div>

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectedAccounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: account.provider.color + '20' }}
                  >
                    {account.provider.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{account.provider.name}</h3>
                    <p className="text-sm text-gray-400 truncate max-w-[150px]">{account.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {account.isConnected ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last sync:</span>
                  <span>{account.lastSync ? new Date(account.lastSync).toLocaleDateString() : 'Never'}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSync(account.id)}
                    className="flex-1 text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDisconnect(account.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {connectedAccounts.length === 0 && (
          <div className="col-span-full">
            <Card className="p-8 bg-black/30 backdrop-blur-lg border-gray-800 border-dashed text-center">
              <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Email Accounts Connected</h3>
              <p className="text-gray-500 mb-4">Connect your email accounts to enable message syncing and automation</p>
              <Button 
                onClick={() => setShowProviders(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect First Account
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Provider Selection Modal */}
      {showProviders && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowProviders(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Choose Email Provider</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowProviders(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {EMAIL_PROVIDERS.map((provider) => (
                <motion.div
                  key={provider.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="p-4 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-gray-600 cursor-pointer transition-colors"
                    onClick={() => handleProviderSelect(provider)}
                  >
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl"
                        style={{ backgroundColor: provider.color + '20' }}
                      >
                        {provider.icon}
                      </div>
                      <h4 className="font-semibold text-white mb-1">{provider.name}</h4>
                      <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                        {provider.isOAuth ? (
                          <>
                            <Shield className="w-3 h-3" />
                            <span>OAuth</span>
                          </>
                        ) : (
                          <>
                            <Settings className="w-3 h-3" />
                            <span>Manual</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-400 mb-1">Security & Privacy</h4>
                  <p className="text-sm text-gray-300">
                    Your email credentials are encrypted and stored securely. We only access the permissions you explicitly grant.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Manual Configuration Modal */}
      {selectedProvider && !selectedProvider.isOAuth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedProvider(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Connect {selectedProvider.name}</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedProvider(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={manualConfig.email}
                  onChange={(e) => setManualConfig(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-800 border-gray-700 mt-1"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password / App Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={manualConfig.password}
                  onChange={(e) => setManualConfig(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-gray-800 border-gray-700 mt-1"
                  placeholder="Your email password"
                />
              </div>

              <div className="flex space-x-4 mt-6">
                <Button
                  onClick={() => setSelectedProvider(null)}
                  variant="outline"
                  className="flex-1"
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleManualConnect}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isConnecting || !manualConfig.email || !manualConfig.password}
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}