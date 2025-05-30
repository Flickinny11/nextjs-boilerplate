import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { paymentService } from "@/lib/paymentServices"

export const dynamic = 'force-dynamic'

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

    // Get usage analytics
    const analytics = await paymentService.getUsageAnalytics(userId)

    // Get recent usage history
    const usageHistory = await paymentService.getAPIUsageHistory(userId)

    return NextResponse.json({
      userCredits: balance,
      analytics: {
        totalCost: analytics.totalCost,
        totalTokens: analytics.totalTokens,
        modelUsage: analytics.modelUsage
      },
      recentUsage: usageHistory.slice(-10) // Last 10 API calls
    }, { status: 200 })

  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    )
  }
}
