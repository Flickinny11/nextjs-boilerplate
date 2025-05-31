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
      service = 'dalle', // default to DALL-E
      options = {} 
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Check if user's tier allows image generation
    if (userTier === 'entry') {
      return NextResponse.json(
        { 
          error: "Image generation is not available for Entry tier. Please upgrade to Professional or higher.",
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    try {
      // Execute image generation with billing routing
      const result = await billingRoutingService.executeImageGeneration(
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
      console.error("Image generation error:", error);
      
      if (error.message.includes('Insufficient credits')) {
        const userCredits = await paymentService.getCreditBalance(userId);
        return NextResponse.json(
          { 
            error: "Insufficient credits for image generation",
            required: error.required || 50,
            available: userCredits.available,
            upgradeNeeded: true
          },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Failed to generate image" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Image generation API error:", error);
    return NextResponse.json(
      { error: "Failed to process image generation request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userTier = (request.headers.get('x-user-tier') || 'entry') as UserTier;
    
    // Return available image generation services based on tier
    const availableServices = {
      entry: [],
      professional: ['dalle', 'stability'],
      business: ['dalle', 'stability', 'leonardo', 'midjourney'],
      premium: ['dalle', 'stability', 'leonardo', 'midjourney'] // Premium users can add their own
    };

    return NextResponse.json({ 
      services: availableServices[userTier],
      userTier,
      note: userTier === 'premium' 
        ? 'Premium users can add custom API keys for any image generation service'
        : userTier === 'entry'
        ? 'Upgrade to Professional or higher to access image generation'
        : 'Available image generation services for your tier'
    });
  } catch (error) {
    console.error("Error fetching image services:", error);
    return NextResponse.json(
      { error: "Failed to fetch available services" },
      { status: 500 }
    );
  }
}