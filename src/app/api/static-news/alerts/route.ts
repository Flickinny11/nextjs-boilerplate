import { NextRequest, NextResponse } from 'next/server';
import { staticNewsSystem } from '../../../../../core/static_news_system';

export async function GET(request: NextRequest) {
  try {
    const alerts = staticNewsSystem.getActiveAlerts();
    
    return NextResponse.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error getting alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { level } = await request.json();
    
    staticNewsSystem.createTestAlert(level);
    
    return NextResponse.json({
      success: true,
      message: 'Test alert created'
    });
  } catch (error) {
    console.error('Error creating test alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test alert' },
      { status: 500 }
    );
  }
}