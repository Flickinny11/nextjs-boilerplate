// Segmind API service for video and image generation
export interface SegmindVideoRequest {
  prompt: string;
  image_url?: string;
  duration?: number; // in seconds
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  seed?: number;
}

export interface SegmindImageRequest {
  prompt: string;
  negative_prompt?: string;
  samples?: number;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
}

export interface SegmindResponse {
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  message?: string;
  output?: string | string[];
  eta?: number;
  job_id?: string;
}

export interface MarketingContentRequest {
  companyName: string;
  companyLogo?: string;
  brandColors?: string[];
  targetAudience: string;
  messageType: 'promotional' | 'educational' | 'testimonial' | 'brand-awareness';
  keyMessage: string;
  callToAction?: string;
  style: 'professional' | 'casual' | 'modern' | 'classic';
}

export interface ContentGenerationResult {
  images: Array<{
    url: string;
    prompt: string;
    style: 'existing-brand' | 'ai-optimized';
    type: 'social-post' | 'ad-banner' | 'hero-image' | 'product-showcase';
  }>;
  video?: {
    url: string;
    prompt: string;
    duration: number;
    progress?: number;
    jobId?: string;
  };
  metadata: {
    generatedAt: string;
    totalItems: number;
    processingTime: number;
  };
}

// Available Segmind video/image services
export const SEGMIND_SERVICES = {
  // Video Services
  'minimax-video-01': {
    name: 'Minimax Video 01 Live',
    type: 'video',
    endpoint: '/minimax-video-01',
    maxDuration: 6,
    supportsTryOn: false,
    ideal: 'quick marketing videos'
  },
  'minimax-video-director': {
    name: 'Minimax AI Director Video',
    type: 'video', 
    endpoint: '/minimax-video-director',
    maxDuration: 10,
    supportsTryOn: false,
    ideal: 'cinematic brand videos'
  },
  'kling-video': {
    name: 'Kling Video (Newest)',
    type: 'video',
    endpoint: '/kling-video',
    maxDuration: 5,
    supportsTryOn: false,
    ideal: 'high-quality short content'
  },
  'minimax-tryon': {
    name: 'Minimax Try-On',
    type: 'video',
    endpoint: '/minimax-tryon',
    maxDuration: 4,
    supportsTryOn: true,
    ideal: 'product demonstrations'
  },
  // Image Services
  'flux-pro': {
    name: 'FLUX Pro',
    type: 'image',
    endpoint: '/flux-pro',
    maxResolution: '1024x1024',
    ideal: 'photorealistic marketing images'
  },
  'flux-dev': {
    name: 'FLUX Dev',
    type: 'image',
    endpoint: '/flux-dev',
    maxResolution: '1024x1024',
    ideal: 'creative and artistic content'
  },
  'sdxl': {
    name: 'Stable Diffusion XL',
    type: 'image', 
    endpoint: '/sdxl',
    maxResolution: '1024x1024',
    ideal: 'general purpose images'
  },
  'midjourney': {
    name: 'Midjourney Style',
    type: 'image',
    endpoint: '/midjourney',
    maxResolution: '1024x1024',
    ideal: 'premium artistic content'
  },
  // Enhancement Services
  'real-esrgan': {
    name: 'Real-ESRGAN Upscaler',
    type: 'enhancement',
    endpoint: '/real-esrgan',
    ideal: 'image quality enhancement'
  },
  'remove-bg': {
    name: 'Background Removal',
    type: 'enhancement',
    endpoint: '/remove-bg',
    ideal: 'product image cleanup'
  }
} as const;

export type SegmindServiceId = keyof typeof SEGMIND_SERVICES;

export class SegmindService {
  private apiKey: string;
  private baseUrl = 'https://api.segmind.com/v1';

  constructor() {
    this.apiKey = process.env.SEGMIND_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('SEGMIND_API_KEY is required');
    }
  }

  /**
   * Generate video using specified service
   */
  async generateVideo(
    serviceId: SegmindServiceId,
    request: SegmindVideoRequest
  ): Promise<SegmindResponse> {
    const service = SEGMIND_SERVICES[serviceId];
    if (service.type !== 'video') {
      throw new Error(`Service ${serviceId} is not a video service`);
    }

    try {
      const response = await fetch(`${this.baseUrl}${service.endpoint}`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          image_url: request.image_url,
          duration: Math.min(request.duration || 5, service.maxDuration),
          aspect_ratio: request.aspect_ratio || '16:9',
          seed: request.seed
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Segmind API error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Segmind ${serviceId} error:`, error);
      throw error;
    }
  }

  /**
   * Generate image using specified service
   */
  async generateImage(
    serviceId: SegmindServiceId,
    request: SegmindImageRequest  
  ): Promise<SegmindResponse> {
    const service = SEGMIND_SERVICES[serviceId];
    if (service.type !== 'image') {
      throw new Error(`Service ${serviceId} is not an image service`);
    }

    try {
      const response = await fetch(`${this.baseUrl}${service.endpoint}`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          negative_prompt: request.negative_prompt,
          samples: request.samples || 1,
          width: request.width || 1024,
          height: request.height || 1024,
          num_inference_steps: request.num_inference_steps || 20,
          guidance_scale: request.guidance_scale || 7.5,
          seed: request.seed
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Segmind API error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Segmind ${serviceId} error:`, error);
      throw error;
    }
  }

  /**
   * Check job status for async operations
   */
  async checkJobStatus(jobId: string): Promise<SegmindResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/job/${jobId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Segmind API error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Segmind job status error:', error);
      throw error;
    }
  }

  /**
   * Get best video service for given requirements
   */
  getBestVideoService(requirements: {
    hasTryOn?: boolean;
    duration?: number;
    type?: 'marketing' | 'product' | 'fashion';
  }): SegmindServiceId {
    // If try-on is needed and there's an image, use minimax-tryon
    if (requirements.hasTryOn) {
      return 'minimax-tryon';
    }

    // For longer videos, use minimax-video-director
    if (requirements.duration && requirements.duration > 6) {
      return 'minimax-video-director';
    }

    // For quick videos or live content, use minimax-video-01
    if (requirements.type === 'marketing') {
      return 'minimax-video-01';
    }

    // Default to newest Kling video
    return 'kling-video';
  }

  /**
   * Get best image service for given requirements
   */
  getBestImageService(requirements: {
    quality?: 'fast' | 'high';
    style?: 'photorealistic' | 'artistic';
  }): SegmindServiceId {
    // For high quality or photorealistic, use FLUX Pro
    if (requirements.quality === 'high' || requirements.style === 'photorealistic') {
      return 'flux-pro';
    }

    // Default to SDXL for artistic or general use
    return 'sdxl';
  }

  /**
   * Get available services
   */
  getAvailableServices() {
    return SEGMIND_SERVICES;
  }

  /**
   * Get video services only
   */
  getVideoServices() {
    return Object.entries(SEGMIND_SERVICES)
      .filter(([_, service]) => service.type === 'video')
      .reduce((acc, [key, service]) => ({ ...acc, [key]: service }), {});
  }

  /**
   * Get image services only  
   */
  getImageServices() {
    return Object.entries(SEGMIND_SERVICES)
      .filter(([_, service]) => service.type === 'image')
      .reduce((acc, [key, service]) => ({ ...acc, [key]: service }), {});
  }

  /**
   * Generate marketing content package with A/B test variations
   */
  async generateMarketingContent(request: MarketingContentRequest): Promise<ContentGenerationResult> {
    const startTime = Date.now();
    const results: ContentGenerationResult = {
      images: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        totalItems: 0,
        processingTime: 0
      }
    };

    try {
      // Generate 4 images for A/B testing (2 existing style, 2 AI-optimized)
      const imagePromises = await this.generateABTestImages(request);
      results.images = await Promise.all(imagePromises);

      // Generate marketing video
      const videoResult = await this.generateMarketingVideo(request);
      if (videoResult) {
        results.video = videoResult;
      }

      results.metadata.totalItems = results.images.length + (results.video ? 1 : 0);
      results.metadata.processingTime = Date.now() - startTime;

      return results;
    } catch (error) {
      console.error('Marketing content generation error:', error);
      throw error;
    }
  }

  /**
   * Generate A/B test images (2 existing style + 2 AI-optimized)
   */
  private async generateABTestImages(request: MarketingContentRequest): Promise<Array<Promise<any>>> {
    const basePrompt = this.buildImagePrompt(request);
    
    // Style variations for A/B testing
    const variations = [
      // Existing brand style variations
      {
        prompt: `${basePrompt}, corporate style, clean professional layout, ${request.companyName} branding`,
        style: 'existing-brand' as const,
        type: 'social-post' as const,
        service: 'flux-pro' as const
      },
      {
        prompt: `${basePrompt}, traditional business aesthetic, established brand look, professional photography style`,
        style: 'existing-brand' as const,
        type: 'ad-banner' as const,
        service: 'sdxl' as const
      },
      // AI-optimized variations  
      {
        prompt: `${basePrompt}, modern dynamic design, cutting-edge visual style, eye-catching composition, high engagement potential`,
        style: 'ai-optimized' as const,
        type: 'hero-image' as const,
        service: 'flux-dev' as const
      },
      {
        prompt: `${basePrompt}, innovative creative approach, psychological impact design, conversion-optimized visual hierarchy`,
        style: 'ai-optimized' as const,
        type: 'product-showcase' as const,
        service: 'midjourney' as const
      }
    ];

    return variations.map(async (variation, index) => {
      try {
        const response = await this.generateImage(variation.service, {
          prompt: variation.prompt,
          negative_prompt: 'blurry, low quality, unprofessional, cluttered',
          width: 1024,
          height: 1024,
          guidance_scale: 7.5,
          seed: Date.now() + index
        });

        return {
          url: Array.isArray(response.output) ? response.output[0] : response.output || '',
          prompt: variation.prompt,
          style: variation.style,
          type: variation.type
        };
      } catch (error) {
        console.error(`Image generation error for variation ${index}:`, error);
        return {
          url: '',
          prompt: variation.prompt,
          style: variation.style,
          type: variation.type,
          error: 'Generation failed'
        };
      }
    });
  }

  /**
   * Generate marketing video with company branding
   */
  private async generateMarketingVideo(request: MarketingContentRequest): Promise<any> {
    try {
      const videoPrompt = this.buildVideoPrompt(request);
      const bestService = this.getBestVideoService({
        type: 'marketing',
        duration: 10
      });

      const response = await this.generateVideo(bestService, {
        prompt: videoPrompt,
        duration: 10,
        aspect_ratio: '16:9',
        seed: Date.now()
      });

      return {
        url: response.output || '',
        prompt: videoPrompt,
        duration: 10,
        jobId: response.job_id,
        progress: response.status === 'COMPLETED' ? 100 : 0
      };
    } catch (error) {
      console.error('Video generation error:', error);
      return null;
    }
  }

  /**
   * Build optimized image prompt for marketing content
   */
  private buildImagePrompt(request: MarketingContentRequest): string {
    const { companyName, targetAudience, messageType, keyMessage, style, callToAction } = request;
    
    let prompt = `Professional marketing image for ${companyName}, targeting ${targetAudience}`;
    
    // Add message type specific elements
    switch (messageType) {
      case 'promotional':
        prompt += `, promotional design, special offer, attention-grabbing`;
        break;
      case 'educational':
        prompt += `, educational content, informative design, expert authority`;
        break;
      case 'testimonial':
        prompt += `, customer testimonial, trust-building, social proof`;
        break;
      case 'brand-awareness':
        prompt += `, brand recognition, memorable design, brand identity`;
        break;
    }

    // Add style elements
    switch (style) {
      case 'professional':
        prompt += `, corporate professional, clean lines, sophisticated`;
        break;
      case 'casual':
        prompt += `, friendly approachable, relaxed atmosphere, casual style`;
        break;
      case 'modern':
        prompt += `, contemporary design, cutting-edge, innovative look`;
        break;
      case 'classic':
        prompt += `, timeless design, traditional elegance, established feel`;
        break;
    }

    prompt += `, ${keyMessage}`;
    
    if (callToAction) {
      prompt += `, clear call-to-action, conversion-focused`;
    }

    prompt += `, high quality, professional photography, marketing ready`;

    return prompt;
  }

  /**
   * Build optimized video prompt for marketing content
   */
  private buildVideoPrompt(request: MarketingContentRequest): string {
    const { companyName, targetAudience, keyMessage, style } = request;
    
    let prompt = `Professional marketing video for ${companyName}, showcasing ${keyMessage}`;
    prompt += `, targeting ${targetAudience}, ${style} aesthetic`;
    prompt += `, engaging visuals, smooth transitions, professional quality`;
    prompt += `, brand-focused, conversion-oriented, memorable impact`;
    
    return prompt;
  }

  /**
   * Enhance image quality using upscaling
   */
  async enhanceImage(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/real-esrgan`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: imageUrl,
          scale: 2
        })
      });

      if (!response.ok) {
        throw new Error(`Enhancement failed: ${response.status}`);
      }

      const result = await response.json();
      return Array.isArray(result.output) ? result.output[0] : result.output || imageUrl;
    } catch (error) {
      console.error('Image enhancement error:', error);
      return imageUrl; // Return original if enhancement fails
    }
  }

  /**
   * Remove background from product images
   */
  async removeBackground(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/remove-bg`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: imageUrl
        })
      });

      if (!response.ok) {
        throw new Error(`Background removal failed: ${response.status}`);
      }

      const result = await response.json();
      return Array.isArray(result.output) ? result.output[0] : result.output || imageUrl;
    } catch (error) {
      console.error('Background removal error:', error);
      return imageUrl; // Return original if removal fails
    }
  }

  /**
   * Get content generation progress for video
   */
  async getVideoProgress(jobId: string): Promise<{ progress: number; status: string; url?: string }> {
    try {
      const response = await this.checkJobStatus(jobId);
      
      let progress = 0;
      switch (response.status) {
        case 'QUEUED':
          progress = 10;
          break;
        case 'IN_PROGRESS':
          progress = 50;
          break;
        case 'COMPLETED':
          progress = 100;
          break;
        case 'FAILED':
          progress = 0;
          break;
      }

      return {
        progress,
        status: response.status,
        url: response.status === 'COMPLETED' ? 
          (Array.isArray(response.output) ? response.output[0] : response.output) : 
          undefined
      };
    } catch (error) {
      console.error('Video progress check error:', error);
      return { progress: 0, status: 'FAILED' };
    }
  }
}

// Export singleton instance
export const segmindService = new SegmindService();