import { NextRequest, NextResponse } from 'next/server'
import { CRMDeal, CRMResponse } from '@/lib/crmTypes'

// This would be replaced with actual database operations
// For now, we'll use the same in-memory storage reference
declare global {
  var crmDeals: CRMDeal[]
}

if (!global.crmDeals) {
  global.crmDeals = []
}

// GET /api/crm/deals/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deal = global.crmDeals.find(d => d.id === params.id)
    
    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    const response: CRMResponse<CRMDeal> = {
      success: true,
      data: deal
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

// PUT /api/crm/deals/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const dealIndex = global.crmDeals.findIndex(d => d.id === params.id)
    
    if (dealIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Update the deal
    const now = new Date()
    global.crmDeals[dealIndex] = {
      ...global.crmDeals[dealIndex],
      ...body,
      updatedAt: now
    }

    const response: CRMResponse<CRMDeal> = {
      success: true,
      data: global.crmDeals[dealIndex],
      message: 'Deal updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update deal' },
      { status: 500 }
    )
  }
}

// DELETE /api/crm/deals/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealIndex = global.crmDeals.findIndex(d => d.id === params.id)
    
    if (dealIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Remove the deal
    global.crmDeals.splice(dealIndex, 1)

    const response: CRMResponse = {
      success: true,
      message: 'Deal deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}