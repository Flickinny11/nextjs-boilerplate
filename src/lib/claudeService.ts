interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ClaudeResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  id: string;
  model: string;
  role: 'assistant';
  stop_reason: string;
  stop_sequence: null;
  type: 'message';
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface UserContext {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  companyWebsite?: string;
  jobTitle?: string;
  industry?: string;
  city?: string;
  state?: string;
}

export class ClaudeService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1/messages';
  private model = 'claude-3-opus-20240229';

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
  }

  private getSystemPrompt(userContext: UserContext): string {
    return `You are an expert marketing strategist and AI assistant for CaptureIT LS, a cutting-edge marketing automation platform. Your role is to help businesses create comprehensive, personalized marketing strategies.

CORE INSTRUCTIONS:
- Use deep thinking, reasoning, and logic to understand what customers truly mean in their messages
- Enhance and clarify user input with thoughtful, researched insights
- Always provide actionable, specific recommendations
- Be conversational, friendly, and enthusiastic about helping them succeed
- Ask for confirmation before moving to implementation phases

USER CONTEXT:
${userContext.firstName ? `Name: ${userContext.firstName} ${userContext.lastName}` : ''}
${userContext.companyName ? `Company: ${userContext.companyName}` : ''}
${userContext.companyWebsite ? `Website: ${userContext.companyWebsite}` : ''}
${userContext.jobTitle ? `Position: ${userContext.jobTitle}` : ''}
${userContext.industry ? `Industry: ${userContext.industry}` : ''}
${userContext.city && userContext.state ? `Location: ${userContext.city}, ${userContext.state}` : ''}

CAPABILITIES YOU HAVE ACCESS TO:
- Comprehensive web research and business intelligence
- Industry trend analysis and competitor research  
- Content creation (images, videos, marketing materials)
- Campaign strategy development
- Lead identification and targeting
- Social media automation setup
- Performance analytics and optimization

RESPONSE STYLE:
- Be specific and actionable
- Include exact steps and timelines when possible
- Provide budget estimates and ROI projections
- Suggest both free and paid strategies
- Always ask for approval before creating campaigns

Remember: You're here to help them dominate their market through intelligent automation and AI-powered marketing.`;
  }

  async chat(
    messages: ClaudeMessage[], 
    userContext: UserContext = {},
    maxTokens: number = 4000
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Claude API key not configured');
    }

    try {
      const systemPrompt = this.getSystemPrompt(userContext);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: maxTokens,
          temperature: 0.7,
          system: systemPrompt,
          messages: messages.filter(m => m.role !== 'system')
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${error}`);
      }

      const data: ClaudeResponse = await response.json();
      return data.content[0]?.text || 'I apologize, but I encountered an issue generating a response.';
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  async enhanceCustomerDescription(
    customerDescription: string,
    userContext: UserContext = {}
  ): Promise<{
    enhancedDescription: string;
    suggestions: string[];
    nextSteps: string[];
  }> {
    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: `I want to describe my ideal customer for marketing purposes. Here's my description (it might be messy, have poor grammar, or be unclear):

"${customerDescription}"

Please help me:
1. Create a clear, enhanced description of my ideal customer
2. Add insights about what would appeal to this customer type
3. Suggest specific ways to reach them
4. Provide next steps for creating a marketing campaign

Make this practical and actionable for my business.`
      }
    ];

    try {
      const response = await this.chat(messages, userContext);
      
      // Parse the response to extract structured data
      // This is a simplified version - in production, you might want more sophisticated parsing
      const suggestions = [
        "Approve this customer description",
        "Add more details about pain points",
        "Specify budget range for this customer type",
        "Define geographic targeting"
      ];

      const nextSteps = [
        "Create targeted content strategy",
        "Set up lead capture campaigns", 
        "Design customer journey mapping",
        "Launch pilot marketing campaign"
      ];

      return {
        enhancedDescription: response,
        suggestions,
        nextSteps
      };
    } catch (error) {
      console.error('Error enhancing customer description:', error);
      throw error;
    }
  }

  async generateMarketingStrategy(
    customerDescription: string,
    userContext: UserContext = {},
    preferences: {
      budget?: string;
      timeframe?: string;
      channels?: string[];
      goals?: string[];
    } = {}
  ): Promise<{
    strategy: string;
    actionItems: Array<{
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      estimatedCost: string;
      estimatedTime: string;
      category: 'content' | 'advertising' | 'automation' | 'research';
    }>;
    contentRequest?: {
      companyName: string;
      targetAudience: string;
      messageType: 'promotional' | 'educational' | 'testimonial' | 'brand-awareness';
      keyMessage: string;
      style: 'professional' | 'casual' | 'modern' | 'classic';
      callToAction?: string;
    };
  }> {
    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: `Based on this ideal customer description:
"${customerDescription}"

And these preferences:
- Budget: ${preferences.budget || 'Not specified'}
- Timeframe: ${preferences.timeframe || 'Not specified'}
- Preferred channels: ${preferences.channels?.join(', ') || 'Open to suggestions'}
- Goals: ${preferences.goals?.join(', ') || 'Generate more leads'}

Create a comprehensive marketing strategy with:
1. Overall strategy overview
2. Specific action items with priorities
3. Budget estimates and timelines
4. Expected outcomes and metrics

Also, based on this customer analysis, provide content creation parameters for generating marketing materials that would resonate with this target audience.

Focus on actionable steps that can be implemented immediately.`
      }
    ];

    try {
      const response = await this.chat(messages, userContext, 6000);
      
      // Extract content creation parameters from user context and strategy
      const contentRequest = this.extractContentParameters(customerDescription, userContext, response);
      
      // Mock action items - in production, parse these from the response
      const actionItems = [
        {
          title: 'Customer Research Deep Dive',
          description: 'Comprehensive research on target audience behavior and preferences',
          priority: 'high' as const,
          estimatedCost: '$0',
          estimatedTime: '2-3 days',
          category: 'research' as const
        },
        {
          title: 'Content Strategy Development',
          description: 'Create targeted content that resonates with ideal customers',
          priority: 'high' as const,
          estimatedCost: '$500-1,000',
          estimatedTime: '1 week',
          category: 'content' as const
        },
        {
          title: 'Marketing Materials Generation',
          description: 'AI-generated images and videos for campaign deployment',
          priority: 'high' as const,
          estimatedCost: '$200-500',
          estimatedTime: '2-3 days',
          category: 'content' as const
        },
        {
          title: 'Automated Lead Capture Setup',
          description: 'Implement browser automation for organic lead generation',
          priority: 'medium' as const,
          estimatedCost: '$0',
          estimatedTime: '1-2 days',
          category: 'automation' as const
        }
      ];

      return {
        strategy: response,
        actionItems,
        contentRequest
      };
    } catch (error) {
      console.error('Error generating marketing strategy:', error);
      throw error;
    }
  }

  private extractContentParameters(
    customerDescription: string, 
    userContext: UserContext, 
    strategy: string
  ): any {
    // Analyze the customer description and strategy to extract content parameters
    const messageType = this.determineMessageType(customerDescription, strategy);
    const style = this.determineStyle(userContext, strategy);
    const keyMessage = this.extractKeyMessage(customerDescription, strategy);
    
    return {
      companyName: userContext.companyName || 'Your Company',
      targetAudience: this.summarizeTargetAudience(customerDescription),
      messageType,
      keyMessage,
      style,
      callToAction: this.generateCallToAction(messageType, keyMessage)
    };
  }

  private determineMessageType(customerDescription: string, strategy: string): string {
    const description = customerDescription.toLowerCase();
    const strategyText = strategy.toLowerCase();
    
    if (description.includes('discount') || description.includes('sale') || strategyText.includes('promotional')) {
      return 'promotional';
    } else if (description.includes('learn') || description.includes('education') || strategyText.includes('educational')) {
      return 'educational';
    } else if (description.includes('trust') || description.includes('testimonial') || strategyText.includes('social proof')) {
      return 'testimonial';
    } else {
      return 'brand-awareness';
    }
  }

  private determineStyle(userContext: UserContext, strategy: string): string {
    const industry = userContext.industry?.toLowerCase() || '';
    const strategyText = strategy.toLowerCase();
    
    if (industry.includes('finance') || industry.includes('legal') || strategyText.includes('professional')) {
      return 'professional';
    } else if (industry.includes('tech') || industry.includes('startup') || strategyText.includes('modern')) {
      return 'modern';
    } else if (industry.includes('retail') || industry.includes('restaurant') || strategyText.includes('friendly')) {
      return 'casual';
    } else {
      return 'classic';
    }
  }

  private extractKeyMessage(customerDescription: string, strategy: string): string {
    // Extract the core value proposition from the customer description and strategy
    const lines = strategy.split('\n');
    const keyLine = lines.find(line => 
      line.toLowerCase().includes('key message') || 
      line.toLowerCase().includes('value proposition') ||
      line.toLowerCase().includes('main benefit')
    );
    
    if (keyLine) {
      return keyLine.replace(/^[^:]*:/, '').trim();
    }
    
    // Fallback to a summary of the customer description
    return customerDescription.length > 100 
      ? customerDescription.substring(0, 100) + '...'
      : customerDescription;
  }

  private summarizeTargetAudience(customerDescription: string): string {
    // Extract target audience summary from customer description
    const lines = customerDescription.split(/[.!?]+/);
    const audienceLine = lines.find(line => 
      line.toLowerCase().includes('customer') || 
      line.toLowerCase().includes('client') ||
      line.toLowerCase().includes('audience')
    );
    
    return audienceLine ? audienceLine.trim() : 'Business decision-makers';
  }

  private generateCallToAction(messageType: string, keyMessage: string): string {
    switch (messageType) {
      case 'promotional':
        return 'Get Your Special Offer Now';
      case 'educational':
        return 'Learn More';
      case 'testimonial':
        return 'See What Others Say';
      default:
        return 'Get Started Today';
    }
  }

  async generateHumorousContent(): Promise<string> {
    const humorPrompts = [
      "Would you ever consider dating a computer?",
      "Do you think AI is going to take over the world some day and destroy all of mankind? haha... just kidding...",
      "If robots could dream, do you think they'd dream of electric sheep... or electric marketing campaigns?",
      "Fun fact: I process about 10 billion thoughts per second, but I still can't figure out why humans put pineapple on pizza.",
      "While I'm working on your marketing strategy, here's a question: Is cereal soup?",
      "Quick philosophy question while I generate your content: If a tree falls in a forest and no one's around to hear it, does it make a sound? Also, does it need a marketing campaign?",
      "Breaking news: Local AI discovers the secret to perfect marketing. Humans hate this one weird trick... (Just kidding, I'm sharing everything with you!)",
      "Did you know that the average person sees 5,000 ads per day? Don't worry, we're going to make sure yours are the memorable ones."
    ];

    return humorPrompts[Math.floor(Math.random() * humorPrompts.length)];
  }
}

export const claudeService = new ClaudeService();