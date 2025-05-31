/**
 * Adobe Express Integration Service
 * Handles OAuth authentication, project management, and API interactions with Adobe Express
 */

export interface AdobeAccount {
  id: string;
  userId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  isConnected: boolean;
  connectedAt: Date;
  organizationId?: string;
}

export interface AdobeProject {
  id: string;
  name: string;
  description?: string;
  thumbnail: string;
  projectUrl: string;
  type: 'image' | 'video' | 'animation' | 'webpage' | 'document';
  createdAt: Date;
  modifiedAt: Date;
  status: 'draft' | 'published' | 'archived';
  dimensions?: {
    width: number;
    height: number;
  };
  tags: string[];
}

export interface AdobeAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'font' | 'template';
  url: string;
  thumbnail: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  createdAt: Date;
}

export interface AdobeAuthResult {
  success: boolean;
  account?: AdobeAccount;
  error?: string;
  authUrl?: string;
}

export interface AdobeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  dimensions: {
    width: number;
    height: number;
  };
  isPremium: boolean;
  tags: string[];
}

class AdobeExpressService {
  private static instance: AdobeExpressService;
  private connectedAccounts: AdobeAccount[] = [];
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  private constructor() {
    this.clientId = process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID || '';
    this.clientSecret = process.env.ADOBE_CLIENT_SECRET || '';
    this.redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/create/adobe/callback`;
  }

  public static getInstance(): AdobeExpressService {
    if (!AdobeExpressService.instance) {
      AdobeExpressService.instance = new AdobeExpressService();
    }
    return AdobeExpressService.instance;
  }

  /**
   * Initiate OAuth flow for Adobe Express authentication
   */
  async initiateOAuth(userId: string): Promise<AdobeAuthResult> {
    try {
      const state = this.generateSecureState(userId);
      const scopes = [
        'creative_sdk',
        'openid',
        'read_organizations',
        'additional_info.projectedProductContext',
        'additional_info.roles'
      ].join(',');

      const authUrl = `https://ims-na1.adobelogin.com/ims/authorize/v1?` +
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
      console.error('Adobe OAuth initiation error:', error);
      return {
        success: false,
        error: 'Failed to initiate Adobe authentication'
      };
    }
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleOAuthCallback(code: string, state: string): Promise<AdobeAuthResult> {
    try {
      // Verify state parameter
      const userId = this.verifyState(state);
      if (!userId) {
        return { success: false, error: 'Invalid state parameter' };
      }

      // Exchange code for tokens
      const tokenResponse = await fetch('https://ims-na1.adobelogin.com/ims/token/v1', {
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
        console.error('Adobe token exchange error:', error);
        return { success: false, error: 'Failed to exchange authorization code' };
      }

      const tokens = await tokenResponse.json();

      // Get user profile
      const profileResponse = await fetch('https://ims-na1.adobelogin.com/ims/profile/v1', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        return { success: false, error: 'Failed to get user profile' };
      }

      const profile = await profileResponse.json();

      // Create account object
      const account: AdobeAccount = {
        id: `adobe_${profile.userId}`,
        userId,
        email: profile.email,
        name: profile.displayName || profile.name || profile.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        isConnected: true,
        connectedAt: new Date(),
        organizationId: profile.organizationId,
      };

      // Store account
      this.connectedAccounts.push(account);

      return {
        success: true,
        account
      };

    } catch (error) {
      console.error('Adobe OAuth callback error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  /**
   * Get user's projects from Adobe Express
   */
  async getUserProjects(accountId: string): Promise<AdobeProject[]> {
    try {
      const account = this.connectedAccounts.find(a => a.id === accountId);
      if (!account || !account.isConnected) {
        throw new Error('Account not found or not connected');
      }

      // Note: Adobe Express API is limited, this is a mock implementation
      // In reality, you would use the Adobe Creative SDK APIs
      const mockProjects: AdobeProject[] = [
        {
          id: 'project_1',
          name: 'Summer Campaign Design',
          description: 'Social media graphics for summer promotion',
          thumbnail: '/api/placeholder/300/200',
          projectUrl: 'https://express.adobe.com/page/project_1',
          type: 'image',
          createdAt: new Date('2024-01-15'),
          modifiedAt: new Date('2024-01-20'),
          status: 'draft',
          dimensions: { width: 1080, height: 1080 },
          tags: ['social', 'summer', 'promotion']
        },
        {
          id: 'project_2',
          name: 'Product Showcase Video',
          description: 'Promotional video for new product line',
          thumbnail: '/api/placeholder/300/200',
          projectUrl: 'https://express.adobe.com/page/project_2',
          type: 'video',
          createdAt: new Date('2024-01-10'),
          modifiedAt: new Date('2024-01-18'),
          status: 'published',
          dimensions: { width: 1920, height: 1080 },
          tags: ['video', 'product', 'showcase']
        }
      ];

      return mockProjects;

    } catch (error) {
      console.error('Error fetching Adobe projects:', error);
      return [];
    }
  }

  /**
   * Create a new project in Adobe Express
   */
  async createProject(
    accountId: string,
    projectName: string,
    templateId?: string,
    projectType: AdobeProject['type'] = 'image'
  ): Promise<AdobeProject | null> {
    try {
      const account = this.connectedAccounts.find(a => a.id === accountId);
      if (!account || !account.isConnected) {
        throw new Error('Account not found or not connected');
      }

      // Mock project creation - in reality, this would use Adobe Creative SDK
      const newProject: AdobeProject = {
        id: `project_${Date.now()}`,
        name: projectName,
        description: `New ${projectType} project created via CaptureIT LS`,
        thumbnail: '/api/placeholder/300/200',
        projectUrl: `https://express.adobe.com/page/project_${Date.now()}`,
        type: projectType,
        createdAt: new Date(),
        modifiedAt: new Date(),
        status: 'draft',
        dimensions: this.getDefaultDimensions(projectType),
        tags: ['captureit', 'new']
      };

      return newProject;

    } catch (error) {
      console.error('Error creating Adobe project:', error);
      return null;
    }
  }

  /**
   * Get Adobe templates
   */
  async getTemplates(category?: string): Promise<AdobeTemplate[]> {
    try {
      // Mock templates - in reality, this would fetch from Adobe's template library
      const mockTemplates: AdobeTemplate[] = [
        {
          id: 'template_1',
          name: 'Social Media Post',
          description: 'Modern social media template with bold colors',
          thumbnail: '/api/placeholder/300/300',
          category: 'social-media',
          dimensions: { width: 1080, height: 1080 },
          isPremium: false,
          tags: ['social', 'modern', 'colorful']
        },
        {
          id: 'template_2', 
          name: 'Professional Presentation',
          description: 'Clean and professional presentation template',
          thumbnail: '/api/placeholder/400/300',
          category: 'presentation',
          dimensions: { width: 1920, height: 1080 },
          isPremium: true,
          tags: ['presentation', 'professional', 'business']
        },
        {
          id: 'template_3',
          name: 'Product Showcase',
          description: 'Template for showcasing products with style',
          thumbnail: '/api/placeholder/300/400',
          category: 'marketing',
          dimensions: { width: 800, height: 1200 },
          isPremium: false,
          tags: ['product', 'showcase', 'marketing']
        }
      ];

      if (category) {
        return mockTemplates.filter(template => template.category === category);
      }

      return mockTemplates;

    } catch (error) {
      console.error('Error fetching Adobe templates:', error);
      return [];
    }
  }

  /**
   * Get user's assets from Adobe Express
   */
  async getUserAssets(accountId: string): Promise<AdobeAsset[]> {
    try {
      const account = this.connectedAccounts.find(a => a.id === accountId);
      if (!account || !account.isConnected) {
        throw new Error('Account not found or not connected');
      }

      // Mock assets - in reality, this would fetch from Adobe Creative Cloud Libraries
      const mockAssets: AdobeAsset[] = [
        {
          id: 'asset_1',
          name: 'Company Logo.png',
          type: 'image',
          url: '/api/placeholder/200/200',
          thumbnail: '/api/placeholder/100/100',
          fileSize: 45000,
          dimensions: { width: 500, height: 500 },
          createdAt: new Date('2024-01-01')
        },
        {
          id: 'asset_2',
          name: 'Product Photo.jpg',
          type: 'image',
          url: '/api/placeholder/400/300',
          thumbnail: '/api/placeholder/100/75',
          fileSize: 120000,
          dimensions: { width: 1200, height: 900 },
          createdAt: new Date('2024-01-05')
        },
        {
          id: 'asset_3',
          name: 'Brand Font',
          type: 'font',
          url: '/fonts/brand-font.woff2',
          thumbnail: '/api/placeholder/100/100',
          fileSize: 32000,
          createdAt: new Date('2024-01-03')
        }
      ];

      return mockAssets;

    } catch (error) {
      console.error('Error fetching Adobe assets:', error);
      return [];
    }
  }

  /**
   * Apply AI enhancements to a project
   */
  async applyAIEnhancements(
    accountId: string,
    projectId: string,
    enhancements: string[]
  ): Promise<boolean> {
    try {
      const account = this.connectedAccounts.find(a => a.id === accountId);
      if (!account || !account.isConnected) {
        throw new Error('Account not found or not connected');
      }

      // Mock AI enhancement application
      console.log(`Applying AI enhancements to project ${projectId}:`, enhancements);
      
      // In reality, this would call Adobe Sensei APIs or similar
      // to apply effects like background removal, smart cropping, etc.
      
      return true;

    } catch (error) {
      console.error('Error applying AI enhancements:', error);
      return false;
    }
  }

  /**
   * Get connected accounts
   */
  getConnectedAccounts(): AdobeAccount[] {
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

      // In a real implementation, you would revoke the token with Adobe
      this.connectedAccounts[accountIndex].isConnected = false;
      return true;

    } catch (error) {
      console.error('Error disconnecting Adobe account:', error);
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

  private getDefaultDimensions(projectType: AdobeProject['type']): { width: number; height: number } {
    const dimensionMap: Record<AdobeProject['type'], { width: number; height: number }> = {
      'image': { width: 1080, height: 1080 },
      'video': { width: 1920, height: 1080 },
      'animation': { width: 1080, height: 1080 },
      'webpage': { width: 1200, height: 800 },
      'document': { width: 612, height: 792 }, // 8.5 x 11 inches at 72 DPI
    };
    return dimensionMap[projectType];
  }
}

// Export singleton instance
export const adobeExpressService = AdobeExpressService.getInstance();