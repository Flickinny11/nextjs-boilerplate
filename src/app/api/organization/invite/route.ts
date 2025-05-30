import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { organizationService } from "@/lib/organizationService";

// POST /api/organization/invite/accept - Accept organization invitation
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    const { token } = body;

    if (!userId || !token) {
      return NextResponse.json(
        { error: "User ID and invitation token are required" },
        { status: 400 }
      );
    }

    const result = await organizationService.acceptInvitation(token, userId);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Invitation accepted successfully",
      organization: result.organization,
      member: result.member
    }, { status: 200 });

  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to accept invitation" },
      { status: 500 }
    );
  }
}