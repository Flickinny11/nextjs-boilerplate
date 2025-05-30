import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { openRouterService } from "@/lib/openRouterService";
import { paymentService } from "@/lib/paymentServices";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    const body = await request.json();
    
    const { messages, model = 'openai/gpt-4o', stream = false, tools } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Check if user has enough credits (estimate)
    const hasCredits = await paymentService.hasEnoughCredits(userId, 10);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    if (stream) {
      // Return streaming response
      const streamResponse = await openRouterService.createStreamingChatCompletion(
        messages,
        model,
        { tools }
      );

      return new Response(streamResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Regular completion
      const response = await openRouterService.createChatCompletion(
        messages,
        model,
        { tools }
      );

      // Track usage for billing
      await paymentService.trackOpenRouterUsage(
        userId,
        model,
        response.usage.prompt_tokens,
        response.usage.completion_tokens
      );

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

export async function GET() {
  try {
    // Return available models
    const models = openRouterService.getAvailableModels();
    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}