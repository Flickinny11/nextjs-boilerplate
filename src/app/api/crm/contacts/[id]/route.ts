import { NextRequest, NextResponse } from 'next/server'
import { CRMContact, CRMResponse } from '@/lib/crmTypes'

// This would be replaced with actual database operations
// For now, we'll use the same in-memory storage reference
declare global {
  var crmContacts: CRMContact[]
}

if (!global.crmContacts) {
  global.crmContacts = []
}

// GET /api/crm/contacts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contact = global.crmContacts.find(c => c.id === params.id)
    
    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    const response: CRMResponse<CRMContact> = {
      success: true,
      data: contact
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

// PUT /api/crm/contacts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const contactIndex = global.crmContacts.findIndex(c => c.id === params.id)
    
    if (contactIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Update the contact
    const now = new Date()
    global.crmContacts[contactIndex] = {
      ...global.crmContacts[contactIndex],
      ...body,
      updatedAt: now
    }

    const response: CRMResponse<CRMContact> = {
      success: true,
      data: global.crmContacts[contactIndex],
      message: 'Contact updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE /api/crm/contacts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactIndex = global.crmContacts.findIndex(c => c.id === params.id)
    
    if (contactIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Remove the contact
    global.crmContacts.splice(contactIndex, 1)

    const response: CRMResponse = {
      success: true,
      message: 'Contact deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}