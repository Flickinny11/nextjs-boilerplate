/**
 * Canva Integration Service
 * Handles OAuth authentication, design management, and API interactions with Canva
 */

export interface CanvaAccount {
  id: string;
  userId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  isConnected: boolean;
  connectedAt: Date;
}

export interface CanvaDesign {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  type: 'presentation' | 'social-media' | 'document' | 'logo' | 'poster' | 'video';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isPublic: boolean;
}

export interface CanvaTemplate {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  dimensions: {
    width: number;
    height: number;
  };
  isPremium: boolean;
}

export interface CanvaAuthResult {
  success: boolean;
  account?: CanvaAccount;
  error?: string;
  authUrl?: string;
}

export interface StyleExtractionResult {
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
  };
  fonts: {
    primary: string;
    secondary: string;
    headings: string;
  };
  logoUsage: {
    placement: string;
    sizing: string;
    variations: string[];
  };
  brandElements: {
    patterns: string[];
    shapes: string[];
    effects: string[];
  };
  confidence: number;
}

class CanvaIntegrationService {
  private static instance: CanvaIntegrationService;
  private connectedAccounts: CanvaAccount[] = [];
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  private constructor() {
    this.clientId = process.env.NEXT_PUBLIC_CANVA_CLIENT_ID || '';
    this.clientSecret = process.env.CANVA_CLIENT_SECRET || '';
    this.redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/create/canva/callback`;
  }

  public static getInstance(): CanvaIntegrationService {
    if (!CanvaIntegrationService.instance) {
      CanvaIntegrationService.instance = new CanvaIntegrationService();
    }
    return CanvaIntegrationService.instance;
  }

  /**
   * Initiate OAuth flow for Canva authentication
   */
  async initiateOAuth(userId: string): Promise<CanvaAuthResult> {
    try {
      const state = this.generateSecureState(userId);
      const scopes = [
        'design:read',
        'design:write', 
        'asset:read',
        'asset:write',
        'brand:read'
      ].join(' ');

      const authUrl = `https://www.canva.com/api/oauth/authorize?` +
        `client_id=${this.clientId}&` +
        `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `state=${state}`;

      return {
        success: true,
        authUrl
      };
    } catch (error) {
      console.error('Canva OAuth initiation error:', error);
      return {
        success: false,
        error: 'Failed to initiate Canva authentication'
      };
    }
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleOAuthCallback(code: string, state: string): Promise<CanvaAuthResult> {
    try {
      // Verify state parameter
      const userId = this.verifyState(state);
      if (!userId) {
        return { success: false, error: 'Invalid state parameter' };
      }

      // Exchange code for tokens
      const tokenResponse = await fetch('https://api.canva.com/rest/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Token exchange error:', error);
        return { success: false, error: 'Failed to exchange authorization code' };
      }

      const tokens = await tokenResponse.json();

      // Get user info
      const userResponse = await fetch('https://api.canva.com/rest/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      if (!userResponse.ok) {
        return { success: false, error: 'Failed to get user information' };
      }

      const userInfo = await userResponse.json();

      // Create account object
      const account: CanvaAccount = {
        id: `canva_${userInfo.id}`,
        userId,
        email: userInfo.email,
        name: userInfo.display_name,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        isConnected: true,
        connectedAt: new Date(),
      };

      // Store account
      this.connectedAccounts.push(account);

      return {
        success: true,
        account
      };

    } catch (error) {
      console.error('Canva OAuth callback error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  /**
   * Get user's designs from Canva
   */
  async getUserDesigns(accountId: string): Promise<CanvaDesign[]> {
    try {
      const account = this.connectedAccounts.find(a => a.id === accountId);
      if (!account || !account.isConnected) {
        throw new Error('Account not found or not connected');
      }

      const response = await fetch('https://api.canva.com/rest/v1/designs', {
        headers: {
          'Authorization': `Bearer ${account.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch designs');
      }

      const data = await response.json();
      
      return data.items.map((design: any) => ({
        id: design.id,
        title: design.title,
        thumbnail: design.thumbnail?.url || '',
        url: design.urls?.view_url || '',
        type: this.mapCanvaTypeToLocal(design.design_type),
        createdAt: new Date(design.created_at),
        updatedAt: new Date(design.updated_at),
        tags: design.tags || [],
        isPublic: design.is_public || false,
      }));

    } catch (error) {
      console.error('Error fetching Canva designs:', error);
      return [];
    }
  }

  /**
   * Create a new design in Canva
   */
  async createDesign(
    accountId: string, 
    templateId?: string, 
    designType: string = 'social-media'
  ): Promise<CanvaDesign | null> {
    try {
      const account = this.connectedAccounts.find(a => a.id === accountId);
      if (!account || !account.isConnected) {
        throw new Error('Account not found or not connected');
      }

      const payload: any = {
        design_type: this.mapLocalTypeToCanva(designType as any),
      };

      if (templateId) {
        payload.from_design_id = templateId;
      }

      const response = await fetch('https://api.canva.com/rest/v1/designs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create design');
      }

      const design = await response.json();

      return {
        id: design.id,
        title: design.title,
        thumbnail: design.thumbnail?.url || '',
        url: design.urls?.view_url || '',
        type: this.mapCanvaTypeToLocal(design.design_type),
        createdAt: new Date(design.created_at),
        updatedAt: new Date(design.updated_at),
        tags: design.tags || [],
        isPublic: design.is_public || false,
      };

    } catch (error) {
      console.error('Error creating Canva design:', error);
      return null;
    }
  }

  /**
   * Extract style information from a design using AI
   */
  async extractStyleFromDesign(designId: string, accountId: string): Promise<StyleExtractionResult | null> {
    try {
      const account = this.connectedAccounts.find(a => a.id === accountId);
      if (!account || !account.isConnected) {
        throw new Error('Account not found or not connected');
      }

      // Get design details
      const response = await fetch(`https://api.canva.com/rest/v1/designs/${designId}`, {
        headers: {
          'Authorization': `Bearer ${account.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch design details');
      }

      const design = await response.json();

      // This is a simplified extraction - in a real implementation,
      // you would use AI vision services to analyze the design
      const mockExtraction: StyleExtractionResult = {
        colors: {
          primary: ['#FF6B6B', '#4ECDC4'],
          secondary: ['#45B7D1', '#96CEB4'],
          accent: ['#FECA57', '#FF9FF3'],
        },
        fonts: {
          primary: 'Inter',
          secondary: 'Roboto',
          headings: 'Montserrat',
        },
        logoUsage: {
          placement: 'top-left',
          sizing: 'medium',
          variations: ['full-color', 'white', 'black'],
        },
        brandElements: {
          patterns: ['geometric', 'minimal'],
          shapes: ['rounded', 'circular'],
          effects: ['gradient', 'shadow'],
        },
        confidence: 0.85,
      };

      return mockExtraction;

    } catch (error) {
      console.error('Error extracting style from design:', error);
      return null;
    }
  }

  /**
   * Get connected accounts
   */
  getConnectedAccounts(): CanvaAccount[] {
    return this.connectedAccounts.filter(account => account.isConnected);
  }

  /**
   * Disconnect an account
   */
  async disconnectAccount(accountId: string): Promise<boolean> {
    try {
      const accountIndex = this.connectedAccounts.findIndex(a => a.id === accountId);
      if (accountIndex === -1) {
        return false;
      }

      // In a real implementation, you would revoke the token with Canva
      this.connectedAccounts[accountIndex].isConnected = false;
      return true;

    } catch (error) {
      console.error('Error disconnecting Canva account:', error);
      return false;
    }
  }

  // Helper methods
  private generateSecureState(userId: string): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return Buffer.from(`${userId}:${timestamp}:${random}`).toString('base64');
  }

  private verifyState(state: string): string | null {
    try {
      const decoded = Buffer.from(state, 'base64').toString();
      const [userId, timestamp] = decoded.split(':');
      
      // Check if state is not older than 10 minutes
      const age = Date.now() - parseInt(timestamp);
      if (age > 10 * 60 * 1000) {
        return null;
      }

      return userId;
    } catch {
      return null;
    }
  }

  private mapCanvaTypeToLocal(canvaType: string): CanvaDesign['type'] {
    const typeMap: Record<string, CanvaDesign['type']> = {
      'document': 'document',
      'social': 'social-media',
      'presentation': 'presentation',
      'logo': 'logo',
      'poster': 'poster',
      'video': 'video',
    };
    return typeMap[canvaType] || 'document';
  }

  private mapLocalTypeToCanva(localType: CanvaDesign['type']): string {
    const typeMap: Record<CanvaDesign['type'], string> = {
      'document': 'document',
      'social-media': 'social',
      'presentation': 'presentation',
      'logo': 'logo',
      'poster': 'poster',
      'video': 'video',
    };
    return typeMap[localType] || 'document';
  }
}

// Export singleton instance
export const canvaIntegrationService = CanvaIntegrationService.getInstance();