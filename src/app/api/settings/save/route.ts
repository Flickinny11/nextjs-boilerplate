import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createCRMIntegration } from "@/lib/crmServices"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { crm } = body

    if (!crm || !crm.type || !crm.apiKey) {
      return NextResponse.json(
        { error: "Missing required CRM configuration" },
        { status: 400 }
      )
    }

    // TODO: In production, store these settings securely
    // For now, we'll just validate the CRM connection
    const crmIntegration = createCRMIntegration(crm)
    const isValid = await crmIntegration.validateCredentials()

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid CRM credentials" },
        { status: 400 }
      )
    }

    // Store settings in a secure way (e.g., database)
    // For now, we'll just return success
    return NextResponse.json(
      { message: "Settings saved successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  }
}
