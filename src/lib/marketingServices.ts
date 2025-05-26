import OpenAI from "openai";
import { Anthropic } from "@anthropic-ai/sdk";
import { Lead } from "./aiServices";

// Initialize AI APIs
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
}

export interface VideoContent {
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
}

export type MarketingContent = TextContent | ImageContent | VideoContent;

// Chat and brainstorming
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getMarketingStrategy(
  messages: ChatMessage[],
  leads: Lead[] = []
): Promise<string> {
  try {
    // Prepare the conversation context with lead information if available
    let systemPrompt = "You are a marketing strategy expert helping create effective campaigns for leads.";
    
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

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
      ],
      temperature: 0.7,
      stream: false,
    });

    return response.choices[0].message.content || "No strategy could be generated.";
  } catch (error) {
    console.error("Marketing strategy generation error:", error);
    throw new Error("Failed to generate marketing strategy");
  }
}

// Generate marketing content
export async function generateMarketingContent(
  request: MarketingContentRequest
): Promise<MarketingContent> {
  try {
    switch (request.contentType) {
      case "text":
        return await generateTextContent(request);
      case "image":
        return await generateImageContent(request);
      case "video":
        return await generateVideoContent(request);
      default:
        throw new Error(`Unsupported content type: ${request.contentType}`);
    }
  } catch (error) {
    console.error("Content generation error:", error);
    throw new Error(`Failed to generate ${request.contentType} content`);
  }
}

// Generate text content (blog posts, email copy, social media posts)
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
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "You are a professional copywriter specializing in marketing content creation." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

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

// Generate image content
async function generateImageContent(request: MarketingContentRequest): Promise<ImageContent> {
  try {
    // Create a detailed prompt for the image generation
    let imagePrompt = `Create a marketing image for ${request.audience.industry || "general"} industry with a ${request.tone} tone.`;
    imagePrompt += `\nPurpose: ${request.purpose}`;
    
    if (request.additionalInstructions) {
      imagePrompt += `\nStyle details: ${request.additionalInstructions}`;
    }

    // Generate an image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
    });

    return {
      url: response.data[0].url || "",
      prompt: imagePrompt,
      alt: `Marketing image for ${request.audience.industry || "business"} - ${request.purpose}`
    };
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error("Failed to generate image content");
  }
}

// Generate video content (placeholder implementation)
async function generateVideoContent(request: MarketingContentRequest): Promise<VideoContent> {
  // In a real implementation, this would connect to a video generation service
  // For now, we'll return a placeholder with instructions
  
  try {
    // Generate a script for the video
    let scriptPrompt = `Create a script for a marketing video for ${request.audience.industry || "general"} industry with a ${request.tone} tone.`;
    scriptPrompt += `\nPurpose: ${request.purpose}`;
    scriptPrompt += `\nLength: ${request.length || "30 seconds"}`;
    
    if (request.additionalInstructions) {
      scriptPrompt += `\nAdditional instructions: ${request.additionalInstructions}`;
    }
    
    const scriptResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "You are a professional video script writer specializing in marketing videos." 
        },
        { role: "user", content: scriptPrompt }
      ],
      temperature: 0.7,
    });
    
    const script = scriptResponse.choices[0].message.content || "";
    
    // For demo purposes, return placeholder data
    // In a real implementation, this would send the script to a video generation service
    return {
      url: "/videos/placeholder-marketing-video.mp4",
      thumbnailUrl: "/images/placeholder-video-thumbnail.jpg",
      title: `${request.audience.industry || "Business"} Marketing Video - ${request.purpose}`,
      description: `Marketing video with ${request.tone} tone. Script: ${script.substring(0, 100)}...`
    };
  } catch (error) {
    console.error("Video generation error:", error);
    throw new Error("Failed to generate video content");
  }
}