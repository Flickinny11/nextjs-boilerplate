// Enhanced Email Client Integration Service
// Supports Gmail, Outlook, Yahoo, and other major email providers

export interface EmailProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  authUrl: string;
  scopes: string[];
  isOAuth: boolean;
}

export interface EmailAccount {
  id: string;
  email: string;
  provider: EmailProvider;
  accessToken?: string;
  refreshToken?: string;
  isConnected: boolean;
  lastSync?: Date;
}

export interface EmailMessage {
  id: string;
  subject: string;
  from: string;
  to: string[];
  body: string;
  date: Date;
  isRead: boolean;
  threadId?: string;
}

export interface EmailSyncOptions {
  includeRead?: boolean;
  sinceDays?: number;
  maxMessages?: number;
}

// Comprehensive list of email providers
export const EMAIL_PROVIDERS: EmailProvider[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    color: '#DB4437',
    authUrl: 'https://accounts.google.com/oauth2/auth',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.modify'
    ],
    isOAuth: true
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: '📮',
    color: '#0078D4',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scopes: [
      'https://graph.microsoft.com/Mail.Read',
      'https://graph.microsoft.com/Mail.Send',
      'https://graph.microsoft.com/Mail.ReadWrite'
    ],
    isOAuth: true
  },
  {
    id: 'yahoo',
    name: 'Yahoo Mail',
    icon: '🟣',
    color: '#6001D2',
    authUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
    scopes: ['mail-r', 'mail-w'],
    isOAuth: true
  },
  {
    id: 'icloud',
    name: 'iCloud Mail',
    icon: '☁️',
    color: '#007AFF',
    authUrl: '',
    scopes: [],
    isOAuth: false // Uses App-specific passwords
  },
  {
    id: 'protonmail',
    name: 'ProtonMail',
    icon: '🔒',
    color: '#6D4AFF',
    authUrl: '',
    scopes: [],
    isOAuth: false
  },
  {
    id: 'zoho',
    name: 'Zoho Mail',
    icon: '🔶',
    color: '#C83E1C',
    authUrl: 'https://accounts.zoho.com/oauth/v2/auth',
    scopes: ['ZohoMail.messages.READ', 'ZohoMail.messages.CREATE'],
    isOAuth: true
  },
  {
    id: 'aol',
    name: 'AOL Mail',
    icon: '📫',
    color: '#FF0B00',
    authUrl: '',
    scopes: [],
    isOAuth: false
  },
  {
    id: 'fastmail',
    name: 'Fastmail',
    icon: '⚡',
    color: '#125788',
    authUrl: '',
    scopes: [],
    isOAuth: false
  }
];

export class EmailIntegrationService {
  private static instance: EmailIntegrationService;
  private connectedAccounts: EmailAccount[] = [];

  private constructor() {}

  public static getInstance(): EmailIntegrationService {
    if (!EmailIntegrationService.instance) {
      EmailIntegrationService.instance = new EmailIntegrationService();
    }
    return EmailIntegrationService.instance;
  }

  // Get all available email providers
  getAvailableProviders(): EmailProvider[] {
    return EMAIL_PROVIDERS;
  }

  // Get connected email accounts
  getConnectedAccounts(): EmailAccount[] {
    return this.connectedAccounts;
  }

  // Initiate OAuth flow for email provider
  async initiateOAuthFlow(providerId: string): Promise<string> {
    const provider = EMAIL_PROVIDERS.find(p => p.id === providerId);
    if (!provider || !provider.isOAuth) {
      throw new Error('Provider does not support OAuth or not found');
    }

    // In a real implementation, this would generate the OAuth URL with proper client_id, redirect_uri, etc.
    const clientId = process.env[`${providerId.toUpperCase()}_CLIENT_ID`];
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/oauth/callback`;
    const state = btoa(JSON.stringify({ providerId, timestamp: Date.now() }));

    const params = new URLSearchParams({
      client_id: clientId || 'demo_client_id',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: provider.scopes.join(' '),
      state,
      access_type: 'offline',
      prompt: 'consent'
    });

    return `${provider.authUrl}?${params.toString()}`;
  }

  // Handle OAuth callback and exchange code for tokens
  async handleOAuthCallback(code: string, state: string): Promise<EmailAccount> {
    try {
      const stateData = JSON.parse(atob(state));
      const provider = EMAIL_PROVIDERS.find(p => p.id === stateData.providerId);
      
      if (!provider) {
        throw new Error('Invalid provider in state');
      }

      // In a real implementation, this would exchange the code for access/refresh tokens
      console.log(`Exchanging OAuth code for ${provider.name} tokens...`);
      
      // Mock token exchange
      const mockTokenResponse = {
        access_token: `mock_access_token_${Date.now()}`,
        refresh_token: `mock_refresh_token_${Date.now()}`,
        expires_in: 3600,
        scope: provider.scopes.join(' ')
      };

      // Get user profile to extract email address
      const userEmail = await this.getUserEmail(provider.id, mockTokenResponse.access_token);

      const emailAccount: EmailAccount = {
        id: `${provider.id}_${Date.now()}`,
        email: userEmail,
        provider,
        accessToken: mockTokenResponse.access_token,
        refreshToken: mockTokenResponse.refresh_token,
        isConnected: true,
        lastSync: new Date()
      };

      this.connectedAccounts.push(emailAccount);
      
      // Save to localStorage for demo purposes (in production, save to secure backend)
      localStorage.setItem('emailAccounts', JSON.stringify(this.connectedAccounts));

      return emailAccount;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw new Error('Failed to connect email account');
    }
  }

  // Connect email account with manual configuration (for non-OAuth providers)
  async connectManualAccount(
    providerId: string, 
    email: string, 
    password: string,
    imapSettings?: any
  ): Promise<EmailAccount> {
    const provider = EMAIL_PROVIDERS.find(p => p.id === providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    console.log(`Connecting manual account for ${provider.name}...`);
    
    // In a real implementation, this would test IMAP/SMTP connection
    // For now, we'll simulate a successful connection
    
    const emailAccount: EmailAccount = {
      id: `${providerId}_${Date.now()}`,
      email,
      provider,
      isConnected: true,
      lastSync: new Date()
    };

    this.connectedAccounts.push(emailAccount);
    localStorage.setItem('emailAccounts', JSON.stringify(this.connectedAccounts));

    return emailAccount;
  }

  // Sync messages from connected email accounts
  async syncMessages(accountId: string, options: EmailSyncOptions = {}): Promise<EmailMessage[]> {
    const account = this.connectedAccounts.find(a => a.id === accountId);
    if (!account || !account.isConnected) {
      throw new Error('Email account not found or not connected');
    }

    console.log(`Syncing messages from ${account.email}...`);

    // In a real implementation, this would use the provider's API to fetch messages
    const mockMessages: EmailMessage[] = [
      {
        id: `msg_${Date.now()}_1`,
        subject: 'Welcome to our service!',
        from: 'welcome@example.com',
        to: [account.email],
        body: 'Thank you for signing up...',
        date: new Date(Date.now() - 86400000), // 1 day ago
        isRead: false
      },
      {
        id: `msg_${Date.now()}_2`,
        subject: 'Your monthly report is ready',
        from: 'reports@business.com',
        to: [account.email],
        body: 'Your monthly business report...',
        date: new Date(Date.now() - 172800000), // 2 days ago
        isRead: true
      }
    ];

    // Update last sync time
    account.lastSync = new Date();
    localStorage.setItem('emailAccounts', JSON.stringify(this.connectedAccounts));

    return mockMessages;
  }

  // Send email through connected account
  async sendEmail(
    accountId: string,
    to: string[],
    subject: string,
    body: string,
    isHTML = false
  ): Promise<boolean> {
    const account = this.connectedAccounts.find(a => a.id === accountId);
    if (!account || !account.isConnected) {
      throw new Error('Email account not found or not connected');
    }

    console.log(`Sending email via ${account.email}...`);
    console.log('To:', to.join(', '));
    console.log('Subject:', subject);

    // In a real implementation, this would use the provider's API to send the email
    // Mock successful send
    return true;
  }

  // Disconnect email account
  async disconnectAccount(accountId: string): Promise<boolean> {
    const index = this.connectedAccounts.findIndex(a => a.id === accountId);
    if (index === -1) {
      return false;
    }

    this.connectedAccounts.splice(index, 1);
    localStorage.setItem('emailAccounts', JSON.stringify(this.connectedAccounts));
    
    return true;
  }

  // Get user email from provider API
  private async getUserEmail(providerId: string, accessToken: string): Promise<string> {
    // In a real implementation, this would call the provider's API
    // For demo purposes, return a mock email
    return `user@${providerId === 'gmail' ? 'gmail.com' : providerId === 'outlook' ? 'outlook.com' : 'example.com'}`;
  }

  // Load connected accounts from storage
  loadStoredAccounts(): void {
    try {
      const stored = localStorage.getItem('emailAccounts');
      if (stored) {
        this.connectedAccounts = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load stored email accounts:', error);
    }
  }
}

// Export singleton instance
export const emailIntegrationService = EmailIntegrationService.getInstance();