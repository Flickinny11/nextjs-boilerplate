import { 
  CRMContact, 
  CRMDeal, 
  CRMActivity, 
  CRMPipeline, 
  CRMStage,
  CRMNote,
  CRMResponse,
  CRMListResponse,
  ContactFilters,
  DealFilters,
  ActivityFilters,
  CRMDashboardMetrics,
  PipelineAnalytics,
  CreateContactRequest,
  CreateDealRequest,
  CreateActivityRequest,
  UpdateContactRequest,
  UpdateDealRequest,
  UpdateActivityRequest
} from './crmTypes'

// Base URL for CRM API endpoints
const CRM_API_BASE = '/api/crm'

class CRMService {
  // Contact Management
  async getContacts(filters?: ContactFilters, page = 1, limit = 50): Promise<CRMListResponse<CRMContact>> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    })

    const response = await fetch(`${CRM_API_BASE}/contacts?${searchParams}`)
    return response.json()
  }

  async getContact(id: string): Promise<CRMResponse<CRMContact>> {
    const response = await fetch(`${CRM_API_BASE}/contacts/${id}`)
    return response.json()
  }

  async createContact(data: CreateContactRequest): Promise<CRMResponse<CRMContact>> {
    const response = await fetch(`${CRM_API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async updateContact(id: string, data: UpdateContactRequest): Promise<CRMResponse<CRMContact>> {
    const response = await fetch(`${CRM_API_BASE}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async deleteContact(id: string): Promise<CRMResponse> {
    const response = await fetch(`${CRM_API_BASE}/contacts/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }

  async convertContactToCustomer(id: string): Promise<CRMResponse<CRMContact>> {
    const response = await fetch(`${CRM_API_BASE}/contacts/${id}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    return response.json()
  }

  // Deal Management
  async getDeals(filters?: DealFilters, page = 1, limit = 50): Promise<CRMListResponse<CRMDeal>> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    })

    const response = await fetch(`${CRM_API_BASE}/deals?${searchParams}`)
    return response.json()
  }

  async getDeal(id: string): Promise<CRMResponse<CRMDeal>> {
    const response = await fetch(`${CRM_API_BASE}/deals/${id}`)
    return response.json()
  }

  async createDeal(data: CreateDealRequest): Promise<CRMResponse<CRMDeal>> {
    const response = await fetch(`${CRM_API_BASE}/deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async updateDeal(id: string, data: UpdateDealRequest): Promise<CRMResponse<CRMDeal>> {
    const response = await fetch(`${CRM_API_BASE}/deals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async deleteDeal(id: string): Promise<CRMResponse> {
    const response = await fetch(`${CRM_API_BASE}/deals/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }

  async moveDealToStage(dealId: string, stageId: string): Promise<CRMResponse<CRMDeal>> {
    const response = await fetch(`${CRM_API_BASE}/deals/${dealId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageId })
    })
    return response.json()
  }

  // Activity Management
  async getActivities(filters?: ActivityFilters, page = 1, limit = 50): Promise<CRMListResponse<CRMActivity>> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    })

    const response = await fetch(`${CRM_API_BASE}/activities?${searchParams}`)
    return response.json()
  }

  async getActivity(id: string): Promise<CRMResponse<CRMActivity>> {
    const response = await fetch(`${CRM_API_BASE}/activities/${id}`)
    return response.json()
  }

  async createActivity(data: CreateActivityRequest): Promise<CRMResponse<CRMActivity>> {
    const response = await fetch(`${CRM_API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async updateActivity(id: string, data: UpdateActivityRequest): Promise<CRMResponse<CRMActivity>> {
    const response = await fetch(`${CRM_API_BASE}/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async deleteActivity(id: string): Promise<CRMResponse> {
    const response = await fetch(`${CRM_API_BASE}/activities/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }

  async completeActivity(id: string): Promise<CRMResponse<CRMActivity>> {
    const response = await fetch(`${CRM_API_BASE}/activities/${id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    return response.json()
  }

  // Pipeline Management
  async getPipelines(): Promise<CRMResponse<CRMPipeline[]>> {
    const response = await fetch(`${CRM_API_BASE}/pipelines`)
    return response.json()
  }

  async getPipeline(id: string): Promise<CRMResponse<CRMPipeline>> {
    const response = await fetch(`${CRM_API_BASE}/pipelines/${id}`)
    return response.json()
  }

  async createPipeline(data: Partial<CRMPipeline>): Promise<CRMResponse<CRMPipeline>> {
    const response = await fetch(`${CRM_API_BASE}/pipelines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async updatePipeline(id: string, data: Partial<CRMPipeline>): Promise<CRMResponse<CRMPipeline>> {
    const response = await fetch(`${CRM_API_BASE}/pipelines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async deletePipeline(id: string): Promise<CRMResponse> {
    const response = await fetch(`${CRM_API_BASE}/pipelines/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }

  // Analytics and Reporting
  async getDashboardMetrics(): Promise<CRMResponse<CRMDashboardMetrics>> {
    const response = await fetch(`${CRM_API_BASE}/analytics/dashboard`)
    return response.json()
  }

  async getPipelineAnalytics(pipelineId?: string): Promise<CRMResponse<PipelineAnalytics[]>> {
    const url = pipelineId 
      ? `${CRM_API_BASE}/analytics/pipeline/${pipelineId}`
      : `${CRM_API_BASE}/analytics/pipeline`
    const response = await fetch(url)
    return response.json()
  }

  async getSalesReport(startDate: Date, endDate: Date): Promise<CRMResponse<any>> {
    const searchParams = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    })
    const response = await fetch(`${CRM_API_BASE}/analytics/sales?${searchParams}`)
    return response.json()
  }

  async getActivityReport(startDate: Date, endDate: Date): Promise<CRMResponse<any>> {
    const searchParams = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    })
    const response = await fetch(`${CRM_API_BASE}/analytics/activities?${searchParams}`)
    return response.json()
  }

  // Notes Management
  async addNote(contactId: string, content: string): Promise<CRMResponse<CRMNote>>
  async addNote(dealId: string, content: string, type: 'deal'): Promise<CRMResponse<CRMNote>>
  async addNote(entityId: string, content: string, type?: 'deal'): Promise<CRMResponse<CRMNote>> {
    const body = type === 'deal' 
      ? { dealId: entityId, content }
      : { contactId: entityId, content }
    
    const response = await fetch(`${CRM_API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return response.json()
  }

  async getNotes(contactId?: string, dealId?: string): Promise<CRMResponse<CRMNote[]>> {
    const searchParams = new URLSearchParams()
    if (contactId) searchParams.set('contactId', contactId)
    if (dealId) searchParams.set('dealId', dealId)
    
    const response = await fetch(`${CRM_API_BASE}/notes?${searchParams}`)
    return response.json()
  }

  // Search across all entities
  async globalSearch(query: string): Promise<CRMResponse<{
    contacts: CRMContact[]
    deals: CRMDeal[]
    activities: CRMActivity[]
  }>> {
    const response = await fetch(`${CRM_API_BASE}/search?q=${encodeURIComponent(query)}`)
    return response.json()
  }

  // Bulk operations
  async bulkUpdateContacts(contactIds: string[], updates: Partial<CRMContact>): Promise<CRMResponse<CRMContact[]>> {
    const response = await fetch(`${CRM_API_BASE}/contacts/bulk`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactIds, updates })
    })
    return response.json()
  }

  async bulkDeleteContacts(contactIds: string[]): Promise<CRMResponse> {
    const response = await fetch(`${CRM_API_BASE}/contacts/bulk`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactIds })
    })
    return response.json()
  }

  // Import/Export functionality
  async importContacts(data: CreateContactRequest[]): Promise<CRMResponse<{
    imported: number
    failed: number
    errors: any[]
  }>> {
    const response = await fetch(`${CRM_API_BASE}/contacts/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts: data })
    })
    return response.json()
  }

  async exportContacts(filters?: ContactFilters): Promise<CRMResponse<string>> {
    const searchParams = new URLSearchParams(
      filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    )
    const response = await fetch(`${CRM_API_BASE}/contacts/export?${searchParams}`)
    return response.json()
  }

  // Lead conversion utilities
  async convertLeadToContact(leadId: string): Promise<CRMResponse<CRMContact>> {
    return this.convertContactToCustomer(leadId)
  }

  // Integration with existing lead capture
  async syncLeadToCRM(lead: any): Promise<CRMResponse<CRMContact>> {
    const contactData: CreateContactRequest = {
      firstName: lead.name?.split(' ')[0] || 'Unknown',
      lastName: lead.name?.split(' ').slice(1).join(' ') || 'Lead',
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      position: lead.position,
      leadSource: lead.source || 'Lead Capture'
    }

    return this.createContact(contactData)
  }

  // Find contact by email for duplicate checking
  async findContactByEmail(email: string): Promise<CRMResponse<CRMContact | null>> {
    try {
      const response = await fetch(`${CRM_API_BASE}/contacts/find-by-email?email=${encodeURIComponent(email)}`)
      const result = await response.json()
      
      // If not found, return null data but success true
      if (response.status === 404) {
        return { success: true, data: null }
      }
      
      return result
    } catch (error) {
      console.error('Error finding contact by email:', error)
      return { 
        success: false, 
        error: 'Failed to search for existing contact',
        data: null 
      }
    }
  }
}

// Export singleton instance
export const crmService = new CRMService()

// Export utility functions
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getContactDisplayName(contact: CRMContact): string {
  return `${contact.firstName} ${contact.lastName}`.trim() || contact.email
}

export function getDealDisplayName(deal: CRMDeal): string {
  return deal.name || `Deal #${deal.id.slice(-6)}`
}

export function calculateDealProbability(stage: CRMStage): number {
  return stage.probability
}

export function isOverdue(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  return d < new Date()
}

export function getLeadStatusColor(status: CRMContact['leadStatus']): string {
  const colors = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    qualified: 'bg-green-500',
    converted: 'bg-purple-500',
    dead: 'bg-gray-500'
  }
  return colors[status] || colors.new
}

export function getPriorityColor(priority: CRMActivity['priority']): string {
  const colors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }
  return colors[priority] || colors.medium
}

export function getActivityIcon(type: CRMActivity['type']): string {
  const icons = {
    call: '📞',
    email: '📧',
    meeting: '🤝',
    task: '✅',
    note: '📝',
    demo: '🖥️'
  }
  return icons[type] || '📋'
}