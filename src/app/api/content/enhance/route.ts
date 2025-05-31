import { NextRequest, NextResponse } from 'next/server';
import { segmindService } from '@/lib/segmindService';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, operation = 'upscale' } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    let enhancedUrl: string;
    
    switch (operation) {
      case 'upscale':
        enhancedUrl = await segmindService.enhanceImage(imageUrl);
        break;
      case 'remove-bg':
        enhancedUrl = await segmindService.removeBackground(imageUrl);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    return NextResponse.json({
      originalUrl: imageUrl,
      enhancedUrl,
      operation,
      success: true
    });
  } catch (error: any) {
    console.error('Image enhancement error:', error);
    
    // Fallback to original image if enhancement fails
    const fallbackUrl = '';
    return NextResponse.json({
      originalUrl: fallbackUrl,
      enhancedUrl: fallbackUrl,
      operation: 'upscale',
      success: false,
      error: error.message || 'Enhancement failed'
    });
  }
}