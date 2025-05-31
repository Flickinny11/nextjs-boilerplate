import { NextRequest, NextResponse } from 'next/server';
import { segmindService } from '@/lib/segmindService';
import type { MarketingContentRequest } from '@/lib/segmindService';

export async function POST(request: NextRequest) {
  let contentRequest: MarketingContentRequest | null = null;
  
  try {
    contentRequest = await request.json();

    // Validate required fields
    if (!contentRequest?.companyName || !contentRequest?.targetAudience || !contentRequest?.keyMessage) {
      return NextResponse.json(
        { error: 'Company name, target audience, and key message are required' },
        { status: 400 }
      );
    }

    // Generate marketing content package
    const result = await segmindService.generateMarketingContent(contentRequest);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Content generation error:', error);
    
    // Check if it's a Segmind API key issue
    if (error.message?.includes('SEGMIND_API_KEY')) {
      return NextResponse.json({
        error: 'Content generation service not configured',
        mockData: {
          images: [
            {
              url: 'https://via.placeholder.com/1024x1024/6366f1/ffffff?text=Marketing+Image+1',
              prompt: `Professional marketing image for ${contentRequest?.companyName || 'Your Company'}`,
              style: 'existing-brand',
              type: 'social-post'
            },
            {
              url: 'https://via.placeholder.com/1024x1024/8b5cf6/ffffff?text=Marketing+Image+2', 
              prompt: `Corporate style marketing for ${contentRequest?.companyName || 'Your Company'}`,
              style: 'existing-brand',
              type: 'ad-banner'
            },
            {
              url: 'https://via.placeholder.com/1024x1024/ec4899/ffffff?text=AI+Optimized+1',
              prompt: `AI-optimized design for ${contentRequest?.companyName || 'Your Company'}`,
              style: 'ai-optimized',
              type: 'hero-image'
            },
            {
              url: 'https://via.placeholder.com/1024x1024/f59e0b/ffffff?text=AI+Optimized+2',
              prompt: `Innovative design for ${contentRequest?.companyName || 'Your Company'}`,
              style: 'ai-optimized', 
              type: 'product-showcase'
            }
          ],
          video: {
            url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            prompt: `Marketing video for ${contentRequest?.companyName || 'Your Company'}`,
            duration: 10,
            progress: 100
          },
          metadata: {
            generatedAt: new Date().toISOString(),
            totalItems: 5,
            processingTime: 2500
          }
        }
      });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}