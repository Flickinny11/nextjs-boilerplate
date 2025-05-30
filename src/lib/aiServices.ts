import { openRouterService, ChatMessage } from "./openRouterService"

// Types
export interface LeadCriteria {
  industry?: string
  experience?: string
  location?: string
  position?: string
  leadCount: number
  enrichData?: boolean
  importToCRM?: boolean
  additionalInfo?: {
    includeFamily?: boolean
    includeSocial?: boolean
    includeInterests?: boolean
  }
  territories?: Array<{
    id: string;
    center: { lat: number; lng: number };
    radius: number;
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  }>
  model?: string // OpenRouter model to use
}

export interface Lead {
  id: string
  name: string
  position: string
  company: string
  location: string
  email: string
  phone: string
  linkedin: string
  experience: string
  industry: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
  }
  familyInfo?: {
    spouse?: string
    children?: string[]
  }
  interests?: string[]
  lastUpdated: string
}

// AI Service Functions using OpenRouter
export async function captureLeads(criteria: LeadCriteria): Promise<Lead[]> {
  try {
    const model = criteria.model || 'openai/gpt-4o';
    
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are a professional lead generation assistant with web crawling and research capabilities. Generate realistic lead profiles based on the given criteria. Include social media, family info, and interests if requested. Return a JSON array of lead objects.`
      },
      {
        role: "user", 
        content: `Generate ${criteria.leadCount} detailed lead profiles matching these criteria: ${JSON.stringify(criteria)}`
      }
    ];

    // Add web crawling tools if available
    const tools = [
      {
        type: "function",
        function: {
          name: "web_search",
          description: "Search the web for lead information",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search query" },
              industry: { type: "string", description: "Industry to focus on" }
            },
            required: ["query"]
          }
        }
      }
    ];

    const response = await openRouterService.createChatCompletion(
      messages,
      model,
      { 
        temperature: 0.7,
        tools: tools,
        tool_choice: "auto"
      }
    );

    // Process and validate the response
    const content = response.choices[0].message.content || "[]";
    const leads = JSON.parse(content);
    
    // Enrich leads if requested
    if (criteria.enrichData) {
      return await Promise.all(leads.map((lead: Lead) => enrichLeadData(lead, model)));
    }
    
    return leads.slice(0, criteria.leadCount);
  } catch (error) {
    console.error("Lead capture error:", error);
    throw new Error("Failed to capture leads with OpenRouter AI services");
  }
}

// Enhanced web crawling function with OpenRouter
export async function enrichLeadData(lead: Lead, model: string = 'openai/gpt-4o'): Promise<Lead> {
  try {
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: "You are a lead enrichment specialist with web crawling capabilities. Enhance the provided lead data with additional information from public sources."
      },
      {
        role: "user",
        content: `Enrich this lead with additional data: ${JSON.stringify(lead)}`
      }
    ];

    const tools = [
      {
        type: "function",
        function: {
          name: "linkedin_search",
          description: "Search LinkedIn for professional information",
          parameters: {
            type: "object", 
            properties: {
              name: { type: "string" },
              company: { type: "string" }
            },
            required: ["name"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "company_research",
          description: "Research company information",
          parameters: {
            type: "object",
            properties: {
              company_name: { type: "string" },
              domain: { type: "string" }
            },
            required: ["company_name"]
          }
        }
      }
    ];

    const response = await openRouterService.createChatCompletion(
      messages,
      model,
      { 
        temperature: 0.3,
        tools: tools,
        tool_choice: "auto"
      }
    );

    const enrichedData = JSON.parse(response.choices[0].message.content || "{}");
    return { ...lead, ...enrichedData, lastUpdated: new Date().toISOString() };
  } catch (error) {
    console.error("Lead enrichment error:", error);
    return lead; // Return original lead if enrichment fails
  }
}
