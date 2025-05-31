// Premium tier API key management and service configurations
export interface APIKeyConfig {
  provider: string;
  name: string;
  keyFields: {
    name: string;
    label: string;
    type: 'text' | 'password';
    required: boolean;
    placeholder?: string;
  }[];
  category: 'ai' | 'image' | 'video' | 'audio';
  description: string;
  baseUrl?: string;
  models?: string[];
}

// 2025 AI Model Providers for Premium Users
export const AI_PROVIDERS: Record<string, APIKeyConfig> = {
  // Core AI Providers
  'openai': {
    provider: 'openai',
    name: 'OpenAI',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'sk-...' }
    ],
    category: 'ai',
    description: 'GPT-4, GPT-4o, and other OpenAI models',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']
  },
  'anthropic': {
    provider: 'anthropic',
    name: 'Anthropic',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'sk-ant-...' }
    ],
    category: 'ai',
    description: 'Claude 4 Sonnet, Claude 4 Opus, and other Claude models',
    baseUrl: 'https://api.anthropic.com',
    models: ['claude-4-sonnet', 'claude-4-opus', 'claude-3-haiku']
  },
  'google': {
    provider: 'google',
    name: 'Google AI',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'AIza...' }
    ],
    category: 'ai',
    description: 'Gemini Pro 2.5, Gemini Flash 2.5, and other Gemini models',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    models: ['gemini-pro-2.5', 'gemini-flash-2.5', 'gemini-pro']
  },
  'mistral': {
    provider: 'mistral',
    name: 'Mistral AI',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'api-key-...' }
    ],
    category: 'ai',
    description: 'Mistral Large 2411 and other Mistral models',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-2411', 'mistral-medium', 'mistral-small']
  },
  'cohere': {
    provider: 'cohere',
    name: 'Cohere',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'co-...' }
    ],
    category: 'ai',
    description: 'Command R+ and other Cohere models',
    baseUrl: 'https://api.cohere.ai/v1',
    models: ['command-r-plus', 'command-r', 'command']
  }
};

// 2025 Image Generation Services
export const IMAGE_PROVIDERS: Record<string, APIKeyConfig> = {
  'midjourney': {
    provider: 'midjourney',
    name: 'Midjourney',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'mj-...' },
      { name: 'userId', label: 'User ID', type: 'text', required: true, placeholder: 'Your Midjourney User ID' }
    ],
    category: 'image',
    description: 'High-quality AI image generation via Midjourney API',
    baseUrl: 'https://api.midjourney.com'
  },
  'dalle': {
    provider: 'dalle',
    name: 'DALL-E 3',
    keyFields: [
      { name: 'apiKey', label: 'OpenAI API Key', type: 'password', required: true, placeholder: 'sk-...' }
    ],
    category: 'image',
    description: 'OpenAI DALL-E 3 for image generation',
    baseUrl: 'https://api.openai.com/v1'
  },
  'stability': {
    provider: 'stability',
    name: 'Stability AI',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'sk-...' }
    ],
    category: 'image',
    description: 'Stable Diffusion XL and other Stability AI models',
    baseUrl: 'https://api.stability.ai'
  },
  'leonardo': {
    provider: 'leonardo',
    name: 'Leonardo AI',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'leo-...' }
    ],
    category: 'image',
    description: 'Leonardo AI for creative image generation',
    baseUrl: 'https://cloud.leonardo.ai/api'
  }
};

// 2025 Video Generation Services (NEW)
export const VIDEO_PROVIDERS: Record<string, APIKeyConfig> = {
  'runway-gen4': {
    provider: 'runway-gen4',
    name: 'Runway Gen-4',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'rw-...' },
      { name: 'projectId', label: 'Project ID', type: 'text', required: true, placeholder: 'Your project ID' }
    ],
    category: 'video',
    description: 'Latest Runway Gen-4 for high-quality video generation',
    baseUrl: 'https://api.runwayml.com/v1'
  },
  'runway-gen4-turbo': {
    provider: 'runway-gen4-turbo',
    name: 'Runway Gen-4 Turbo',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'rw-...' },
      { name: 'projectId', label: 'Project ID', type: 'text', required: true, placeholder: 'Your project ID' }
    ],
    category: 'video',
    description: 'Faster video generation with Runway Gen-4 Turbo',
    baseUrl: 'https://api.runwayml.com/v1'
  },
  'luma-dream-machine': {
    provider: 'luma-dream-machine',
    name: 'Luma Dream Machine',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'luma-...' }
    ],
    category: 'video',
    description: 'Luma Labs Dream Machine for realistic video generation',
    baseUrl: 'https://api.lumalabs.ai/v1'
  },
  'pika-labs': {
    provider: 'pika-labs',
    name: 'Pika Labs',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'pk-...' }
    ],
    category: 'video',
    description: 'Pika Labs for creative video generation and editing',
    baseUrl: 'https://api.pikalabs.ai/v1'
  },
  'genmo': {
    provider: 'genmo',
    name: 'Genmo',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'gm-...' }
    ],
    category: 'video',
    description: 'Genmo for AI-powered video creation',
    baseUrl: 'https://api.genmo.ai/v1'
  },
  'invideo-ai': {
    provider: 'invideo-ai',
    name: 'InVideo AI',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'iv-...' }
    ],
    category: 'video',
    description: 'InVideo AI for automated video creation and editing',
    baseUrl: 'https://api.invideo.io/v2'
  },
  'synthesia': {
    provider: 'synthesia',
    name: 'Synthesia',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'syn-...' }
    ],
    category: 'video',
    description: 'Synthesia for AI avatar video generation',
    baseUrl: 'https://api.synthesia.io/v2'
  }
};

// Audio Generation Services (Additional for 2025)
export const AUDIO_PROVIDERS: Record<string, APIKeyConfig> = {
  'elevenlabs': {
    provider: 'elevenlabs',
    name: 'ElevenLabs',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'el-...' }
    ],
    category: 'audio',
    description: 'High-quality AI voice synthesis and cloning',
    baseUrl: 'https://api.elevenlabs.io/v1'
  },
  'murf-ai': {
    provider: 'murf-ai',
    name: 'Murf AI',
    keyFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'murf-...' }
    ],
    category: 'audio',
    description: 'Professional AI voiceover generation',
    baseUrl: 'https://api.murf.ai/v1'
  }
};

// Combined providers for easy access
export const ALL_PROVIDERS = {
  ...AI_PROVIDERS,
  ...IMAGE_PROVIDERS,
  ...VIDEO_PROVIDERS,
  ...AUDIO_PROVIDERS
};

// User's API key storage interface
export interface UserAPIKey {
  id: string;
  provider: string;
  name: string;
  keys: Record<string, string>;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
}

// API Key management service
export class APIKeyService {
  private static instance: APIKeyService;
  private userAPIKeys: Map<string, UserAPIKey[]> = new Map();

  private constructor() {}

  public static getInstance(): APIKeyService {
    if (!APIKeyService.instance) {
      APIKeyService.instance = new APIKeyService();
    }
    return APIKeyService.instance;
  }

  // Add API key for user
  async addAPIKey(userId: string, provider: string, keys: Record<string, string>): Promise<string> {
    const userKeys = this.userAPIKeys.get(userId) || [];
    const keyId = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newKey: UserAPIKey = {
      id: keyId,
      provider,
      name: ALL_PROVIDERS[provider]?.name || provider,
      keys,
      isActive: true,
      createdAt: new Date()
    };

    userKeys.push(newKey);
    this.userAPIKeys.set(userId, userKeys);
    
    return keyId;
  }

  // Get user's API keys
  async getUserAPIKeys(userId: string): Promise<UserAPIKey[]> {
    return this.userAPIKeys.get(userId) || [];
  }

  // Get specific API key
  async getAPIKey(userId: string, keyId: string): Promise<UserAPIKey | null> {
    const userKeys = this.userAPIKeys.get(userId) || [];
    return userKeys.find(key => key.id === keyId) || null;
  }

  // Update API key status
  async updateAPIKeyStatus(userId: string, keyId: string, isActive: boolean): Promise<boolean> {
    const userKeys = this.userAPIKeys.get(userId) || [];
    const keyIndex = userKeys.findIndex(key => key.id === keyId);
    
    if (keyIndex === -1) return false;
    
    userKeys[keyIndex].isActive = isActive;
    this.userAPIKeys.set(userId, userKeys);
    
    return true;
  }

  // Delete API key
  async deleteAPIKey(userId: string, keyId: string): Promise<boolean> {
    const userKeys = this.userAPIKeys.get(userId) || [];
    const filteredKeys = userKeys.filter(key => key.id !== keyId);
    
    if (filteredKeys.length === userKeys.length) return false;
    
    this.userAPIKeys.set(userId, filteredKeys);
    return true;
  }

  // Check if user has API key for provider
  async hasAPIKeyForProvider(userId: string, provider: string): Promise<boolean> {
    const userKeys = this.userAPIKeys.get(userId) || [];
    return userKeys.some(key => key.provider === provider && key.isActive);
  }

  // Update last used timestamp
  async updateLastUsed(userId: string, keyId: string): Promise<void> {
    const userKeys = this.userAPIKeys.get(userId) || [];
    const keyIndex = userKeys.findIndex(key => key.id === keyId);
    
    if (keyIndex !== -1) {
      userKeys[keyIndex].lastUsed = new Date();
      this.userAPIKeys.set(userId, userKeys);
    }
  }
}

// Export singleton instance
export const apiKeyService = APIKeyService.getInstance();