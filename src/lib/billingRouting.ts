// Billing routing service - determines whether to use user's API keys or system keys
import { apiKeyService, type UserAPIKey } from './apiKeyManagement';
import { openRouterService } from './openRouterService';
import { paymentService } from './paymentServices';

export interface BillingRoute {
  useUserKey: boolean;
  apiKey?: UserAPIKey;
  provider: string;
  reason: string;
}

export class BillingRoutingService {
  private static instance: BillingRoutingService;

  private constructor() {}

  public static getInstance(): BillingRoutingService {
    if (!BillingRoutingService.instance) {
      BillingRoutingService.instance = new BillingRoutingService();
    }
    return BillingRoutingService.instance;
  }

  /**
   * Determine billing route for AI model usage
   */
  async determineAIBillingRoute(
    userId: string, 
    model: string, 
    userTier: string
  ): Promise<BillingRoute> {
    // Only Premium users can use their own API keys
    if (userTier !== 'premium') {
      return {
        useUserKey: false,
        provider: 'openrouter',
        reason: 'User tier does not support custom API keys'
      };
    }

    // Check if user has API key for the model's provider
    const modelProvider = this.getModelProvider(model);
    const hasUserKey = await apiKeyService.hasAPIKeyForProvider(userId, modelProvider);

    if (hasUserKey) {
      const userKeys = await apiKeyService.getUserAPIKeys(userId);
      const matchingKey = userKeys.find(key => 
        key.provider === modelProvider && key.isActive
      );

      if (matchingKey) {
        return {
          useUserKey: true,
          apiKey: matchingKey,
          provider: modelProvider,
          reason: 'User has active API key for this provider'
        };
      }
    }

    return {
      useUserKey: false,
      provider: 'openrouter',
      reason: 'No user API key found, using system billing'
    };
  }

  /**
   * Determine billing route for image generation
   */
  async determineImageBillingRoute(
    userId: string,
    service: string,
    userTier: string
  ): Promise<BillingRoute> {
    if (userTier !== 'premium') {
      return {
        useUserKey: false,
        provider: 'system',
        reason: 'User tier does not support custom API keys'
      };
    }

    const hasUserKey = await apiKeyService.hasAPIKeyForProvider(userId, service);
    
    if (hasUserKey) {
      const userKeys = await apiKeyService.getUserAPIKeys(userId);
      const matchingKey = userKeys.find(key => 
        key.provider === service && key.isActive
      );

      if (matchingKey) {
        return {
          useUserKey: true,
          apiKey: matchingKey,
          provider: service,
          reason: 'User has active API key for this service'
        };
      }
    }

    return {
      useUserKey: false,
      provider: 'system',
      reason: 'No user API key found, using system billing'
    };
  }

  /**
   * Determine billing route for video generation
   */
  async determineVideoBillingRoute(
    userId: string,
    service: string,
    userTier: string
  ): Promise<BillingRoute> {
    if (userTier !== 'premium') {
      return {
        useUserKey: false,
        provider: 'system',
        reason: 'User tier does not support custom API keys'
      };
    }

    const hasUserKey = await apiKeyService.hasAPIKeyForProvider(userId, service);
    
    if (hasUserKey) {
      const userKeys = await apiKeyService.getUserAPIKeys(userId);
      const matchingKey = userKeys.find(key => 
        key.provider === service && key.isActive
      );

      if (matchingKey) {
        return {
          useUserKey: true,
          apiKey: matchingKey,
          provider: service,
          reason: 'User has active API key for this service'
        };
      }
    }

    return {
      useUserKey: false,
      provider: 'system',
      reason: 'No user API key found, using system billing'
    };
  }

  /**
   * Execute AI model request with appropriate billing
   */
  async executeAIRequest(
    userId: string,
    messages: any[],
    model: string,
    userTier: string,
    options: any = {}
  ): Promise<any> {
    const billingRoute = await this.determineAIBillingRoute(userId, model, userTier);

    if (billingRoute.useUserKey && billingRoute.apiKey) {
      // Use user's API key - call appropriate provider directly
      return await this.callProviderDirectly(billingRoute.provider, billingRoute.apiKey, {
        messages,
        model,
        ...options
      });
    } else {
      // Use system billing through OpenRouter
      return await openRouterService.createChatCompletion(messages, model, {
        ...options,
        userTier: userTier as any,
        userId
      });
    }
  }

  /**
   * Execute image generation with appropriate billing
   */
  async executeImageGeneration(
    userId: string,
    prompt: string,
    service: string,
    userTier: string,
    options: any = {}
  ): Promise<any> {
    const billingRoute = await this.determineImageBillingRoute(userId, service, userTier);

    if (billingRoute.useUserKey && billingRoute.apiKey) {
      // Use user's API key
      return await this.callImageProviderDirectly(service, billingRoute.apiKey, {
        prompt,
        ...options
      });
    } else {
      // Use system billing - deduct credits
      const estimatedCredits = this.estimateImageCredits(service, options);
      const hasCredits = await paymentService.hasEnoughCredits(userId, estimatedCredits);
      
      if (!hasCredits) {
        throw new Error('Insufficient credits for image generation');
      }

      const result = await this.callImageProviderDirectly(service, null, { prompt, ...options });
      await paymentService.deductCredits(userId, estimatedCredits);
      
      return result;
    }
  }

  /**
   * Execute video generation with appropriate billing
   */
  async executeVideoGeneration(
    userId: string,
    prompt: string,
    service: string,
    userTier: string,
    options: any = {}
  ): Promise<any> {
    const billingRoute = await this.determineVideoBillingRoute(userId, service, userTier);

    if (billingRoute.useUserKey && billingRoute.apiKey) {
      // Use user's API key
      return await this.callVideoProviderDirectly(service, billingRoute.apiKey, {
        prompt,
        ...options
      });
    } else {
      // Use system billing - deduct credits
      const estimatedCredits = this.estimateVideoCredits(service, options);
      const hasCredits = await paymentService.hasEnoughCredits(userId, estimatedCredits);
      
      if (!hasCredits) {
        throw new Error('Insufficient credits for video generation');
      }

      const result = await this.callVideoProviderDirectly(service, null, { prompt, ...options });
      await paymentService.deductCredits(userId, estimatedCredits);
      
      return result;
    }
  }

  /**
   * Get provider name from model ID
   */
  private getModelProvider(model: string): string {
    if (model.includes('openai/')) return 'openai';
    if (model.includes('anthropic/')) return 'anthropic';
    if (model.includes('google/')) return 'google';
    if (model.includes('mistralai/')) return 'mistral';
    if (model.includes('cohere/')) return 'cohere';
    
    // Default to openai for unknown models
    return 'openai';
  }

  /**
   * Call AI provider directly using user's API key
   */
  private async callProviderDirectly(
    provider: string,
    apiKey: UserAPIKey,
    payload: any
  ): Promise<any> {
    // Update last used timestamp
    await apiKeyService.updateLastUsed(apiKey.id, apiKey.id);

    switch (provider) {
      case 'openai':
        return this.callOpenAI(apiKey.keys.apiKey, payload);
      case 'anthropic':
        return this.callAnthropic(apiKey.keys.apiKey, payload);
      case 'google':
        return this.callGoogle(apiKey.keys.apiKey, payload);
      case 'mistral':
        return this.callMistral(apiKey.keys.apiKey, payload);
      case 'cohere':
        return this.callCohere(apiKey.keys.apiKey, payload);
      default:
        throw new Error(`Provider ${provider} not supported`);
    }
  }

  /**
   * Call image provider directly
   */
  private async callImageProviderDirectly(
    provider: string,
    apiKey: UserAPIKey | null,
    payload: any
  ): Promise<any> {
    if (apiKey) {
      await apiKeyService.updateLastUsed(apiKey.id, apiKey.id);
    }

    // Implementation for different image providers
    // This would contain the actual API calls to each service
    switch (provider) {
      case 'dalle':
        return this.callDALLE(apiKey?.keys.apiKey || process.env.OPENAI_API_KEY!, payload);
      case 'midjourney':
        return this.callMidjourney(apiKey?.keys.apiKey || process.env.MIDJOURNEY_API_KEY!, payload);
      case 'stability':
        return this.callStability(apiKey?.keys.apiKey || process.env.STABILITY_API_KEY!, payload);
      case 'leonardo':
        return this.callLeonardo(apiKey?.keys.apiKey || process.env.LEONARDO_API_KEY!, payload);
      default:
        throw new Error(`Image provider ${provider} not supported`);
    }
  }

  /**
   * Call video provider directly
   */
  private async callVideoProviderDirectly(
    provider: string,
    apiKey: UserAPIKey | null,
    payload: any
  ): Promise<any> {
    if (apiKey) {
      await apiKeyService.updateLastUsed(apiKey.id, apiKey.id);
    }

    // Implementation for different video providers
    switch (provider) {
      case 'runway-gen4':
      case 'runway-gen4-turbo':
        return this.callRunway(apiKey?.keys.apiKey || process.env.RUNWAY_API_KEY!, payload, provider);
      case 'luma-dream-machine':
        return this.callLuma(apiKey?.keys.apiKey || process.env.LUMA_API_KEY!, payload);
      case 'pika-labs':
        return this.callPika(apiKey?.keys.apiKey || process.env.PIKA_API_KEY!, payload);
      case 'genmo':
        return this.callGenmo(apiKey?.keys.apiKey || process.env.GENMO_API_KEY!, payload);
      case 'invideo-ai':
        return this.callInVideo(apiKey?.keys.apiKey || process.env.INVIDEO_API_KEY!, payload);
      case 'synthesia':
        return this.callSynthesia(apiKey?.keys.apiKey || process.env.SYNTHESIA_API_KEY!, payload);
      default:
        throw new Error(`Video provider ${provider} not supported`);
    }
  }

  // Individual provider API implementations (placeholders)
  private async callOpenAI(apiKey: string, payload: any): Promise<any> {
    // Implementation for OpenAI API calls
    throw new Error('OpenAI direct API implementation needed');
  }

  private async callAnthropic(apiKey: string, payload: any): Promise<any> {
    // Implementation for Anthropic API calls
    throw new Error('Anthropic direct API implementation needed');
  }

  private async callGoogle(apiKey: string, payload: any): Promise<any> {
    // Implementation for Google AI API calls
    throw new Error('Google AI direct API implementation needed');
  }

  private async callMistral(apiKey: string, payload: any): Promise<any> {
    // Implementation for Mistral API calls
    throw new Error('Mistral direct API implementation needed');
  }

  private async callCohere(apiKey: string, payload: any): Promise<any> {
    // Implementation for Cohere API calls
    throw new Error('Cohere direct API implementation needed');
  }

  private async callDALLE(apiKey: string, payload: any): Promise<any> {
    // Implementation for DALL-E API calls
    throw new Error('DALL-E direct API implementation needed');
  }

  private async callMidjourney(apiKey: string, payload: any): Promise<any> {
    // Implementation for Midjourney API calls
    throw new Error('Midjourney direct API implementation needed');
  }

  private async callStability(apiKey: string, payload: any): Promise<any> {
    // Implementation for Stability AI API calls
    throw new Error('Stability AI direct API implementation needed');
  }

  private async callLeonardo(apiKey: string, payload: any): Promise<any> {
    // Implementation for Leonardo AI API calls
    throw new Error('Leonardo AI direct API implementation needed');
  }

  private async callRunway(apiKey: string, payload: any, variant: string): Promise<any> {
    // Implementation for Runway API calls
    throw new Error('Runway direct API implementation needed');
  }

  private async callLuma(apiKey: string, payload: any): Promise<any> {
    // Implementation for Luma API calls
    throw new Error('Luma direct API implementation needed');
  }

  private async callPika(apiKey: string, payload: any): Promise<any> {
    // Implementation for Pika Labs API calls
    throw new Error('Pika Labs direct API implementation needed');
  }

  private async callGenmo(apiKey: string, payload: any): Promise<any> {
    // Implementation for Genmo API calls
    throw new Error('Genmo direct API implementation needed');
  }

  private async callInVideo(apiKey: string, payload: any): Promise<any> {
    // Implementation for InVideo AI API calls
    throw new Error('InVideo AI direct API implementation needed');
  }

  private async callSynthesia(apiKey: string, payload: any): Promise<any> {
    // Implementation for Synthesia API calls
    throw new Error('Synthesia direct API implementation needed');
  }

  // Credit estimation methods
  private estimateImageCredits(service: string, options: any): number {
    // Base credits for different image services
    const baseCosts = {
      'dalle': 50,
      'midjourney': 75,
      'stability': 30,
      'leonardo': 40
    };
    
    return baseCosts[service as keyof typeof baseCosts] || 50;
  }

  private estimateVideoCredits(service: string, options: any): number {
    // Base credits for different video services (much higher than images)
    const baseCosts = {
      'runway-gen4': 500,
      'runway-gen4-turbo': 300,
      'luma-dream-machine': 400,
      'pika-labs': 350,
      'genmo': 300,
      'invideo-ai': 250,
      'synthesia': 600
    };
    
    return baseCosts[service as keyof typeof baseCosts] || 400;
  }
}

// Export singleton instance
export const billingRoutingService = BillingRoutingService.getInstance();