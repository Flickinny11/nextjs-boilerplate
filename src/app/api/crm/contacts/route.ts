import { NextRequest, NextResponse } from 'next/server'
import { 
  CRMContact, 
  CRMListResponse,
  CRMResponse,
  ContactFilters,
  CreateContactRequest,
  CRMError
} from '@/lib/crmTypes'

// In-memory storage for demonstration (replace with actual database)
let contacts: CRMContact[] = []
let nextId = 1

// Utility function to generate UUID-like ID
function generateId(): string {
  return `contact_${nextId++}_${Date.now()}`
}

// Validation function
function validateContactData(data: any): { isValid: boolean; errors: CRMError[] } {
  const errors: CRMError[] = []

  if (!data.firstName || typeof data.firstName !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'First name is required', field: 'firstName' })
  }

  if (!data.lastName || typeof data.lastName !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Last name is required', field: 'lastName' })
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Email is required', field: 'email' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ code: 'INVALID_FORMAT', message: 'Invalid email format', field: 'email' })
  }

  if (!data.leadSource || typeof data.leadSource !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Lead source is required', field: 'leadSource' })
  }

  return { isValid: errors.length === 0, errors }
}

// GET /api/crm/contacts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') as CRMContact['type'] | null
    const leadStatus = searchParams.get('leadStatus') as CRMContact['leadStatus'] | null
    const assignedTo = searchParams.get('assignedTo')
    const leadSource = searchParams.get('leadSource')
    const industry = searchParams.get('industry')

    // Apply filters
    let filteredContacts = contacts

    if (search) {
      const searchLower = search.toLowerCase()
      filteredContacts = filteredContacts.filter(contact => 
        contact.firstName.toLowerCase().includes(searchLower) ||
        contact.lastName.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.company?.toLowerCase().includes(searchLower)
      )
    }

    if (type) {
      filteredContacts = filteredContacts.filter(contact => contact.type === type)
    }

    if (leadStatus) {
      filteredContacts = filteredContacts.filter(contact => contact.leadStatus === leadStatus)
    }

    if (assignedTo) {
      filteredContacts = filteredContacts.filter(contact => contact.assignedTo === assignedTo)
    }

    if (leadSource) {
      filteredContacts = filteredContacts.filter(contact => contact.leadSource === leadSource)
    }

    if (industry) {
      filteredContacts = filteredContacts.filter(contact => contact.industry === industry)
    }

    // Pagination
    const total = filteredContacts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex)

    const response: CRMListResponse<CRMContact> = {
      success: true,
      data: paginatedContacts,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// POST /api/crm/contacts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the data
    const validation = validateContactData(body)
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

    // Check for duplicate email
    const existingContact = contacts.find(c => c.email === body.email)
    if (existingContact) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contact with this email already exists' 
        },
        { status: 409 }
      )
    }

    // Create new contact
    const now = new Date()
    const newContact: CRMContact = {
      id: generateId(),
      type: 'lead',
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      mobilePhone: body.mobilePhone,
      company: body.company,
      position: body.position,
      industry: body.industry,
      website: body.website,
      street: body.street,
      city: body.city,
      state: body.state,
      postalCode: body.postalCode,
      country: body.country,
      leadSource: body.leadSource,
      leadStatus: 'new',
      leadScore: 0,
      assignedTo: body.assignedTo,
      lastActivity: now,
      nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : undefined,
      tags: body.tags || [],
      externalIds: {},
      createdAt: now,
      updatedAt: now,
      createdBy: 'current-user' // TODO: Get from authentication
    }

    contacts.push(newContact)

    const response: CRMResponse<CRMContact> = {
      success: true,
      data: newContact,
      message: 'Contact created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}