// OpenRouter API service for unified LLM access
export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: number; // per 1M tokens
    completion: number; // per 1M tokens
  };
  context_length: number;
  top_provider: {
    max_completion_tokens: number;
  };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Available models with pricing (as of latest OpenRouter pricing)
export const OPENROUTER_MODELS: Record<string, OpenRouterModel> = {
  'openai/gpt-4o': {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI\'s latest multimodal model',
    pricing: { prompt: 5.00, completion: 15.00 },
    context_length: 128000,
    top_provider: { max_completion_tokens: 4096 }
  },
  'openai/gpt-4-turbo': {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'OpenAI\'s most capable model',
    pricing: { prompt: 10.00, completion: 30.00 },
    context_length: 128000,
    top_provider: { max_completion_tokens: 4096 }
  },
  'anthropic/claude-3.5-sonnet': {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic\'s most balanced model',
    pricing: { prompt: 3.00, completion: 15.00 },
    context_length: 200000,
    top_provider: { max_completion_tokens: 8192 }
  },
  'anthropic/claude-3-opus': {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most powerful model',
    pricing: { prompt: 15.00, completion: 75.00 },
    context_length: 200000,
    top_provider: { max_completion_tokens: 4096 }
  },
  'google/gemini-pro-1.5': {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    description: 'Google\'s advanced model',
    pricing: { prompt: 3.50, completion: 10.50 },
    context_length: 2000000,
    top_provider: { max_completion_tokens: 8192 }
  },
  'google/gemini-flash-1.5': {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    description: 'Google\'s fast and efficient model',
    pricing: { prompt: 0.075, completion: 0.30 },
    context_length: 1000000,
    top_provider: { max_completion_tokens: 8192 }
  }
};

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is required');
    }
  }

  /**
   * Make a chat completion request to OpenRouter
   */
  async createChatCompletion(
    messages: ChatMessage[],
    model: string = 'openai/gpt-4o',
    options: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
      tools?: any[];
      tool_choice?: string;
    } = {}
  ): Promise<OpenRouterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'CaptureIT LS'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens,
          stream: options.stream || false,
          tools: options.tools,
          tool_choice: options.tool_choice
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }

  /**
   * Calculate the cost of a request based on token usage
   */
  calculateCost(model: string, promptTokens: number, completionTokens: number): number {
    const modelInfo = OPENROUTER_MODELS[model];
    if (!modelInfo) {
      console.warn(`Model ${model} not found in pricing table`);
      return 0;
    }

    const promptCost = (promptTokens / 1000000) * modelInfo.pricing.prompt;
    const completionCost = (completionTokens / 1000000) * modelInfo.pricing.completion;
    
    return promptCost + completionCost;
  }

  /**
   * Get available models
   */
  getAvailableModels(): OpenRouterModel[] {
    return Object.values(OPENROUTER_MODELS);
  }

  /**
   * Get model by ID
   */
  getModel(modelId: string): OpenRouterModel | undefined {
    return OPENROUTER_MODELS[modelId];
  }

  /**
   * Create a streaming chat completion
   */
  async createStreamingChatCompletion(
    messages: ChatMessage[],
    model: string = 'openai/gpt-4o',
    options: {
      temperature?: number;
      max_tokens?: number;
      tools?: any[];
      tool_choice?: string;
    } = {}
  ): Promise<ReadableStream> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'CaptureIT LS'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens,
        stream: true,
        tools: options.tools,
        tool_choice: options.tool_choice
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    return response.body!;
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();