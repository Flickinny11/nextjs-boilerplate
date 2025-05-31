import { NextRequest, NextResponse } from 'next/server';
import { claudeService } from '@/lib/claudeService';
import { researchService } from '@/lib/researchService';
import { memoryService } from '@/lib/memoryService';

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId, userContext } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get conversation context if available
    let contextualPrompt = '';
    if (conversationId) {
      contextualPrompt = await memoryService.getContextForNewMessage(conversationId);
    }

    // Add context to the system if available
    const contextualMessages = contextualPrompt 
      ? [{ role: 'system' as const, content: contextualPrompt }, ...messages]
      : messages;

    // Generate response using Claude
    const response = await claudeService.chat(contextualMessages, userContext);

    // Save message to memory if conversation exists
    if (conversationId) {
      const userMessage = messages[messages.length - 1];
      const assistantMessage = {
        role: 'assistant' as const,
        content: response
      };

      await memoryService.addMessage(conversationId, userMessage);
      await memoryService.addMessage(conversationId, assistantMessage);
    }

    return NextResponse.json({ 
      response,
      conversationId,
      memoryUsage: conversationId ? memoryService.getMemoryUsage(conversationId) : null
    });
  } catch (error: any) {
    console.error('Claude chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}