import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { openRouterService } from "@/lib/openRouterService";
import { paymentService } from "@/lib/paymentServices";
import { billingRoutingService } from "@/lib/billingRouting";
import { canAccessModel, type UserTier } from "@/lib/tierModelConfig";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    const userTier = (request.headers.get('x-user-tier') || 'entry') as UserTier;
    const body = await request.json();
    
    const { messages, model = 'openai/gpt-4o', stream = false, tools } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Check if user's tier allows access to this model
    if (!canAccessModel(userTier, model)) {
      return NextResponse.json(
        { error: `Model ${model} is not available for your current plan. Please upgrade to access this model.` },
        { status: 403 }
      );
    }

    // Get user's credit balance to check tier and limits
    const userCredits = await paymentService.getCreditBalance(userId);
    
    // Estimate credits needed for this request
    const estimatedCredits = openRouterService.calculateCreditsNeeded(model, 1000, 500); // Rough estimate
    
    // Check if user has enough credits (only if using system billing)
    const billingRoute = await billingRoutingService.determineAIBillingRoute(userId, model, userTier);
    
    if (!billingRoute.useUserKey) {
      const hasCredits = await paymentService.hasEnoughCredits(userId, estimatedCredits);
      if (!hasCredits) {
        return NextResponse.json(
          { 
            error: "Insufficient credits",
            required: estimatedCredits,
            available: userCredits.available,
            upgradeNeeded: true
          },
          { status: 402 }
        );
      }
    }

    if (stream) {
      // Return streaming response using billing routing
      const streamResponse = await openRouterService.createStreamingChatCompletion(
        messages,
        model,
        { tools, userTier }
      );

      return new Response(streamResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Regular completion using billing routing
      const response = await billingRoutingService.executeAIRequest(
        userId,
        messages,
        model,
        userTier,
        { tools }
      );

      // Track usage for billing (only if using system billing)
      if (!billingRoute.useUserKey && response.usage) {
        await paymentService.trackOpenRouterUsage(
          userId,
          model,
          response.usage.prompt_tokens,
          response.usage.completion_tokens
        );
      }

      return NextResponse.json(response);
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userTier = (request.headers.get('x-user-tier') || 'entry') as UserTier;
    
    // Return available models filtered by user tier
    const models = openRouterService.getAvailableModels(userTier);
    return NextResponse.json({ models, userTier });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}