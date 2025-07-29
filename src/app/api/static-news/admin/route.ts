import { NextRequest, NextResponse } from 'next/server';
import { staticNewsSystem } from '../../../../../core/static_news_system';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        const status = staticNewsSystem.getStatus();
        return NextResponse.json({ success: true, data: status });

      case 'health':
        const health = staticNewsSystem.getSystemHealth();
        return NextResponse.json({ success: true, data: health });

      case 'revenue':
        const hours = parseInt(searchParams.get('hours') || '24');
        const revenue = staticNewsSystem.getRevenueReport(hours);
        return NextResponse.json({ success: true, data: revenue });

      case 'export':
        const format = searchParams.get('format') as 'json' | 'csv' || 'json';
        const analytics = staticNewsSystem.exportAnalytics(format);
        
        if (format === 'csv') {
          return new NextResponse(analytics, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename="static-news-analytics.csv"'
            }
          });
        } else {
          return new NextResponse(analytics, {
            headers: {
              'Content-Type': 'application/json',
              'Content-Disposition': 'attachment; filename="static-news-analytics.json"'
            }
          });
        }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in admin GET:', error);
    return NextResponse.json(
      { success: false, error: 'Admin operation failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    switch (action) {
      case 'emergency':
        staticNewsSystem.setEmergencyMode(params.enabled);
        return NextResponse.json({
          success: true,
          message: `Emergency mode ${params.enabled ? 'enabled' : 'disabled'}`
        });

      case 'test-alert':
        staticNewsSystem.createTestAlert(params.level);
        return NextResponse.json({
          success: true,
          message: 'Test alert created'
        });

      case 'test-breakdown':
        const result = staticNewsSystem.triggerBreakdown(params.anchorId, 'admin-test');
        return NextResponse.json({
          success: true,
          data: result,
          message: 'Test breakdown triggered'
        });

      case 'notification':
        staticNewsSystem.sendCustomNotification(
          params.title,
          params.body,
          params.category
        );
        return NextResponse.json({
          success: true,
          message: 'Custom notification sent'
        });

      case 'restart':
        staticNewsSystem.restart();
        return NextResponse.json({
          success: true,
          message: 'System restart initiated'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in admin POST:', error);
    return NextResponse.json(
      { success: false, error: 'Admin operation failed' },
      { status: 500 }
    );
  }
}