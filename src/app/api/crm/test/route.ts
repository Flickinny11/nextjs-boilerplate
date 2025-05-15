import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createCRMIntegration } from "@/lib/crmServices"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.type || !body.apiKey) {
      return NextResponse.json(
        { error: "Missing required CRM configuration" },
        { status: 400 }
      )
    }

    const crmIntegration = createCRMIntegration({
      type: body.type,
      apiKey: body.apiKey,
      baseUrl: body.baseUrl,
    })

    const isValid = await crmIntegration.validateCredentials()

    if (!isValid) {
      return NextResponse.json(
        { error: "Failed to connect to CRM. Please check your credentials." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "CRM connection successful" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error testing CRM connection:", error)
    return NextResponse.json(
      { error: "Failed to test CRM connection" },
      { status: 500 }
    )
  }
}
