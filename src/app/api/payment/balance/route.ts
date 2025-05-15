import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { paymentService } from "@/lib/paymentServices"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Get user's credit balance
    const balance = await paymentService.getCreditBalance(userId)

    // Get API service credits
    const openaiCredits = await paymentService.getAPICredits('openai')
    const anthropicCredits = await paymentService.getAPICredits('anthropic')

    return NextResponse.json({
      userCredits: balance,
      apiCredits: {
        openai: openaiCredits,
        anthropic: anthropicCredits
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    )
  }
}
