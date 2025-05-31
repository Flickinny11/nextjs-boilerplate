import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memoryService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');

    if (conversationId) {
      // Get specific conversation
      const conversation = await memoryService.getConversation(conversationId);
      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(conversation);
    } else if (userId) {
      // Get user's conversations
      const conversations = await memoryService.getUserConversations(userId);
      return NextResponse.json({ conversations });
    } else {
      return NextResponse.json(
        { error: 'Either conversationId or userId is required' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Memory retrieval error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve memory' },
      { status: 500 }
    );
  }
}