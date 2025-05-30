// CRM Core Types and Interfaces

export interface CRMContact {
  id: string
  type: 'lead' | 'contact' | 'customer'
  
  // Basic Information
  firstName: string
  lastName: string
  email: string
  phone?: string
  mobilePhone?: string
  
  // Company Information
  company?: string
  position?: string
  industry?: string
  website?: string
  
  // Address Information
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  
  // CRM Specific
  leadSource: string
  leadStatus: 'new' | 'contacted' | 'qualified' | 'converted' | 'dead'
  leadScore: number
  assignedTo?: string
  
  // Tracking
  lastActivity?: Date
  nextFollowUp?: Date
  tags: string[]
  
  // Integration
  externalIds: Record<string, string> // External CRM IDs
  
  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface CRMDeal {
  id: string
  name: string
  contactId: string
  
  // Deal Information
  value: number
  currency: string
  stageId: string
  probability: number
  expectedCloseDate: Date
  actualCloseDate?: Date
  
  // Tracking
  assignedTo: string
  dealSource: string
  lostReason?: string
  
  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface CRMActivity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'demo'
  
  // Basic Information
  subject: string
  description?: string
  
  // Relationships
  contactId?: string
  dealId?: string
  
  // Scheduling
  scheduledAt?: Date
  completedAt?: Date
  duration?: number // minutes
  
  // Status
  status: 'scheduled' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  
  // Assignment
  assignedTo: string
  participants: string[]
  
  // Integration
  meetingLink?: string
  emailId?: string
  
  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface CRMPipeline {
  id: string
  name: string
  stages: CRMStage[]
  isDefault: boolean
  
  // Configuration
  dealRotting: number // days
  autoAdvancement: boolean
  
  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface CRMStage {
  id: string
  name: string
  order: number
  probability: number
  rotting: boolean
  color: string
  pipelineId: string
}

export interface CRMNote {
  id: string
  content: string
  contactId?: string
  dealId?: string
  
  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface CRMProduct {
  id: string
  name: string
  price: number
  currency: string
  description?: string
  
  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

// API Response Types
export interface CRMResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CRMListResponse<T> extends CRMResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter and Query Types
export interface ContactFilters {
  search?: string
  type?: CRMContact['type']
  leadStatus?: CRMContact['leadStatus']
  assignedTo?: string
  tags?: string[]
  leadSource?: string
  industry?: string
  createdAfter?: Date
  createdBefore?: Date
}

export interface DealFilters {
  search?: string
  stageId?: string
  assignedTo?: string
  minValue?: number
  maxValue?: number
  expectedCloseAfter?: Date
  expectedCloseBefore?: Date
  dealSource?: string
}

export interface ActivityFilters {
  search?: string
  type?: CRMActivity['type']
  status?: CRMActivity['status']
  assignedTo?: string
  contactId?: string
  dealId?: string
  scheduledAfter?: Date
  scheduledBefore?: Date
  priority?: CRMActivity['priority']
}

// Analytics Types
export interface CRMDashboardMetrics {
  contacts: {
    total: number
    new: number
    qualified: number
    converted: number
  }
  deals: {
    total: number
    totalValue: number
    averageValue: number
    closedWon: number
    closedLost: number
    inProgress: number
  }
  activities: {
    total: number
    completed: number
    overdue: number
    upcoming: number
  }
  performance: {
    conversionRate: number
    avgSalesCycle: number
    winRate: number
    avgDealSize: number
  }
}

export interface PipelineAnalytics {
  pipelineId: string
  pipelineName: string
  stages: Array<{
    stageId: string
    stageName: string
    dealCount: number
    totalValue: number
    avgTimeInStage: number
    conversionRate: number
  }>
  totalValue: number
  weightedValue: number
  forecastValue: number
}

// Form Types
export interface CreateContactRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  position?: string
  leadSource: string
  assignedTo?: string
}

export interface CreateDealRequest {
  name: string
  contactId: string
  value: number
  currency?: string
  stageId: string
  expectedCloseDate: Date
  assignedTo: string
  dealSource?: string
}

export interface CreateActivityRequest {
  type: CRMActivity['type']
  subject: string
  description?: string
  contactId?: string
  dealId?: string
  scheduledAt?: Date
  duration?: number
  priority?: CRMActivity['priority']
  assignedTo: string
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {
  leadStatus?: CRMContact['leadStatus']
  leadScore?: number
  tags?: string[]
  nextFollowUp?: Date
}

export interface UpdateDealRequest extends Partial<CreateDealRequest> {
  probability?: number
  lostReason?: string
  actualCloseDate?: Date
}

export interface UpdateActivityRequest extends Partial<CreateActivityRequest> {
  status?: CRMActivity['status']
  completedAt?: Date
}

// Utility Types
export type CRMEntityType = 'contact' | 'deal' | 'activity' | 'pipeline' | 'stage'

export interface CRMError {
  code: string
  message: string
  field?: string
}

export interface CRMValidationResult {
  isValid: boolean
  errors: CRMError[]
}

// Event Types for Real-time Updates
export interface CRMEvent {
  type: 'contact_created' | 'contact_updated' | 'deal_created' | 'deal_updated' | 'deal_moved' | 'activity_created' | 'activity_completed'
  entityId: string
  entityType: CRMEntityType
  data: any
  userId: string
  timestamp: Date
}

// Integration Types
export interface CRMConfig {
  type: 'salesforce' | 'pipedrive' | 'hubspot'
  apiKey: string
  baseUrl?: string
  additionalConfig?: Record<string, any>
}

export interface CRMIntegrationConfig extends CRMConfig {
  syncEnabled: boolean
  syncDirection: 'import' | 'export' | 'bidirectional'
  fieldMapping: Record<string, string>
  lastSyncAt?: Date
}

// Import from existing aiServices to maintain compatibility
export type { Lead } from './aiServices'