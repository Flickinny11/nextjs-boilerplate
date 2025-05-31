import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memoryService';

export async function POST(request: NextRequest) {
  try {
    const { userId, title, userContext } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const conversationId = await memoryService.createConversation(
      userId,
      title || 'Marketing Strategy Session',
      userContext
    );

    return NextResponse.json({
      conversationId,
      success: true
    });
  } catch (error: any) {
    console.error('Memory creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create conversation memory' },
      { status: 500 }
    );
  }
}