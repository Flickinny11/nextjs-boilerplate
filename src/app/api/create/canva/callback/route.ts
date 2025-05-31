import { NextRequest, NextResponse } from 'next/server';
import { canvaIntegrationService } from '@/lib/canvaIntegrationService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Canva OAuth error:', error);
      return NextResponse.redirect(
        new URL('/create/setup?error=oauth_denied', request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/create/setup?error=missing_params', request.url)
      );
    }

    // Handle OAuth callback
    const result = await canvaIntegrationService.handleOAuthCallback(code, state);

    if (result.success) {
      // Redirect to success page
      return NextResponse.redirect(
        new URL('/create/canva?connected=true', request.url)
      );
    } else {
      console.error('Canva OAuth callback error:', result.error);
      return NextResponse.redirect(
        new URL(`/create/setup?error=${encodeURIComponent(result.error || 'oauth_failed')}`, request.url)
      );
    }

  } catch (error) {
    console.error('Canva OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/create/setup?error=server_error', request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId } = body;

    if (action === 'initiate') {
      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: 400 }
        );
      }

      const result = await canvaIntegrationService.initiateOAuth(userId);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Canva OAuth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}