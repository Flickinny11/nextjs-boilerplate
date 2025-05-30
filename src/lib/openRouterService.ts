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
  // Core Premium Models
  'openai/gpt-4o': {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'Advanced reasoning and generation',
    pricing: { prompt: 5.00, completion: 15.00 },
    context_length: 128000,
    top_provider: { max_completion_tokens: 4096 }
  },
  'openai/gpt-4.1': {
    id: 'openai/gpt-4.1',
    name: 'GPT-4.1',
    description: 'OpenAI\'s latest enhanced model',
    pricing: { prompt: 12.00, completion: 36.00 },
    context_length: 128000,
    top_provider: { max_completion_tokens: 4096 }
  },
  'anthropic/claude-4-sonnet': {
    id: 'anthropic/claude-4-sonnet',
    name: 'Claude 4 Sonnet',
    description: 'Superior analysis and writing',
    pricing: { prompt: 3.00, completion: 15.00 },
    context_length: 200000,
    top_provider: { max_completion_tokens: 8192 }
  },
  'anthropic/claude-4-opus': {
    id: 'anthropic/claude-4-opus',
    name: 'Claude Opus 4',
    description: 'Superior analysis and writing, complex instruction understanding',
    pricing: { prompt: 15.00, completion: 75.00 },
    context_length: 200000,
    top_provider: { max_completion_tokens: 4096 }
  },
  'google/gemini-pro-2.5': {
    id: 'google/gemini-pro-2.5',
    name: 'Gemini Pro 2.5',
    description: 'Large context processing',
    pricing: { prompt: 3.50, completion: 10.50 },
    context_length: 2000000,
    top_provider: { max_completion_tokens: 8192 }
  },
  'google/gemini-flash-2.5': {
    id: 'google/gemini-flash-2.5',
    name: 'Gemini Flash 2.5',
    description: 'Fast, efficient responses',
    pricing: { prompt: 0.075, completion: 0.30 },
    context_length: 1000000,
    top_provider: { max_completion_tokens: 8192 }
  },
  // Meta Llama Models
  'meta-llama/llama-3.2-90b-instruct': {
    id: 'meta-llama/llama-3.2-90b-instruct',
    name: 'Llama 3.2 90B Instruct',
    description: 'Large open-source instruction model',
    pricing: { prompt: 0.90, completion: 0.90 },
    context_length: 131072,
    top_provider: { max_completion_tokens: 4096 }
  },
  'meta-llama/llama-3.1-405b-instruct': {
    id: 'meta-llama/llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B Instruct',
    description: 'Largest open-source instruction model',
    pricing: { prompt: 5.32, completion: 16.00 },
    context_length: 131072,
    top_provider: { max_completion_tokens: 4096 }
  },
  // 8 Additional Latest Models (rotating based on release dates)
  'qwen/qwen-2.5-72b-instruct': {
    id: 'qwen/qwen-2.5-72b-instruct',
    name: 'Qwen 2.5 72B Instruct',
    description: 'Latest Qwen instruction model',
    pricing: { prompt: 0.56, completion: 2.24 },
    context_length: 131072,
    top_provider: { max_completion_tokens: 8192 }
  },
  'mistralai/mistral-large-2411': {
    id: 'mistralai/mistral-large-2411',
    name: 'Mistral Large 2411',
    description: 'Latest Mistral large model',
    pricing: { prompt: 2.00, completion: 6.00 },
    context_length: 128000,
    top_provider: { max_completion_tokens: 4096 }
  },
  'deepseek/deepseek-chat': {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek Chat',
    description: 'Advanced reasoning and coding model',
    pricing: { prompt: 0.14, completion: 0.28 },
    context_length: 64000,
    top_provider: { max_completion_tokens: 4096 }
  },
  'x-ai/grok-2-1212': {
    id: 'x-ai/grok-2-1212',
    name: 'Grok 2 1212',
    description: 'Latest xAI conversational model',
    pricing: { prompt: 2.00, completion: 10.00 },
    context_length: 131072,
    top_provider: { max_completion_tokens: 4096 }
  },
  'cohere/command-r-plus-08-2024': {
    id: 'cohere/command-r-plus-08-2024',
    name: 'Command R+ 08-2024',
    description: 'Latest Cohere command model',
    pricing: { prompt: 2.50, completion: 10.00 },
    context_length: 128000,
    top_provider: { max_completion_tokens: 4096 }
  },
  'databricks/dbrx-instruct': {
    id: 'databricks/dbrx-instruct',
    name: 'DBRX Instruct',
    description: 'Databricks instruction model',
    pricing: { prompt: 0.75, completion: 2.25 },
    context_length: 32768,
    top_provider: { max_completion_tokens: 4096 }
  },
  'nous-hermes-2-mixtral-8x7b-dpo': {
    id: 'nous-hermes-2-mixtral-8x7b-dpo',
    name: 'Nous Hermes 2 Mixtral 8x7B DPO',
    description: 'Fine-tuned Mixtral model',
    pricing: { prompt: 0.27, completion: 0.27 },
    context_length: 32768,
    top_provider: { max_completion_tokens: 4096 }
  },
  'perplexity/llama-3.1-sonar-huge-128k-online': {
    id: 'perplexity/llama-3.1-sonar-huge-128k-online',
    name: 'Llama 3.1 Sonar Huge 128K Online',
    description: 'Perplexity online search-enhanced model',
    pricing: { prompt: 5.00, completion: 5.00 },
    context_length: 127072,
    top_provider: { max_completion_tokens: 4096 }
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