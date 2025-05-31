import { NextRequest, NextResponse } from 'next/server';
import { videoConferencingService } from '@/lib/videoConferencingService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL('/crm/settings?video_error=' + encodeURIComponent(error), request.url)
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/crm/settings?video_error=missing_parameters', request.url)
      );
    }

    // Handle OAuth callback
    const account = await videoConferencingService.handleOAuthCallback(code, state);
    
    // Close popup and redirect parent window
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Video Conferencing Connected</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            .icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              margin: 0 0 0.5rem 0;
              font-size: 1.5rem;
            }
            p {
              margin: 0;
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h1>Successfully Connected!</h1>
            <p>Your ${account.provider.name} account has been connected.</p>
            <p>You can close this window now.</p>
          </div>
          <script>
            // Store connection success in localStorage for parent window
            localStorage.setItem('videoConnectionSuccess', JSON.stringify({
              provider: '${account.provider.name}',
              email: '${account.email}',
              timestamp: Date.now()
            }));
            
            // Close popup after a short delay
            setTimeout(() => {
              window.close();
            }, 2000);
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Video OAuth callback error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.redirect(
      new URL('/crm/settings?video_error=' + encodeURIComponent(errorMessage), request.url)
    );
  }
}