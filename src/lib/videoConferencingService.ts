// Video Conferencing Integration Service
// Real OAuth integration with Microsoft Teams and Zoom

export interface VideoConferencingProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  authUrl: string;
  scopes: string[];
  clientIdEnvVar: string;
  clientSecretEnvVar: string;
}

export interface VideoAccount {
  id: string;
  email: string;
  displayName: string;
  provider: VideoConferencingProvider;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  isConnected: boolean;
}

export interface MeetingRequest {
  title: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  agenda?: string;
  description?: string;
}

export interface ScheduledMeeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  joinUrl: string;
  organizer: string;
  attendees: string[];
  provider: string;
  status: 'scheduled' | 'started' | 'ended' | 'cancelled';
}

// Video conferencing providers with real OAuth configurations
export const VIDEO_PROVIDERS: VideoConferencingProvider[] = [
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: '🟦',
    color: '#5A5A5A',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scopes: [
      'https://graph.microsoft.com/OnlineMeetings.ReadWrite',
      'https://graph.microsoft.com/Calendars.ReadWrite',
      'https://graph.microsoft.com/User.Read'
    ],
    clientIdEnvVar: 'MICROSOFT_CLIENT_ID',
    clientSecretEnvVar: 'MICROSOFT_CLIENT_SECRET'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    icon: '📹',
    color: '#2D8CFF',
    authUrl: 'https://zoom.us/oauth/authorize',
    scopes: [
      'meeting:write',
      'meeting:read',
      'user:read'
    ],
    clientIdEnvVar: 'ZOOM_CLIENT_ID',
    clientSecretEnvVar: 'ZOOM_CLIENT_SECRET'
  }
];

export class VideoConferencingService {
  private static instance: VideoConferencingService;
  private connectedAccounts: VideoAccount[] = [];

  private constructor() {
    this.loadStoredAccounts();
  }

  public static getInstance(): VideoConferencingService {
    if (!VideoConferencingService.instance) {
      VideoConferencingService.instance = new VideoConferencingService();
    }
    return VideoConferencingService.instance;
  }

  // Get available providers
  getAvailableProviders(): VideoConferencingProvider[] {
    return VIDEO_PROVIDERS.filter(provider => {
      // Only show providers that have client ID configured
      const clientId = process.env[`NEXT_PUBLIC_${provider.clientIdEnvVar}`];
      return !!clientId;
    });
  }

  // Get connected accounts
  getConnectedAccounts(): VideoAccount[] {
    return this.connectedAccounts;
  }

  // Initiate OAuth flow
  async initiateOAuthFlow(providerId: string): Promise<string> {
    const provider = VIDEO_PROVIDERS.find(p => p.id === providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const clientId = process.env[`NEXT_PUBLIC_${provider.clientIdEnvVar}`];
    if (!clientId) {
      throw new Error(`${provider.name} is not configured. Please set ${provider.clientIdEnvVar} in environment variables.`);
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/video/oauth/callback`;
    const state = btoa(JSON.stringify({ 
      providerId, 
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(7)
    }));

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: provider.scopes.join(' '),
      state,
      access_type: 'offline',
      prompt: 'consent'
    });

    return `${provider.authUrl}?${params.toString()}`;
  }

  // Handle OAuth callback
  async handleOAuthCallback(code: string, state: string): Promise<VideoAccount> {
    try {
      const stateData = JSON.parse(atob(state));
      const provider = VIDEO_PROVIDERS.find(p => p.id === stateData.providerId);
      
      if (!provider) {
        throw new Error('Invalid provider in state');
      }

      // Exchange code for tokens
      const tokenResponse = await this.exchangeCodeForTokens(provider, code);
      
      // Get user profile
      const userProfile = await this.getUserProfile(provider, tokenResponse.access_token);

      const account: VideoAccount = {
        id: `${provider.id}_${Date.now()}`,
        email: userProfile.email,
        displayName: userProfile.displayName,
        provider,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000)),
        isConnected: true
      };

      this.connectedAccounts.push(account);
      this.saveStoredAccounts();

      return account;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw new Error('Failed to connect video conferencing account');
    }
  }

  // Exchange authorization code for access tokens
  private async exchangeCodeForTokens(provider: VideoConferencingProvider, code: string): Promise<any> {
    const clientId = process.env[`NEXT_PUBLIC_${provider.clientIdEnvVar}`];
    const clientSecret = process.env[provider.clientSecretEnvVar];
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/video/oauth/callback`;

    if (!clientId || !clientSecret) {
      throw new Error(`${provider.name} OAuth credentials not configured`);
    }

    let tokenUrl: string;
    let body: URLSearchParams;

    if (provider.id === 'teams') {
      tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
      body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      });
    } else if (provider.id === 'zoom') {
      tokenUrl = 'https://zoom.us/oauth/token';
      body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      });
    } else {
      throw new Error('Unsupported provider');
    }

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(provider.id === 'zoom' && {
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        })
      },
      body: body.toString()
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token exchange failed:', errorData);
      throw new Error('Failed to exchange code for tokens');
    }

    return response.json();
  }

  // Get user profile from provider
  private async getUserProfile(provider: VideoConferencingProvider, accessToken: string): Promise<any> {
    let profileUrl: string;
    let headers: HeadersInit;

    if (provider.id === 'teams') {
      profileUrl = 'https://graph.microsoft.com/v1.0/me';
      headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
    } else if (provider.id === 'zoom') {
      profileUrl = 'https://api.zoom.us/v2/users/me';
      headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
    } else {
      throw new Error('Unsupported provider');
    }

    const response = await fetch(profileUrl, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    const profile = await response.json();
    
    // Normalize profile data
    if (provider.id === 'teams') {
      return {
        email: profile.mail || profile.userPrincipalName,
        displayName: profile.displayName
      };
    } else if (provider.id === 'zoom') {
      return {
        email: profile.email,
        displayName: `${profile.first_name} ${profile.last_name}`.trim()
      };
    }

    return profile;
  }

  // Schedule a meeting
  async scheduleMeeting(accountId: string, meeting: MeetingRequest): Promise<ScheduledMeeting> {
    const account = this.connectedAccounts.find(acc => acc.id === accountId);
    if (!account || !account.isConnected) {
      throw new Error('Account not found or not connected');
    }

    // Check if token needs refresh
    await this.ensureValidToken(account);

    if (account.provider.id === 'teams') {
      return this.scheduleTeamsMeeting(account, meeting);
    } else if (account.provider.id === 'zoom') {
      return this.scheduleZoomMeeting(account, meeting);
    } else {
      throw new Error('Unsupported provider');
    }
  }

  // Schedule Teams meeting
  private async scheduleTeamsMeeting(account: VideoAccount, meeting: MeetingRequest): Promise<ScheduledMeeting> {
    const meetingData = {
      subject: meeting.title,
      body: {
        contentType: 'HTML',
        content: meeting.description || meeting.agenda || ''
      },
      start: {
        dateTime: meeting.startTime.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: meeting.endTime.toISOString(),
        timeZone: 'UTC'
      },
      attendees: meeting.attendees.map(email => ({
        emailAddress: {
          address: email,
          name: email
        }
      })),
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness'
    };

    const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meetingData)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Teams meeting creation failed:', error);
      throw new Error('Failed to create Teams meeting');
    }

    const createdMeeting = await response.json();

    return {
      id: createdMeeting.id,
      title: meeting.title,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      joinUrl: createdMeeting.onlineMeeting?.joinUrl || createdMeeting.webLink,
      organizer: account.email,
      attendees: meeting.attendees,
      provider: 'teams',
      status: 'scheduled'
    };
  }

  // Schedule Zoom meeting
  private async scheduleZoomMeeting(account: VideoAccount, meeting: MeetingRequest): Promise<ScheduledMeeting> {
    const meetingData = {
      topic: meeting.title,
      type: 2, // Scheduled meeting
      start_time: meeting.startTime.toISOString(),
      duration: Math.ceil((meeting.endTime.getTime() - meeting.startTime.getTime()) / 60000), // Duration in minutes
      agenda: meeting.agenda || meeting.description || '',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        watermark: false,
        use_pmi: false,
        approval_type: 2, // Manual approval
        audio: 'both',
        auto_recording: 'none'
      }
    };

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meetingData)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Zoom meeting creation failed:', error);
      throw new Error('Failed to create Zoom meeting');
    }

    const createdMeeting = await response.json();

    return {
      id: createdMeeting.id.toString(),
      title: meeting.title,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      joinUrl: createdMeeting.join_url,
      organizer: account.email,
      attendees: meeting.attendees,
      provider: 'zoom',
      status: 'scheduled'
    };
  }

  // Get meetings for an account
  async getMeetings(accountId: string, startDate?: Date, endDate?: Date): Promise<ScheduledMeeting[]> {
    const account = this.connectedAccounts.find(acc => acc.id === accountId);
    if (!account || !account.isConnected) {
      throw new Error('Account not found or not connected');
    }

    await this.ensureValidToken(account);

    if (account.provider.id === 'teams') {
      return this.getTeamsMeetings(account, startDate, endDate);
    } else if (account.provider.id === 'zoom') {
      return this.getZoomMeetings(account, startDate, endDate);
    } else {
      throw new Error('Unsupported provider');
    }
  }

  // Get Teams meetings
  private async getTeamsMeetings(account: VideoAccount, startDate?: Date, endDate?: Date): Promise<ScheduledMeeting[]> {
    const start = startDate || new Date();
    const end = endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const params = new URLSearchParams({
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
      $filter: 'isOnlineMeeting eq true'
    });

    const response = await fetch(`https://graph.microsoft.com/v1.0/me/events?${params}`, {
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get Teams meetings');
    }

    const data = await response.json();
    
    return data.value.map((event: any) => ({
      id: event.id,
      title: event.subject,
      startTime: new Date(event.start.dateTime),
      endTime: new Date(event.end.dateTime),
      joinUrl: event.onlineMeeting?.joinUrl || event.webLink,
      organizer: account.email,
      attendees: event.attendees?.map((att: any) => att.emailAddress.address) || [],
      provider: 'teams',
      status: 'scheduled'
    }));
  }

  // Get Zoom meetings
  private async getZoomMeetings(account: VideoAccount, startDate?: Date, endDate?: Date): Promise<ScheduledMeeting[]> {
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get Zoom meetings');
    }

    const data = await response.json();
    
    return data.meetings.map((meeting: any) => ({
      id: meeting.id.toString(),
      title: meeting.topic,
      startTime: new Date(meeting.start_time),
      endTime: new Date(new Date(meeting.start_time).getTime() + meeting.duration * 60000),
      joinUrl: meeting.join_url,
      organizer: account.email,
      attendees: [], // Zoom doesn't provide attendees in list endpoint
      provider: 'zoom',
      status: 'scheduled'
    }));
  }

  // Ensure access token is valid
  private async ensureValidToken(account: VideoAccount): Promise<void> {
    if (account.expiresAt && account.expiresAt > new Date(Date.now() + 5 * 60 * 1000)) {
      return; // Token is still valid for at least 5 minutes
    }

    if (!account.refreshToken) {
      throw new Error('No refresh token available. Please reconnect the account.');
    }

    try {
      const newTokens = await this.refreshAccessToken(account);
      account.accessToken = newTokens.access_token;
      if (newTokens.refresh_token) {
        account.refreshToken = newTokens.refresh_token;
      }
      account.expiresAt = new Date(Date.now() + (newTokens.expires_in * 1000));
      
      this.saveStoredAccounts();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      account.isConnected = false;
      throw new Error('Failed to refresh access token. Please reconnect the account.');
    }
  }

  // Refresh access token
  private async refreshAccessToken(account: VideoAccount): Promise<any> {
    const provider = account.provider;
    const clientId = process.env[`NEXT_PUBLIC_${provider.clientIdEnvVar}`];
    const clientSecret = process.env[provider.clientSecretEnvVar];

    if (!clientId || !clientSecret) {
      throw new Error('OAuth credentials not configured');
    }

    let tokenUrl: string;
    let body: URLSearchParams;

    if (provider.id === 'teams') {
      tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
      body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: account.refreshToken,
        grant_type: 'refresh_token'
      });
    } else if (provider.id === 'zoom') {
      tokenUrl = 'https://zoom.us/oauth/token';
      body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: account.refreshToken
      });
    } else {
      throw new Error('Unsupported provider');
    }

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(provider.id === 'zoom' && {
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        })
      },
      body: body.toString()
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token refresh failed:', errorData);
      throw new Error('Failed to refresh token');
    }

    return response.json();
  }

  // Disconnect account
  async disconnectAccount(accountId: string): Promise<boolean> {
    const index = this.connectedAccounts.findIndex(acc => acc.id === accountId);
    if (index === -1) {
      return false;
    }

    this.connectedAccounts.splice(index, 1);
    this.saveStoredAccounts();
    return true;
  }

  // Save accounts to localStorage
  private saveStoredAccounts(): void {
    try {
      localStorage.setItem('videoConferencingAccounts', JSON.stringify(this.connectedAccounts));
    } catch (error) {
      console.error('Failed to save video conferencing accounts:', error);
    }
  }

  // Load accounts from localStorage
  private loadStoredAccounts(): void {
    try {
      const stored = localStorage.getItem('videoConferencingAccounts');
      if (stored) {
        this.connectedAccounts = JSON.parse(stored).map((account: any) => ({
          ...account,
          expiresAt: new Date(account.expiresAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load video conferencing accounts:', error);
    }
  }
}

// Export singleton instance
export const videoConferencingService = VideoConferencingService.getInstance();