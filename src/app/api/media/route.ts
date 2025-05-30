import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateMarketingContent } from "@/lib/marketingServices";
import { paymentService } from "@/lib/paymentServices";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    const body = await request.json();

    // Validate required fields
    const { contentType, purpose, tone, audience } = body;
    if (!contentType || !purpose || !tone) {
      return NextResponse.json(
        { error: "contentType, purpose, and tone are required" },
        { status: 400 }
      );
    }

    // Check if user has enough credits
    const creditsRequired = contentType === 'video' ? 50 : contentType === 'image' ? 20 : 10;
    const hasCredits = await paymentService.hasEnoughCredits(userId, creditsRequired);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits for this operation" },
        { status: 402 }
      );
    }

    // Generate the content
    const content = await generateMarketingContent(body);

    // Deduct credits
    await paymentService.deductCredits(userId, creditsRequired);

    return NextResponse.json({
      success: true,
      content,
      creditsUsed: creditsRequired
    });

  } catch (error) {
    console.error("Media generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate media content" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return available media generation options
    return NextResponse.json({
      contentTypes: ['text', 'image', 'video'],
      videoServices: {
        'minimax-video-01': { name: 'Minimax Video 01 Live', maxDuration: 6 },
        'minimax-video-director': { name: 'Minimax AI Director Video', maxDuration: 10 },
        'kling-video': { name: 'Kling Video (Newest)', maxDuration: 5 },
        'minimax-tryon': { name: 'Minimax Try-On', maxDuration: 4, supportsTryOn: true }
      },
      imageServices: {
        'flux-pro': { name: 'FLUX Pro', quality: 'high' },
        'sdxl': { name: 'Stable Diffusion XL', quality: 'standard' }
      }
    });
  } catch (error) {
    console.error("Error fetching media options:", error);
    return NextResponse.json(
      { error: "Failed to fetch media options" },
      { status: 500 }
    );
  }
}