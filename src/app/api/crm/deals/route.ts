import { NextRequest, NextResponse } from 'next/server'
import { 
  CRMDeal, 
  CRMListResponse,
  CRMResponse,
  DealFilters,
  CreateDealRequest,
  CRMError
} from '@/lib/crmTypes'

// In-memory storage for demonstration (replace with actual database)
let deals: CRMDeal[] = []
let nextId = 1

// Utility function to generate UUID-like ID
function generateId(): string {
  return `deal_${nextId++}_${Date.now()}`
}

// Validation function
function validateDealData(data: any): { isValid: boolean; errors: CRMError[] } {
  const errors: CRMError[] = []

  if (!data.name || typeof data.name !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Deal name is required', field: 'name' })
  }

  if (!data.contactId || typeof data.contactId !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Contact ID is required', field: 'contactId' })
  }

  if (!data.value || typeof data.value !== 'number' || data.value <= 0) {
    errors.push({ code: 'INVALID_VALUE', message: 'Deal value must be a positive number', field: 'value' })
  }

  if (!data.stageId || typeof data.stageId !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Stage ID is required', field: 'stageId' })
  }

  if (!data.assignedTo || typeof data.assignedTo !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Assigned user is required', field: 'assignedTo' })
  }

  if (!data.expectedCloseDate) {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Expected close date is required', field: 'expectedCloseDate' })
  }

  return { isValid: errors.length === 0, errors }
}

// GET /api/crm/deals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const stageId = searchParams.get('stageId')
    const assignedTo = searchParams.get('assignedTo')
    const minValue = searchParams.get('minValue') ? parseFloat(searchParams.get('minValue')!) : undefined
    const maxValue = searchParams.get('maxValue') ? parseFloat(searchParams.get('maxValue')!) : undefined
    const dealSource = searchParams.get('dealSource')

    // Apply filters
    let filteredDeals = deals

    if (search) {
      const searchLower = search.toLowerCase()
      filteredDeals = filteredDeals.filter(deal => 
        deal.name.toLowerCase().includes(searchLower) ||
        deal.dealSource?.toLowerCase().includes(searchLower)
      )
    }

    if (stageId) {
      filteredDeals = filteredDeals.filter(deal => deal.stageId === stageId)
    }

    if (assignedTo) {
      filteredDeals = filteredDeals.filter(deal => deal.assignedTo === assignedTo)
    }

    if (minValue !== undefined) {
      filteredDeals = filteredDeals.filter(deal => deal.value >= minValue)
    }

    if (maxValue !== undefined) {
      filteredDeals = filteredDeals.filter(deal => deal.value <= maxValue)
    }

    if (dealSource) {
      filteredDeals = filteredDeals.filter(deal => deal.dealSource === dealSource)
    }

    // Pagination
    const total = filteredDeals.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedDeals = filteredDeals.slice(startIndex, endIndex)

    const response: CRMListResponse<CRMDeal> = {
      success: true,
      data: paginatedDeals,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

// POST /api/crm/deals
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the data
    const validation = validateDealData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          data: validation.errors 
        },
        { status: 400 }
      )
    }

    // Create new deal
    const now = new Date()
    const newDeal: CRMDeal = {
      id: generateId(),
      name: body.name,
      contactId: body.contactId,
      value: body.value,
      currency: body.currency || 'USD',
      stageId: body.stageId,
      probability: body.probability || 0,
      expectedCloseDate: new Date(body.expectedCloseDate),
      actualCloseDate: body.actualCloseDate ? new Date(body.actualCloseDate) : undefined,
      assignedTo: body.assignedTo,
      dealSource: body.dealSource || 'CRM',
      lostReason: body.lostReason,
      createdAt: now,
      updatedAt: now,
      createdBy: 'current-user' // TODO: Get from authentication
    }

    deals.push(newDeal)

    const response: CRMResponse<CRMDeal> = {
      success: true,
      data: newDeal,
      message: 'Deal created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}