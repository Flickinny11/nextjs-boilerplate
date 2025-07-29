import { NextRequest, NextResponse } from 'next/server';
import { staticNewsSystem } from '../../../../../core/static_news_system';

export async function GET(request: NextRequest) {
  try {
    const broadcast = staticNewsSystem.getCurrentBroadcast();
    
    return NextResponse.json({
      success: true,
      data: {
        isLive: broadcast.isLive,
        currentShow: broadcast.currentShow,
        currentSlot: broadcast.currentSlot,
        anchor: broadcast.anchor,
        viewerCount: broadcast.viewerCount,
        emergencyOverride: broadcast.emergencyOverride,
        activeAlerts: broadcast.activeAlerts.length,
        onAirContent: broadcast.onAirContent.slice(0, 3) // Top 3 stories
      }
    });
  } catch (error) {
    console.error('Error getting live broadcast:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get broadcast information' },
      { status: 500 }
    );
  }
}