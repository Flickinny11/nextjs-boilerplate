// Tier-based model access configuration
export type UserTier = 'entry' | 'professional' | 'business' | 'premium';

export interface ModelTierConfig {
  tier: UserTier;
  allowedModels: string[];
  maxCreditsPerMonth: number;
  features: string[];
}

// Model categories based on cost and capability
export const MODEL_CATEGORIES = {
  BASE: 'base', // Low-cost models for Entry tier
  ADVANCED: 'advanced', // Mid-range models for Professional+ tiers
  PREMIUM: 'premium' // High-end models for Business+ tiers
} as const;

// Categorize models by cost and capability
export const MODEL_TIER_MAPPING: Record<string, keyof typeof MODEL_CATEGORIES> = {
  // BASE MODELS (Entry tier) - Low cost, efficient
  'google/gemini-flash-2.5': 'BASE',
  'deepseek/deepseek-chat': 'BASE', 
  'nous-hermes-2-mixtral-8x7b-dpo': 'BASE',
  'databricks/dbrx-instruct': 'BASE',
  'qwen/qwen-2.5-72b-instruct': 'BASE',
  'meta-llama/llama-3.2-90b-instruct': 'BASE',

  // ADVANCED MODELS (Professional+ tiers) - Mid-range cost
  'mistralai/mistral-large-2411': 'ADVANCED',
  'x-ai/grok-2-1212': 'ADVANCED',
  'cohere/command-r-plus-08-2024': 'ADVANCED',
  'anthropic/claude-4-sonnet': 'ADVANCED',
  'google/gemini-pro-2.5': 'ADVANCED',

  // PREMIUM MODELS (Business+ tiers) - High cost, best performance  
  'openai/gpt-4o': 'PREMIUM',
  'openai/gpt-4.1': 'PREMIUM',
  'anthropic/claude-4-opus': 'PREMIUM',
  'meta-llama/llama-3.1-405b-instruct': 'PREMIUM',
  'perplexity/llama-3.1-sonar-huge-128k-online': 'PREMIUM'
};

// Tier configurations with model access and credit limits
export const TIER_CONFIGURATIONS: Record<UserTier, ModelTierConfig> = {
  entry: {
    tier: 'entry',
    allowedModels: Object.keys(MODEL_TIER_MAPPING).filter(
      model => MODEL_TIER_MAPPING[model] === 'BASE'
    ),
    maxCreditsPerMonth: 250, // Reduced from previous to ensure profitability
    features: [
      '250 AI credits per month',
      'Basic AI models (cost-efficient)',
      '500 leads per month',
      'Basic lead filtering',
      'Email support',
      'Basic analytics',
      'CRM access',
      'Territory mapping'
    ]
  },
  professional: {
    tier: 'professional',
    allowedModels: [
      ...Object.keys(MODEL_TIER_MAPPING).filter(
        model => MODEL_TIER_MAPPING[model] === 'BASE'
      ),
      ...Object.keys(MODEL_TIER_MAPPING).filter(
        model => MODEL_TIER_MAPPING[model] === 'ADVANCED'
      )
    ],
    maxCreditsPerMonth: 2000,
    features: [
      '2,000 AI credits per month',
      'Basic + Advanced AI models',
      '5,000 leads per month',
      'Advanced lead filtering',
      'Priority support',
      'Advanced analytics',
      'Custom exports',
      'Team collaboration',
      'Email integration',
      'Video conferencing'
    ]
  },
  business: {
    tier: 'business',
    allowedModels: Object.keys(MODEL_TIER_MAPPING), // All models
    maxCreditsPerMonth: 8000,
    features: [
      '8,000 AI credits per month',
      'All AI models available',
      '15,000 leads per month',
      'All Professional features',
      'Canva integration',
      'Adobe Express access',
      'Advanced AI workflows',
      'Custom integrations',
      'API access',
      'Dedicated support'
    ]
  },
  premium: {
    tier: 'premium',
    allowedModels: Object.keys(MODEL_TIER_MAPPING), // All models + custom
    maxCreditsPerMonth: 20000,
    features: [
      '20,000 AI credits per month',
      'All AI models + custom API keys',
      'Unlimited leads',
      'All Business features',
      'CaptureIT Calls & Messages',
      'Advanced video conferencing',
      'Custom AI models via API keys',
      'Custom image/video generation',
      'White-label options',
      '24/7 dedicated support',
      'Custom features'
    ]
  }
};

// Check if user's tier allows access to a specific model
export function canAccessModel(userTier: UserTier, modelId: string): boolean {
  const tierConfig = TIER_CONFIGURATIONS[userTier];
  return tierConfig.allowedModels.includes(modelId);
}

// Get model recommendations based on user tier
export function getRecommendedModels(userTier: UserTier): string[] {
  const tierConfig = TIER_CONFIGURATIONS[userTier];
  
  // Return a subset of recommended models for the tier
  switch (userTier) {
    case 'entry':
      return ['deepseek/deepseek-chat', 'google/gemini-flash-2.5'];
    case 'professional':
      return ['deepseek/deepseek-chat', 'mistralai/mistral-large-2411', 'anthropic/claude-4-sonnet'];
    case 'business':
    case 'premium':
      return ['openai/gpt-4o', 'anthropic/claude-4-opus', 'google/gemini-pro-2.5'];
    default:
      return ['deepseek/deepseek-chat'];
  }
}

// Calculate estimated cost per credit based on model usage
export function calculateCreditCost(modelId: string): number {
  const category = MODEL_TIER_MAPPING[modelId];
  
  // Base credit cost multipliers
  switch (category) {
    case 'BASE': return 1; // 1 credit = base cost
    case 'ADVANCED': return 3; // 3 credits = advanced cost
    case 'PREMIUM': return 8; // 8 credits = premium cost
    default: return 1;
  }
}

// Get tier upgrade suggestions
export function getTierUpgradeSuggestions(currentTier: UserTier): {
  nextTier: UserTier | null;
  benefits: string[];
} {
  switch (currentTier) {
    case 'entry':
      return {
        nextTier: 'professional',
        benefits: [
          'Access to advanced AI models',
          '8x more AI credits (2,000)',
          '10x more leads (5,000)',
          'Priority support'
        ]
      };
    case 'professional':
      return {
        nextTier: 'business',
        benefits: [
          'Access to all premium AI models',
          '4x more AI credits (8,000)',
          'Canva & Adobe integrations',
          'API access'
        ]
      };
    case 'business':
      return {
        nextTier: 'premium',
        benefits: [
          'Use your own AI API keys',
          'Custom image/video generation',
          'Unlimited leads',
          'White-label options'
        ]
      };
    case 'premium':
      return {
        nextTier: null,
        benefits: ['You have the highest tier!']
      };
    default:
      return { nextTier: null, benefits: [] };
  }
}