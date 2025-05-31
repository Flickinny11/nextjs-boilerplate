import { NextRequest, NextResponse } from 'next/server';
import { segmindService } from '@/lib/segmindService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const progress = await segmindService.getVideoProgress(jobId);

    return NextResponse.json(progress);
  } catch (error: any) {
    console.error('Progress check error:', error);
    
    return NextResponse.json({
      progress: 0,
      status: 'FAILED',
      error: error.message || 'Failed to check progress'
    });
  }
}