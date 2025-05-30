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

// Available Segmind video/image services
export const SEGMIND_SERVICES = {
  // Video Services
  'minimax-video-01': {
    name: 'Minimax Video 01 Live',
    type: 'video',
    endpoint: '/minimax-video-01',
    maxDuration: 6,
    supportsTryOn: false
  },
  'minimax-video-director': {
    name: 'Minimax AI Director Video',
    type: 'video', 
    endpoint: '/minimax-video-director',
    maxDuration: 10,
    supportsTryOn: false
  },
  'kling-video': {
    name: 'Kling Video (Newest)',
    type: 'video',
    endpoint: '/kling-video',
    maxDuration: 5,
    supportsTryOn: false
  },
  'minimax-tryon': {
    name: 'Minimax Try-On',
    type: 'video',
    endpoint: '/minimax-tryon',
    maxDuration: 4,
    supportsTryOn: true
  },
  // Image Services
  'flux-pro': {
    name: 'FLUX Pro',
    type: 'image',
    endpoint: '/flux-pro',
    maxResolution: '1024x1024'
  },
  'sdxl': {
    name: 'Stable Diffusion XL',
    type: 'image', 
    endpoint: '/sdxl',
    maxResolution: '1024x1024'
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
}

// Export singleton instance
export const segmindService = new SegmindService();