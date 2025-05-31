import { NextRequest, NextResponse } from 'next/server';

// Mock function to send approved request to business owner
async function notifyBusinessOwner(featureRequest: any) {
  // In a real implementation, this would send an email to the business owner
  console.log(`Sending approved feature request to business owner:`);
  console.log(`Request ID: ${featureRequest.id}`);
  console.log(`User: ${featureRequest.userEmail}`);
  console.log(`Description: ${featureRequest.description}`);
  console.log(`Manager Notes: ${featureRequest.managerNotes}`);
  
  // Here you would integrate with email service to send to business owner's email
  // Email template would include:
  // - User information and unique user ID
  // - Feature request description
  // - Manager's approval notes
  // - Request priority/urgency
  
  // Example email integration:
  // await emailService.send({
  //   to: 'business-owner@company.com', // This would be configured in environment
  //   subject: `Feature Request Approved - ${featureRequest.id}`,
  //   template: 'feature-request-approved',
  //   data: featureRequest
  // });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, action, managerNotes } = body;

    // Validate input
    if (!requestId || typeof requestId !== 'string') {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Authenticate the manager
    // 2. Verify manager has permission to approve this request
    // 3. Update the feature request in the database

    // Mock finding and updating the feature request
    const mockFeatureRequest = {
      id: requestId,
      userId: 'user_123',
      userEmail: 'user@example.com',
      description: 'Example feature request',
      status: action === 'approve' ? 'approved' : 'rejected',
      managerId: 'manager_001',
      managerNotes: managerNotes || '',
      approvedAt: action === 'approve' ? new Date() : undefined,
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    };

    // If approved, notify business owner
    if (action === 'approve') {
      await notifyBusinessOwner(mockFeatureRequest);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: mockFeatureRequest.id,
        status: mockFeatureRequest.status,
        updatedAt: new Date()
      },
      message: `Feature request ${action}d successfully`
    });

  } catch (error) {
    console.error('Feature request approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}