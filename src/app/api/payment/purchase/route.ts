import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { paymentService } from "@/lib/paymentServices"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, planId } = body

    if (!userId || !planId) {
      return NextResponse.json(
        { error: "Missing required payment information" },
        { status: 400 }
      )
    }

    // Process the payment and add credits
    const result = await paymentService.processPayment(userId, planId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: result.message,
      transactionId: result.transactionId,
      credits: result.credits
    }, { status: 200 })

  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    )
  }
}
