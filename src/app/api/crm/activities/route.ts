import { NextRequest, NextResponse } from 'next/server'
import { 
  CRMActivity, 
  CRMListResponse,
  CRMResponse,
  ActivityFilters,
  CreateActivityRequest,
  CRMError
} from '@/lib/crmTypes'

// In-memory storage for demonstration (replace with actual database)
let activities: CRMActivity[] = []
let nextId = 1

// Utility function to generate UUID-like ID
function generateId(): string {
  return `activity_${nextId++}_${Date.now()}`
}

// Validation function
function validateActivityData(data: any): { isValid: boolean; errors: CRMError[] } {
  const errors: CRMError[] = []

  if (!data.type || typeof data.type !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Activity type is required', field: 'type' })
  }

  if (!data.subject || typeof data.subject !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Subject is required', field: 'subject' })
  }

  if (!data.assignedTo || typeof data.assignedTo !== 'string') {
    errors.push({ code: 'REQUIRED_FIELD', message: 'Assigned user is required', field: 'assignedTo' })
  }

  return { isValid: errors.length === 0, errors }
}

// GET /api/crm/activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') as CRMActivity['type'] | null
    const status = searchParams.get('status') as CRMActivity['status'] | null
    const assignedTo = searchParams.get('assignedTo')
    const contactId = searchParams.get('contactId')
    const dealId = searchParams.get('dealId')
    const priority = searchParams.get('priority') as CRMActivity['priority'] | null

    // Apply filters
    let filteredActivities = activities

    if (search) {
      const searchLower = search.toLowerCase()
      filteredActivities = filteredActivities.filter(activity => 
        activity.subject.toLowerCase().includes(searchLower) ||
        activity.description?.toLowerCase().includes(searchLower)
      )
    }

    if (type) {
      filteredActivities = filteredActivities.filter(activity => activity.type === type)
    }

    if (status) {
      filteredActivities = filteredActivities.filter(activity => activity.status === status)
    }

    if (assignedTo) {
      filteredActivities = filteredActivities.filter(activity => activity.assignedTo === assignedTo)
    }

    if (contactId) {
      filteredActivities = filteredActivities.filter(activity => activity.contactId === contactId)
    }

    if (dealId) {
      filteredActivities = filteredActivities.filter(activity => activity.dealId === dealId)
    }

    if (priority) {
      filteredActivities = filteredActivities.filter(activity => activity.priority === priority)
    }

    // Sort by scheduled date (most recent first)
    filteredActivities.sort((a, b) => {
      const dateA = a.scheduledAt || a.createdAt
      const dateB = b.scheduledAt || b.createdAt
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })

    // Pagination
    const total = filteredActivities.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedActivities = filteredActivities.slice(startIndex, endIndex)

    const response: CRMListResponse<CRMActivity> = {
      success: true,
      data: paginatedActivities,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

// POST /api/crm/activities
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the data
    const validation = validateActivityData(body)
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

    // Create new activity
    const now = new Date()
    const newActivity: CRMActivity = {
      id: generateId(),
      type: body.type,
      subject: body.subject,
      description: body.description,
      contactId: body.contactId,
      dealId: body.dealId,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      completedAt: body.completedAt ? new Date(body.completedAt) : undefined,
      duration: body.duration,
      status: body.status || 'scheduled',
      priority: body.priority || 'medium',
      assignedTo: body.assignedTo,
      participants: body.participants || [],
      meetingLink: body.meetingLink,
      emailId: body.emailId,
      createdAt: now,
      updatedAt: now,
      createdBy: 'current-user' // TODO: Get from authentication
    }

    activities.push(newActivity)

    const response: CRMResponse<CRMActivity> = {
      success: true,
      data: newActivity,
      message: 'Activity created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}