import type { Lead } from './aiServices'

// CRM Types
export type CRMType = 'salesforce' | 'pipedrive' | 'hubspot'

export interface CRMConfig {
  type: CRMType
  apiKey: string
  baseUrl?: string
  additionalConfig?: Record<string, any>
}

export interface CRMResponse {
  success: boolean
  message: string
  data?: any
}

// CRM Integration Class
class CRMIntegration {
  private config: CRMConfig

  constructor(config: CRMConfig) {
    this.config = config
  }

  // Validate CRM credentials
  async validateCredentials(): Promise<boolean> {
    try {
      switch (this.config.type) {
        case 'salesforce':
          return await this.validateSalesforce()
        case 'pipedrive':
          return await this.validatePipedrive()
        case 'hubspot':
          return await this.validateHubspot()
        default:
          throw new Error('Unsupported CRM type')
      }
    } catch (error) {
      console.error('CRM validation error:', error)
      return false
    }
  }

  // Import leads to CRM
  async importLeads(leads: Lead[]): Promise<CRMResponse> {
    try {
      switch (this.config.type) {
        case 'salesforce':
          return await this.importToSalesforce(leads)
        case 'pipedrive':
          return await this.importToPipedrive(leads)
        case 'hubspot':
          return await this.importToHubspot(leads)
        default:
          throw new Error('Unsupported CRM type')
      }
    } catch (error) {
      console.error('CRM import error:', error)
      return {
        success: false,
        message: 'Failed to import leads to CRM',
      }
    }
  }

  // Check for duplicates in CRM
  async checkDuplicates(leads: Lead[]): Promise<Lead[]> {
    try {
      const duplicates = new Set<string>();

      switch (this.config.type) {
        case "salesforce": {
          // Query Salesforce for existing leads by email
          const emails = leads.map((lead) => lead.email).filter(Boolean);
          if (emails.length === 0) return leads;

          const query = `SELECT Email FROM Lead WHERE Email IN (${emails
            .map((email) => `'${email}'`)
            .join(",")})`;

          const response = await fetch(
            `${this.config.baseUrl}/services/data/v57.0/query?q=${encodeURIComponent(query)}`,
            {
              headers: {
                Authorization: `Bearer ${this.config.apiKey}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) break;

          const data = await response.json();
          data.records.forEach((record: any) => duplicates.add(record.Email));
          break;
        }
        case "pipedrive": {
          // Query Pipedrive for existing persons by email
          for (const lead of leads) {
            if (!lead.email) continue;
            const response = await fetch(
              `${this.config.baseUrl}/v1/persons/search?term=${encodeURIComponent(
                lead.email
              )}&fields=email&api_token=${this.config.apiKey}`
            );
            if (!response.ok) continue;
            const data = await response.json();
            if (data.data?.items?.length) {
              duplicates.add(lead.email);
            }
          }
          break;
        }
        case "hubspot": {
          // Query Hubspot for existing contacts by email
          for (const lead of leads) {
            if (!lead.email) continue;
            const response = await fetch(
              `https://api.hubapi.com/contacts/v1/contact/email/${encodeURIComponent(
                lead.email
              )}/profile?hapikey=${this.config.apiKey}`
            );
            if (response.ok) {
              duplicates.add(lead.email);
            }
          }
          break;
        }
      }

      return leads.filter((lead) => !duplicates.has(lead.email));
    } catch (error) {
      console.error("Duplicate check error:", error);
      return leads; // Return original leads if duplicate check fails
    }
  }

  // Salesforce specific methods
  private async validateSalesforce(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/services/data/v57.0/`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  private async importToSalesforce(leads: Lead[]): Promise<CRMResponse> {
    try {
      // Transform leads to Salesforce format
      const salesforceLeads = leads.map(lead => ({
        FirstName: lead.name.split(' ')[0],
        LastName: lead.name.split(' ').slice(1).join(' '),
        Company: lead.company,
        Title: lead.position,
        Email: lead.email,
        Phone: lead.phone,
        Industry: lead.industry,
      }))

      // Batch import to Salesforce
      const response = await fetch(`${this.config.baseUrl}/services/data/v57.0/composite/sobjects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: salesforceLeads,
          allOrNone: false,
        }),
      })

      const result = await response.json()
      return {
        success: response.ok,
        message: response.ok ? 'Leads imported successfully' : 'Failed to import leads',
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import leads to Salesforce',
      }
    }
  }

  // Pipedrive specific methods
  private async validatePipedrive(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/users/me?api_token=${this.config.apiKey}`)
      return response.ok
    } catch (error) {
      return false
    }
  }

  private async importToPipedrive(leads: Lead[]): Promise<CRMResponse> {
    try {
      const responses = await Promise.all(
        leads.map(lead =>
          fetch(`${this.config.baseUrl}/v1/persons?api_token=${this.config.apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: lead.name,
              email: [{ value: lead.email, primary: true }],
              phone: [{ value: lead.phone, primary: true }],
              org_id: null, // Will be filled after organization is created
            }),
          })
        )
      )

      const success = responses.every(r => r.ok)
      return {
        success,
        message: success ? 'Leads imported successfully' : 'Some leads failed to import',
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import leads to Pipedrive',
      }
    }
  }

  // Hubspot specific methods
  private async validateHubspot(): Promise<boolean> {
    try {
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  private async importToHubspot(leads: Lead[]): Promise<CRMResponse> {
    try {
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: leads.map(lead => ({
            properties: {
              firstname: lead.name.split(' ')[0],
              lastname: lead.name.split(' ').slice(1).join(' '),
              email: lead.email,
              phone: lead.phone,
              company: lead.company,
              jobtitle: lead.position,
              industry: lead.industry,
            },
          })),
        }),
      })

      return {
        success: response.ok,
        message: response.ok ? 'Leads imported successfully' : 'Failed to import leads',
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import leads to Hubspot',
      }
    }
  }
}

// Export a function to create new CRM integration instances
export function createCRMIntegration(config: CRMConfig): CRMIntegration {
  return new CRMIntegration(config)
}
