import { NextRequest, NextResponse } from 'next/server';
import { staticNewsSystem } from '../../../../../core/static_news_system';

export async function GET(request: NextRequest) {
  try {
    const analytics = staticNewsSystem.getAnalyticsSummary();
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}