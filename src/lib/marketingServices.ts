import { openRouterService, ChatMessage as OpenRouterChatMessage } from "./openRouterService";
import { segmindService, SegmindServiceId } from "./segmindService";
import { Lead } from "./aiServices";

// Types for marketing content
export interface MarketingContentRequest {
  contentType: 'text' | 'image' | 'video';
  audience: {
    industry?: string;
    interests?: string[];
    demographics?: string;
  };
  purpose: string;
  tone: string;
  length?: string;
  format?: string;
  additionalInstructions?: string;
  targetLeads?: Lead[];
  model?: string; // OpenRouter model to use
  uploadedImage?: string; // URL of uploaded image
  campaignId?: string; // Campaign this media is for
  useCampaignStyles?: boolean; // Use saved campaign styles
  quantity?: number; // Number of pieces to generate
  videoDuration?: number; // For video content
}

export interface CampaignStyles {
  colors: string[];
  fonts: string[];
  logoUrl?: string;
  brandGuidelines?: string;
  tone: string;
}

export interface TextContent {
  content: string;
  title?: string;
  bullets?: string[];
}

export interface ImageContent {
  url: string;
  prompt: string;
  alt?: string;
  service?: string;
}

export interface VideoContent {
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  service?: string;
  duration?: number;
}

export type MarketingContent = TextContent | ImageContent | VideoContent;

// Chat and brainstorming interface
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getMarketingStrategy(
  messages: ChatMessage[],
  leads: Lead[] = [],
  model: string = 'openai/gpt-4o'
): Promise<string> {
  try {
    // Prepare the conversation context with lead information if available
    let systemPrompt = "You are a marketing strategy expert with comprehensive agent tools helping create effective campaigns for leads.";
    
    if (leads.length > 0) {
      systemPrompt += " Here is information about the target audience:";
      const leadSummary = leads.slice(0, 5).map(lead => 
        `- ${lead.name}: ${lead.position} at ${lead.company}, industry: ${lead.industry}`
      ).join("\n");
      systemPrompt += `\n${leadSummary}`;
      
      if (leads.length > 5) {
        systemPrompt += `\n... and ${leads.length - 5} more leads with similar profiles.`;
      }
    }

    const chatMessages: OpenRouterChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await openRouterService.createChatCompletion(
      chatMessages,
      model,
      { temperature: 0.7 }
    );

    return response.choices[0].message.content || "No strategy could be generated.";
  } catch (error) {
    console.error("Marketing strategy generation error:", error);
    throw new Error("Failed to generate marketing strategy");
  }
}

// AI-powered media generator that selects best service for user request
export async function generateMarketingContent(
  request: MarketingContentRequest
): Promise<MarketingContent> {
  try {
    // First, analyze the request to determine best approach
    const mediaAnalysis = await analyzeMediaRequest(request);
    
    switch (request.contentType) {
      case "text":
        return await generateTextContent(request);
      case "image":
        return await generateImageContent(request, mediaAnalysis.recommendedImageService);
      case "video":
        return await generateVideoContent(request, mediaAnalysis.recommendedVideoService);
      default:
        throw new Error(`Unsupported content type: ${request.contentType}`);
    }
  } catch (error) {
    console.error("Content generation error:", error);
    throw new Error(`Failed to generate ${request.contentType} content`);
  }
}

// AI analyzes the user request to select best media generation service
async function analyzeMediaRequest(request: MarketingContentRequest): Promise<{
  recommendedVideoService: SegmindServiceId;
  recommendedImageService: SegmindServiceId;
  enhancedPrompt: string;
}> {
  try {
    const analysisPrompt = `
    Analyze this media generation request and recommend the best services:
    
    Request: ${JSON.stringify(request)}
    
    Available video services:
    - minimax-video-01: Best for marketing videos up to 6 seconds
    - minimax-video-director: Best for longer videos up to 10 seconds  
    - kling-video: Newest technology, up to 5 seconds
    - minimax-tryon: For try-on videos with clothing/fashion, up to 4 seconds
    
    Available image services:
    - flux-pro: High quality, photorealistic images
    - sdxl: Artistic and general purpose images
    
    Consider:
    - If there's an uploaded image of clothing/fashion → use minimax-tryon
    - For marketing/promo content → consider minimax-video-01 or kling-video
    - For longer content → use minimax-video-director
    - For high quality images → use flux-pro
    - For artistic images → use sdxl
    
    Return JSON with: recommendedVideoService, recommendedImageService, enhancedPrompt
    `;

    const messages: OpenRouterChatMessage[] = [
      {
        role: "system", 
        content: "You are an AI media service selector. Analyze requests and recommend the best generation service."
      },
      { role: "user", content: analysisPrompt }
    ];

    const response = await openRouterService.createChatCompletion(
      messages,
      request.model || 'openai/gpt-4o',
      { temperature: 0.3 }
    );

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error("Media analysis error:", error);
    // Return defaults if analysis fails
    return {
      recommendedVideoService: 'kling-video' as SegmindServiceId,
      recommendedImageService: 'flux-pro' as SegmindServiceId,
      enhancedPrompt: request.purpose
    };
  }
}

// Generate text content using OpenRouter
async function generateTextContent(request: MarketingContentRequest): Promise<TextContent> {
  try {
    let prompt = `Create ${request.format || "marketing text"} for ${request.audience.industry || "general"} audience with a ${request.tone} tone.`;
    prompt += `\nPurpose: ${request.purpose}`;
    
    if (request.length) {
      prompt += `\nLength: ${request.length}`;
    }
    
    if (request.additionalInstructions) {
      prompt += `\nAdditional instructions: ${request.additionalInstructions}`;
    }
    
    if (request.targetLeads && request.targetLeads.length > 0) {
      prompt += "\nTarget audience information:";
      request.targetLeads.slice(0, 3).forEach(lead => {
        prompt += `\n- ${lead.name}: ${lead.position} at ${lead.company}, industry: ${lead.industry}`;
        if (lead.interests && lead.interests.length > 0) {
          prompt += `, interests: ${lead.interests.join(", ")}`;
        }
      });
    }
    
    const messages: OpenRouterChatMessage[] = [
      { 
        role: "system", 
        content: "You are a professional copywriter specializing in marketing content creation." 
      },
      { role: "user", content: prompt }
    ];

    const response = await openRouterService.createChatCompletion(
      messages,
      request.model || 'openai/gpt-4o',
      { temperature: 0.7 }
    );

    const content = response.choices[0].message.content || "";
    
    // Extract title if it exists (assumes the first line is the title)
    const lines = content.split("\n");
    const title = lines[0].startsWith("#") ? lines[0].replace(/^#+ /, "") : undefined;
    
    // Extract bullet points if they exist
    const bulletRegex = /[-*] (.+)/g;
    const bullets = [...content.matchAll(bulletRegex)].map(match => match[1]);
    
    return {
      content,
      title,
      bullets: bullets.length > 0 ? bullets : undefined
    };
  } catch (error) {
    console.error("Text generation error:", error);
    throw new Error("Failed to generate text content");
  }
}

// Generate image content using Segmind
async function generateImageContent(
  request: MarketingContentRequest, 
  serviceId: SegmindServiceId = 'flux-pro'
): Promise<ImageContent> {
  try {
    // Apply campaign styles if requested
    let enhancedPrompt = request.purpose;
    if (request.useCampaignStyles && request.campaignId) {
      const campaignStyles = await getCampaignStyles(request.campaignId);
      enhancedPrompt += ` Using brand colors: ${campaignStyles.colors.join(", ")}. Brand style: ${campaignStyles.brandGuidelines || campaignStyles.tone}`;
    }
    
    if (request.additionalInstructions) {
      enhancedPrompt += `. ${request.additionalInstructions}`;
    }

    const segmindResponse = await segmindService.generateImage(serviceId, {
      prompt: enhancedPrompt,
      samples: request.quantity || 1,
      width: 1024,
      height: 1024
    });

    // Handle async response
    if (segmindResponse.status === 'QUEUED' || segmindResponse.status === 'IN_PROGRESS') {
      // In a real implementation, you'd poll for completion
      // For now, return placeholder
      return {
        url: "/images/generating-placeholder.jpg",
        prompt: enhancedPrompt,
        alt: `Marketing image for ${request.audience.industry || "business"} - ${request.purpose}`,
        service: serviceId
      };
    }

    return {
      url: segmindResponse.output as string || "/images/placeholder.jpg",
      prompt: enhancedPrompt,
      alt: `Marketing image for ${request.audience.industry || "business"} - ${request.purpose}`,
      service: serviceId
    };
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error("Failed to generate image content");
  }
}

// Generate video content using Segmind services
async function generateVideoContent(
  request: MarketingContentRequest,
  serviceId: SegmindServiceId = 'kling-video'
): Promise<VideoContent> {
  try {
    // Apply campaign styles if requested
    let enhancedPrompt = request.purpose;
    if (request.useCampaignStyles && request.campaignId) {
      const campaignStyles = await getCampaignStyles(request.campaignId);
      enhancedPrompt += ` Using brand colors: ${campaignStyles.colors.join(", ")}. Brand style: ${campaignStyles.brandGuidelines || campaignStyles.tone}`;
    }
    
    if (request.additionalInstructions) {
      enhancedPrompt += `. ${request.additionalInstructions}`;
    }

    // Determine video duration based on service capabilities
    const service = segmindService.getAvailableServices()[serviceId];
    const maxDuration = service && 'maxDuration' in service ? service.maxDuration : 5;
    const duration = Math.min(request.videoDuration || 5, maxDuration);

    const segmindResponse = await segmindService.generateVideo(serviceId, {
      prompt: enhancedPrompt,
      image_url: request.uploadedImage,
      duration: duration,
      aspect_ratio: '16:9'
    });

    // Handle async response
    if (segmindResponse.status === 'QUEUED' || segmindResponse.status === 'IN_PROGRESS') {
      // In a real implementation, you'd poll for completion
      return {
        url: "/videos/generating-placeholder.mp4",
        thumbnailUrl: "/images/generating-video-thumbnail.jpg", 
        title: `${request.audience.industry || "Business"} Marketing Video - ${request.purpose}`,
        description: `Marketing video with ${request.tone} tone generated using ${service?.name}`,
        service: serviceId,
        duration: duration
      };
    }

    return {
      url: segmindResponse.output as string || "/videos/placeholder.mp4",
      thumbnailUrl: "/images/video-thumbnail.jpg",
      title: `${request.audience.industry || "Business"} Marketing Video - ${request.purpose}`,
      description: `Marketing video with ${request.tone} tone generated using ${service?.name}`,
      service: serviceId,
      duration: duration
    };
  } catch (error) {
    console.error("Video generation error:", error);
    throw new Error("Failed to generate video content");
  }
}

// Campaign styles management
async function getCampaignStyles(campaignId: string): Promise<CampaignStyles> {
  // In a real implementation, this would fetch from database
  // For now, return default styles
  return {
    colors: ['#007bff', '#6c757d', '#28a745'],
    fonts: ['Arial', 'Helvetica'],
    tone: 'professional',
    brandGuidelines: 'Clean, modern design with focus on readability'
  };
}

export async function saveCampaignStyles(campaignId: string, styles: CampaignStyles): Promise<void> {
  // In a real implementation, this would save to database
  console.log(`Saving styles for campaign ${campaignId}:`, styles);
}