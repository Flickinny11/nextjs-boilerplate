import { NextRequest, NextResponse } from 'next/server';

// Mock user storage (in production, use database)
const users = new Map();
const userProfiles = new Map();

export async function POST(request: NextRequest) {
  try {
    const signupData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'city', 'state', 'zipCode', 
      'accountEmail', 'companyName', 'companyWebsite', 'jobTitle',
      'password', 'confirmPassword'
    ];
    
    const missingFields = requiredFields.filter(field => !signupData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.accountEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate website format
    const websiteRegex = /^https?:\/\/.+\..+/;
    if (!websiteRegex.test(signupData.companyWebsite)) {
      return NextResponse.json(
        { error: 'Invalid website format. Please include http:// or https://' },
        { status: 400 }
      );
    }

    // Validate password
    if (signupData.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (signupData.password !== signupData.confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(
      user => user.email === signupData.accountEmail
    );
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create user account (in production, hash password)
    const user = {
      id: userId,
      email: signupData.accountEmail,
      name: `${signupData.firstName} ${signupData.lastName}`,
      createdAt: new Date().toISOString(),
      tier: 'professional',
      status: 'active'
    };
    
    users.set(userId, user);

    // Store profile data separately
    const profile = {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      city: signupData.city,
      state: signupData.state,
      zipCode: signupData.zipCode,
      accountEmail: signupData.accountEmail,
      companyName: signupData.companyName,
      companyWebsite: signupData.companyWebsite,
      jobTitle: signupData.jobTitle,
      phone: '',
      industry: '',
      companySize: '',
      marketingBudget: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    userProfiles.set(userId, profile);

    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}