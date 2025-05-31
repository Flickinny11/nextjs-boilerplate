import { NextRequest, NextResponse } from 'next/server';

// Mock user profile storage (in production, use database)
const userProfiles = new Map();

export async function GET(request: NextRequest) {
  try {
    // In production, get user ID from authentication
    const userId = 'demo-user';
    
    const profile = userProfiles.get(userId) || {
      firstName: '',
      lastName: '',
      city: '',
      state: '',
      zipCode: '',
      accountEmail: '',
      companyName: '',
      companyWebsite: '',
      jobTitle: '',
      phone: '',
      industry: '',
      companySize: '',
      marketingBudget: ''
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile get error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve profile' },
      { status: 500 }
    );
  }
}