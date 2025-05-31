import { NextRequest, NextResponse } from 'next/server';

// Mock user profile storage (in production, use database)
const userProfiles = new Map();

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();
    
    // In production, get user ID from authentication
    const userId = 'demo-user';
    
    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'city', 'state', 'zipCode', 
      'accountEmail', 'companyName', 'companyWebsite', 'jobTitle'
    ];
    
    const missingFields = requiredFields.filter(field => !profileData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.accountEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Store profile (in production, save to database)
    userProfiles.set(userId, {
      ...profileData,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}