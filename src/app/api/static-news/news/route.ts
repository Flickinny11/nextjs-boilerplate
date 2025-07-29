import { NextRequest, NextResponse } from 'next/server';
import { staticNewsSystem } from '../../../../../core/static_news_system';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    let news;
    
    if (type === 'breaking') {
      news = await staticNewsSystem.getBreakingNews();
    } else {
      news = await staticNewsSystem.getLatestNews(limit);
    }

    return NextResponse.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error getting news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get news' },
      { status: 500 }
    );
  }
}