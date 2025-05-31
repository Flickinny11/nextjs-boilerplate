import { NextRequest, NextResponse } from 'next/server';

// Types for feature requests
interface FeatureRequest {
  id: string;
  userId: string;
  userEmail: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  createdAt: Date;
  managerId?: string;
  managerNotes?: string;
  approvedAt?: Date;
}

// In-memory storage for demonstration (replace with actual database)
let featureRequests: FeatureRequest[] = [];
let nextId = 1;

// Utility function to generate unique ID
function generateFeatureRequestId(): string {
  return `feature_req_${nextId++}_${Date.now()}`;
}

// Utility function to generate unique user ID (as mentioned in requirements)
function generateUserId(): string {
  return `user_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
}

// Mock function to get current user from auth context
// In a real implementation, this would extract user info from JWT token or session
function getCurrentUser(request: NextRequest) {
  // For now, we'll simulate a user - in real implementation, extract from auth headers
  return {
    id: generateUserId(),
    email: 'user@example.com', // This would come from the authenticated session
    managerId: 'manager_001' // This would be determined by user's organization
  };
}

// Mock function to notify manager
async function notifyManager(featureRequest: FeatureRequest) {
  // In a real implementation, this would send an email or push notification
  console.log(`Notifying manager ${featureRequest.managerId} about feature request: ${featureRequest.id}`);
  console.log(`Request: ${featureRequest.description}`);
  
  // Here you would integrate with email service (SendGrid, AWS SES, etc.)
  // or push notification service
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    // Validate input
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Feature description is required' },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        { error: 'Feature description is too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Get current user (in real implementation, from authentication)
    const currentUser = getCurrentUser(request);

    // Create feature request
    const featureRequest: FeatureRequest = {
      id: generateFeatureRequestId(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      description: description.trim(),
      status: 'pending',
      createdAt: new Date(),
      managerId: currentUser.managerId
    };

    // Store the request (in real implementation, save to database)
    featureRequests.push(featureRequest);

    // Notify manager
    await notifyManager(featureRequest);

    return NextResponse.json({
      success: true,
      data: {
        id: featureRequest.id,
        status: featureRequest.status,
        createdAt: featureRequest.createdAt
      }
    });

  } catch (error) {
    console.error('Feature request submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve feature requests (for manager console)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const managerId = url.searchParams.get('managerId');
    const status = url.searchParams.get('status');

    let filteredRequests = featureRequests;

    // Filter by manager ID if provided
    if (managerId) {
      filteredRequests = filteredRequests.filter(req => req.managerId === managerId);
    }

    // Filter by status if provided
    if (status) {
      filteredRequests = filteredRequests.filter(req => req.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filteredRequests,
      total: filteredRequests.length
    });

  } catch (error) {
    console.error('Feature request retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}