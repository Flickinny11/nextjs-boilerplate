import { NextRequest, NextResponse } from 'next/server';

// CaptureIT Messages API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'send':
        const { conversationId, content, type, attachments, senderId } = body;
        
        const message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conversationId,
          senderId,
          senderName: 'Current User',
          content,
          type: type || 'text',
          timestamp: new Date().toISOString(),
          reactions: [],
          attachments: attachments || [],
          status: {
            sent: true,
            delivered: true,
            read: false,
            encrypted: true
          },
          aiFeatures: {
            sentimentAnalysis: {
              score: Math.random() > 0.5 ? 0.7 : -0.3,
              label: Math.random() > 0.5 ? 'positive' : 'neutral',
              confidence: 0.85
            }
          }
        };

        return NextResponse.json({
          success: true,
          message,
          messageId: message.id
        });

      case 'create-conversation':
        const { type: conversationType, participants, name, settings } = body;
        
        const conversation = {
          id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: name || 'New Conversation',
          type: conversationType || 'direct',
          participants: participants.map((id: string) => ({
            userId: id,
            name: `User ${id}`,
            role: 'member',
            joinedAt: new Date().toISOString(),
            isOnline: Math.random() > 0.3
          })),
          messages: [],
          settings: {
            encryption: true,
            aiAssistant: true,
            autoTranslation: false,
            ...settings
          },
          metadata: {
            totalMessages: 0,
            totalParticipants: participants.length,
            lastBackup: new Date().toISOString()
          },
          lastActivity: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          status: 'active'
        };

        return NextResponse.json({
          success: true,
          conversation
        });

      case 'search':
        const { query, conversationId: searchConvId, filters } = body;
        
        // Mock search results
        const searchResults = [
          {
            message: {
              id: 'msg_123',
              content: `This message contains "${query}"`,
              timestamp: new Date().toISOString(),
              senderName: 'John Doe'
            },
            relevanceScore: 0.9,
            highlights: [query],
            context: []
          }
        ];

        return NextResponse.json({
          success: true,
          results: searchResults
        });

      case 'add-reaction':
        const { messageId, reaction } = body;
        
        return NextResponse.json({
          success: true,
          message: 'Reaction added successfully'
        });

      case 'schedule-message':
        const { conversationId: scheduleConvId, content: scheduleContent, scheduledFor } = body;
        
        const scheduleId = `schedule_${Date.now()}`;
        
        return NextResponse.json({
          success: true,
          scheduleId
        });

      case 'initiate-call':
        const { conversationId: callConvId, callType } = body;
        
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return NextResponse.json({
          success: true,
          roomId
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('CaptureIT Messages API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Get conversation details
      return NextResponse.json({
        success: true,
        conversation: {
          id: conversationId,
          name: 'Sample Conversation',
          messages: [],
          participants: []
        }
      });
    }

    if (userId) {
      // Get user's conversations
      const conversations = [
        {
          id: 'conv_1',
          name: 'General Chat',
          type: 'group',
          participants: [
            {
              userId: 'user_1',
              name: 'Alice Smith',
              isOnline: true,
              lastSeen: new Date().toISOString()
            },
            {
              userId: 'user_2', 
              name: 'Bob Johnson',
              isOnline: false,
              lastSeen: new Date(Date.now() - 3600000).toISOString()
            }
          ],
          messages: [
            {
              id: 'msg_1',
              content: 'Hello everyone!',
              senderId: 'user_1',
              senderName: 'Alice Smith',
              timestamp: new Date().toISOString(),
              type: 'text',
              reactions: [],
              attachments: []
            }
          ],
          settings: {
            encryption: true,
            aiAssistant: true
          },
          metadata: {
            totalMessages: 1,
            totalParticipants: 2
          },
          lastActivity: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: 'conv_2',
          name: 'Project Alpha',
          type: 'channel',
          participants: [
            {
              userId: 'user_3',
              name: 'Charlie Brown',
              isOnline: true,
              lastSeen: new Date().toISOString()
            }
          ],
          messages: [],
          settings: {
            encryption: true,
            aiAssistant: true
          },
          metadata: {
            totalMessages: 0,
            totalParticipants: 1
          },
          lastActivity: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          status: 'active'
        }
      ];

      return NextResponse.json({
        success: true,
        conversations
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Missing required parameters'
    }, { status: 400 });
  } catch (error) {
    console.error('CaptureIT Messages API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}