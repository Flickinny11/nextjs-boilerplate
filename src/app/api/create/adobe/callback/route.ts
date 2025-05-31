import { NextRequest, NextResponse } from 'next/server';
import { adobeExpressService } from '@/lib/adobeExpressService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Adobe OAuth error:', error);
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
    const result = await adobeExpressService.handleOAuthCallback(code, state);

    if (result.success) {
      // Redirect to success page
      return NextResponse.redirect(
        new URL('/create/adobe?connected=true', request.url)
      );
    } else {
      console.error('Adobe OAuth callback error:', result.error);
      return NextResponse.redirect(
        new URL(`/create/setup?error=${encodeURIComponent(result.error || 'oauth_failed')}`, request.url)
      );
    }

  } catch (error) {
    console.error('Adobe OAuth callback error:', error);
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

      const result = await adobeExpressService.initiateOAuth(userId);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Adobe OAuth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}