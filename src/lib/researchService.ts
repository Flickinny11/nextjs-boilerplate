interface CompanyResearch {
  companyName: string;
  website: string;
  logo?: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  keyPersonnel?: Array<{
    name: string;
    title: string;
    linkedin?: string;
  }>;
  recentNews?: Array<{
    title: string;
    url: string;
    date: string;
    summary: string;
  }>;
}

interface IndustryResearch {
  industry: string;
  marketSize?: string;
  growthRate?: string;
  trends: string[];
  challenges: string[];
  opportunities: string[];
  keyPlayers: string[];
  targetCustomers: string[];
}

interface CompetitorAnalysis {
  competitor: string;
  website?: string;
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  pricing?: string;
  customerBase?: string;
  marketingStrategy?: string[];
  keyPersonnel?: Array<{
    name: string;
    title: string;
    background?: string;
    connections?: string[];
  }>;
}

interface LeadResearch {
  name: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  linkedinProfile?: string;
  emailEstimate?: string;
  phoneEstimate?: string;
  interests?: string[];
  connections?: string[];
  recentActivity?: string[];
  leadScore: number;
  reasoning: string;
}

export class ResearchService {
  private searchApiKey: string;
  private searchEngineId: string;

  constructor() {
    this.searchApiKey = process.env.GOOGLE_SEARCH_API_KEY || '';
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || '';
  }

  async searchWeb(query: string, numResults: number = 10): Promise<any[]> {
    if (!this.searchApiKey || !this.searchEngineId) {
      console.warn('Google Search API not configured, using mock data');
      return this.getMockSearchResults(query);
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${this.searchApiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&num=${numResults}`
      );

      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Web search error:', error);
      return this.getMockSearchResults(query);
    }
  }

  private getMockSearchResults(query: string): any[] {
    // Mock search results for development
    return [
      {
        title: `${query} - Industry Overview`,
        link: 'https://example.com/industry-overview',
        snippet: `Comprehensive overview of ${query} industry trends and market analysis.`
      },
      {
        title: `Top Companies in ${query}`,
        link: 'https://example.com/top-companies',
        snippet: `Leading companies and market players in the ${query} sector.`
      },
      {
        title: `${query} Market Research Report`,
        link: 'https://example.com/market-report',
        snippet: `Latest market research and growth projections for ${query}.`
      }
    ];
  }

  async researchCompany(companyName: string, website?: string): Promise<CompanyResearch> {
    try {
      // Search for company information
      const searchQueries = [
        `"${companyName}" company info`,
        `"${companyName}" about leadership team`,
        `"${companyName}" news recent`,
        `"${companyName}" linkedin company page`
      ];

      const searchResults = await Promise.all(
        searchQueries.map(query => this.searchWeb(query, 5))
      );

      // Extract logo from website (simplified - in production, use web scraping)
      let logo = undefined;
      if (website) {
        try {
          // Mock logo extraction - in production, scrape the website
          logo = `${website}/logo.png`;
        } catch (error) {
          console.error('Logo extraction error:', error);
        }
      }

      // Process search results to extract company information
      const research: CompanyResearch = {
        companyName,
        website: website || '',
        logo,
        description: this.extractCompanyDescription(searchResults[0]),
        industry: this.extractIndustry(searchResults[0]),
        size: this.extractCompanySize(searchResults[0]),
        location: this.extractLocation(searchResults[0]),
        socialMedia: this.extractSocialMedia(searchResults[3]),
        keyPersonnel: this.extractKeyPersonnel(searchResults[1]),
        recentNews: this.extractRecentNews(searchResults[2])
      };

      return research;
    } catch (error) {
      console.error('Company research error:', error);
      return this.getMockCompanyResearch(companyName, website);
    }
  }

  async researchIndustry(industry: string, location?: string): Promise<IndustryResearch> {
    try {
      const searchQueries = [
        `"${industry}" industry market size trends 2024`,
        `"${industry}" industry challenges opportunities`,
        `"${industry}" market leaders competitors`,
        `"${industry}" target customers demographics ${location || ''}`
      ];

      const searchResults = await Promise.all(
        searchQueries.map(query => this.searchWeb(query, 5))
      );

      const research: IndustryResearch = {
        industry,
        marketSize: this.extractMarketSize(searchResults[0]),
        growthRate: this.extractGrowthRate(searchResults[0]),
        trends: this.extractTrends(searchResults[0]),
        challenges: this.extractChallenges(searchResults[1]),
        opportunities: this.extractOpportunities(searchResults[1]),
        keyPlayers: this.extractKeyPlayers(searchResults[2]),
        targetCustomers: this.extractTargetCustomers(searchResults[3])
      };

      return research;
    } catch (error) {
      console.error('Industry research error:', error);
      return this.getMockIndustryResearch(industry);
    }
  }

  async analyzeCompetitors(industry: string, location?: string, companySize?: string): Promise<CompetitorAnalysis[]> {
    try {
      const searchQuery = `"${industry}" companies ${location || ''} competitors market leaders`;
      const searchResults = await this.searchWeb(searchQuery, 10);

      // Extract competitor information
      const competitors = this.extractCompetitorList(searchResults);
      
      const analyses = await Promise.all(
        competitors.slice(0, 5).map(async (competitor) => {
          const competitorResearch = await this.researchCompany(competitor);
          return this.analyzeCompetitor(competitor, competitorResearch);
        })
      );

      return analyses;
    } catch (error) {
      console.error('Competitor analysis error:', error);
      return this.getMockCompetitorAnalysis(industry);
    }
  }

  async findPotentialLeads(
    industry: string, 
    jobTitles: string[], 
    location?: string,
    companySize?: string
  ): Promise<LeadResearch[]> {
    try {
      const searchQueries = jobTitles.map(title => 
        `"${title}" "${industry}" ${location || ''} linkedin contact`
      );

      const searchResults = await Promise.all(
        searchQueries.map(query => this.searchWeb(query, 5))
      );

      const leads: LeadResearch[] = [];
      
      searchResults.forEach((results, index) => {
        const extractedLeads = this.extractLeadsFromSearch(results, jobTitles[index], industry);
        leads.push(...extractedLeads);
      });

      // Score and rank leads
      return leads
        .map(lead => ({
          ...lead,
          leadScore: this.calculateLeadScore(lead)
        }))
        .sort((a, b) => b.leadScore - a.leadScore)
        .slice(0, 20); // Top 20 leads
    } catch (error) {
      console.error('Lead research error:', error);
      return this.getMockLeadResearch(industry, jobTitles);
    }
  }

  // Extraction methods (simplified for demo - in production, use more sophisticated parsing)
  private extractCompanyDescription(searchResults: any[]): string {
    return "Leading company in the industry with focus on innovation and customer service.";
  }

  private extractIndustry(searchResults: any[]): string {
    return "Business Services";
  }

  private extractCompanySize(searchResults: any[]): string {
    return "50-200 employees";
  }

  private extractLocation(searchResults: any[]): string {
    return "United States";
  }

  private extractSocialMedia(searchResults: any[]): any {
    return {
      linkedin: "https://linkedin.com/company/example",
      twitter: "https://twitter.com/example"
    };
  }

  private extractKeyPersonnel(searchResults: any[]): any[] {
    return [
      { name: "John Smith", title: "CEO", linkedin: "https://linkedin.com/in/johnsmith" },
      { name: "Jane Doe", title: "VP Sales", linkedin: "https://linkedin.com/in/janedoe" }
    ];
  }

  private extractRecentNews(searchResults: any[]): any[] {
    return [
      {
        title: "Company Announces New Partnership",
        url: "https://example.com/news1",
        date: "2024-01-15",
        summary: "Strategic partnership to expand market reach"
      }
    ];
  }

  private extractMarketSize(searchResults: any[]): string {
    return "$2.5B";
  }

  private extractGrowthRate(searchResults: any[]): string {
    return "8.5% annually";
  }

  private extractTrends(searchResults: any[]): string[] {
    return ["Digital transformation", "Sustainability focus", "Remote work adaptation"];
  }

  private extractChallenges(searchResults: any[]): string[] {
    return ["Increased competition", "Economic uncertainty", "Talent shortage"];
  }

  private extractOpportunities(searchResults: any[]): string[] {
    return ["Emerging markets", "Technology adoption", "Consolidation opportunities"];
  }

  private extractKeyPlayers(searchResults: any[]): string[] {
    return ["Company A", "Company B", "Company C"];
  }

  private extractTargetCustomers(searchResults: any[]): string[] {
    return ["Large enterprises", "Mid-market companies", "Government agencies"];
  }

  private extractCompetitorList(searchResults: any[]): string[] {
    return ["Competitor 1", "Competitor 2", "Competitor 3"];
  }

  private analyzeCompetitor(competitor: string, research: CompanyResearch): CompetitorAnalysis {
    return {
      competitor,
      website: research.website,
      strengths: ["Strong brand recognition", "Established customer base"],
      weaknesses: ["Limited digital presence", "Outdated technology"],
      marketPosition: "Market leader",
      pricing: "Premium pricing strategy",
      customerBase: "Enterprise clients",
      marketingStrategy: ["Content marketing", "Trade shows", "Partnership channel"],
      keyPersonnel: research.keyPersonnel?.map(person => ({
        name: person.name,
        title: person.title,
        background: "Industry veteran",
        connections: ["Industry associations", "Key customers"]
      }))
    };
  }

  private extractLeadsFromSearch(searchResults: any[], jobTitle: string, industry: string): LeadResearch[] {
    return [
      {
        name: "Alex Johnson",
        title: jobTitle,
        company: "Sample Company",
        industry,
        location: "New York, NY",
        linkedinProfile: "https://linkedin.com/in/alexjohnson",
        emailEstimate: "alex.johnson@samplecompany.com",
        interests: ["Innovation", "Digital transformation"],
        connections: ["Industry leaders", "Technology vendors"],
        recentActivity: ["Posted about industry trends", "Attended tech conference"],
        leadScore: 0,
        reasoning: "High-potential lead based on title and recent activity"
      }
    ];
  }

  private calculateLeadScore(lead: LeadResearch): number {
    let score = 50; // Base score

    // Title relevance
    if (lead.title.toLowerCase().includes('director') || lead.title.toLowerCase().includes('manager')) {
      score += 20;
    }
    if (lead.title.toLowerCase().includes('vp') || lead.title.toLowerCase().includes('president')) {
      score += 30;
    }

    // Activity level
    if (lead.recentActivity && lead.recentActivity.length > 2) {
      score += 15;
    }

    // LinkedIn presence
    if (lead.linkedinProfile) {
      score += 10;
    }

    // Connections
    if (lead.connections && lead.connections.length > 3) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  // Mock data methods for development
  private getMockCompanyResearch(companyName: string, website?: string): CompanyResearch {
    return {
      companyName,
      website: website || `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      logo: `https://logo.clearbit.com/${website?.replace('https://', '').replace('http://', '') || 'example.com'}`,
      description: `${companyName} is a leading company in their industry, focused on delivering exceptional value to customers through innovative solutions.`,
      industry: "Business Services",
      size: "100-500 employees",
      location: "United States",
      socialMedia: {
        linkedin: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        twitter: `https://twitter.com/${companyName.toLowerCase().replace(/\s+/g, '')}`
      },
      keyPersonnel: [
        { name: "Sarah Wilson", title: "CEO", linkedin: "https://linkedin.com/in/sarahwilson" },
        { name: "Michael Chen", title: "VP of Sales", linkedin: "https://linkedin.com/in/michaelchen" }
      ],
      recentNews: [
        {
          title: `${companyName} Expands Operations`,
          url: "https://example.com/news",
          date: new Date().toISOString().split('T')[0],
          summary: "Company announces expansion plans and new service offerings"
        }
      ]
    };
  }

  private getMockIndustryResearch(industry: string): IndustryResearch {
    return {
      industry,
      marketSize: "$12.5B",
      growthRate: "7.2% annually",
      trends: [
        "Digital transformation acceleration",
        "Increased focus on sustainability",
        "Remote work technology adoption",
        "AI and automation integration"
      ],
      challenges: [
        "Supply chain disruptions",
        "Talent acquisition difficulties",
        "Regulatory compliance complexity",
        "Cybersecurity threats"
      ],
      opportunities: [
        "Emerging market expansion",
        "Technology modernization",
        "Strategic partnerships",
        "Customer experience enhancement"
      ],
      keyPlayers: [
        "Market Leader Corp",
        "Innovation Inc",
        "Global Solutions Ltd",
        "TechForward Systems"
      ],
      targetCustomers: [
        "Enterprise businesses (500+ employees)",
        "Mid-market companies (50-500 employees)",
        "Government agencies",
        "Healthcare organizations"
      ]
    };
  }

  private getMockCompetitorAnalysis(industry: string): CompetitorAnalysis[] {
    return [
      {
        competitor: "Major Competitor Inc",
        website: "https://majorcompetitor.com",
        strengths: [
          "Strong brand recognition",
          "Established customer relationships",
          "Comprehensive service portfolio"
        ],
        weaknesses: [
          "Outdated technology platform",
          "Limited digital marketing presence",
          "Slow adoption of new trends"
        ],
        marketPosition: "Market leader with 25% market share",
        pricing: "Premium pricing with enterprise focus",
        customerBase: "Large enterprise clients, government contracts",
        marketingStrategy: [
          "Trade show presence",
          "Content marketing",
          "Direct sales approach",
          "Partner channel programs"
        ],
        keyPersonnel: [
          {
            name: "Robert Thompson",
            title: "CEO",
            background: "20+ years industry experience",
            connections: ["Industry board positions", "Key customer executives"]
          }
        ]
      }
    ];
  }

  private getMockLeadResearch(industry: string, jobTitles: string[]): LeadResearch[] {
    return [
      {
        name: "Jennifer Martinez",
        title: jobTitles[0] || "Director of Operations",
        company: "Prospective Client Corp",
        industry,
        location: "Chicago, IL",
        linkedinProfile: "https://linkedin.com/in/jennifermartinez",
        emailEstimate: "j.martinez@prospectiveclient.com",
        phoneEstimate: "(555) 123-4567",
        interests: ["Operational efficiency", "Technology integration", "Team development"],
        connections: ["Industry association members", "Technology vendors", "Consulting firms"],
        recentActivity: [
          "Shared article about industry automation",
          "Attended virtual conference on efficiency",
          "Posted about team achievements"
        ],
        leadScore: 85,
        reasoning: "High-value prospect based on decision-making authority, recent industry engagement, and company size alignment"
      }
    ];
  }
}

export const researchService = new ResearchService();