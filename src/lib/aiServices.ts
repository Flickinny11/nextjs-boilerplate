import OpenAI from "openai"
import { Anthropic } from "@anthropic-ai/sdk"

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

// Initialize AI APIs
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// AI Service Functions
export async function captureLeadsWithGPT4(criteria: LeadCriteria): Promise<Lead[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional lead generation assistant. Generate detailed lead profiles based on the given criteria."
        },
        {
          role: "user",
          content: `Find leads matching these criteria: ${JSON.stringify(criteria)}`
        }
      ],
      temperature: 0.7,
    })

    // Process and validate the response
    const leads = JSON.parse(response.choices[0].message.content || "[]")
    return leads
  } catch (error) {
    console.error("GPT-4 API Error:", error)
    throw new Error("Failed to capture leads with GPT-4")
  }
}

export async function captureLeadsWithClaude(criteria: LeadCriteria): Promise<Lead[]> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `Generate detailed lead profiles matching these criteria: ${JSON.stringify(criteria)}`
      }],
      system: "You are a professional lead generation assistant. Generate detailed lead profiles based on the given criteria."
    })

    // Process and validate the response
    if (!response.content[0] || typeof response.content[0] !== 'object') {
      throw new Error("Invalid response format from Claude")
    }
    
    const content = 'text' in response.content[0] 
      ? response.content[0].text 
      : JSON.stringify(response.content[0])
      
    const leads = JSON.parse(content)
    return leads
  } catch (error) {
    console.error("Claude API Error:", error)
    throw new Error("Failed to capture leads with Claude")
  }
}

// Main lead capture function with fallback strategy
export async function captureLeads(criteria: LeadCriteria): Promise<Lead[]> {
  try {
    // Try GPT-4 first
    const gptLeads = await captureLeadsWithGPT4(criteria)
    if (gptLeads.length >= criteria.leadCount) {
      return gptLeads
    }

    // If GPT-4 doesn't return enough leads, try Claude
    const claudeLeads = await captureLeadsWithClaude(criteria)
    
    // Merge and deduplicate leads
    const allLeads = [...gptLeads, ...claudeLeads]
    const uniqueLeads = deduplicateLeads(allLeads)
    
    return uniqueLeads.slice(0, criteria.leadCount)
  } catch (error) {
    console.error("Lead capture error:", error)
    throw new Error("Failed to capture leads with AI services")
  }
}

// Utility function to deduplicate leads
function deduplicateLeads(leads: Lead[]): Lead[] {
  const seen = new Set()
  return leads.filter(lead => {
    const key = `${lead.name}-${lead.company}-${lead.email}`.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Web crawling function (to be implemented with proper web scraping library)
export async function enrichLeadData(lead: Lead): Promise<Lead> {
  try {
    // Placeholder for real web crawling enrichment implementation
    // Puppeteer or other scraping libraries should be installed and configured in the environment
    // For now, return lead as is
    return lead;
  } catch (error) {
    console.error("Lead enrichment error:", error);
    return lead; // Return original lead if enrichment fails
  }
}
