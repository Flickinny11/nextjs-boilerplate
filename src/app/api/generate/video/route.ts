import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { billingRoutingService } from "@/lib/billingRouting";
import { paymentService } from "@/lib/paymentServices";
import type { UserTier } from "@/lib/tierModelConfig";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    const userTier = (request.headers.get('x-user-tier') || 'entry') as UserTier;
    const body = await request.json();
    
    const { 
      prompt, 
      service = 'runway-gen4', // default to Runway Gen-4
      options = {} 
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Check if user's tier allows video generation
    if (userTier === 'entry' || userTier === 'professional') {
      return NextResponse.json(
        { 
          error: "Video generation is only available for Business and Premium tiers. Please upgrade.",
          upgradeRequired: true,
          minimumTier: 'business'
        },
        { status: 403 }
      );
    }

    try {
      // Execute video generation with billing routing
      const result = await billingRoutingService.executeVideoGeneration(
        userId,
        prompt,
        service,
        userTier,
        options
      );

      return NextResponse.json({
        success: true,
        result,
        service,
        billingInfo: {
          usedUserApiKey: result.usedUserApiKey || false,
          creditsDeducted: result.creditsDeducted || 0
        }
      });

    } catch (error: any) {
      console.error("Video generation error:", error);
      
      if (error.message.includes('Insufficient credits')) {
        const userCredits = await paymentService.getCreditBalance(userId);
        return NextResponse.json(
          { 
            error: "Insufficient credits for video generation",
            required: error.required || 400,
            available: userCredits.available,
            upgradeNeeded: true
          },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Failed to generate video" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Video generation API error:", error);
    return NextResponse.json(
      { error: "Failed to process video generation request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userTier = (request.headers.get('x-user-tier') || 'entry') as UserTier;
    
    // Return available video generation services based on tier
    const availableServices = {
      entry: [],
      professional: [],
      business: ['runway-gen4-turbo', 'luma-dream-machine', 'pika-labs'],
      premium: [
        'runway-gen4', 
        'runway-gen4-turbo', 
        'luma-dream-machine', 
        'pika-labs', 
        'genmo', 
        'invideo-ai', 
        'synthesia'
      ] // Premium users get all services + can add their own
    };

    const serviceDescriptions = {
      'runway-gen4': 'Latest Runway Gen-4 (2025) - Highest quality',
      'runway-gen4-turbo': 'Runway Gen-4 Turbo (2025) - Faster generation',
      'luma-dream-machine': 'Luma Labs Dream Machine - Realistic videos',
      'pika-labs': 'Pika Labs - Creative video generation',
      'genmo': 'Genmo - AI-powered video creation',
      'invideo-ai': 'InVideo AI - Automated video editing',
      'synthesia': 'Synthesia - AI avatar videos'
    };

    return NextResponse.json({ 
      services: availableServices[userTier],
      serviceDescriptions,
      userTier,
      note: userTier === 'premium' 
        ? 'Premium users get access to all 2025 video services and can add custom API keys'
        : userTier === 'business'
        ? 'Business tier includes essential video generation services'
        : 'Video generation requires Business tier or higher'
    });
  } catch (error) {
    console.error("Error fetching video services:", error);
    return NextResponse.json(
      { error: "Failed to fetch available services" },
      { status: 500 }
    );
  }
}