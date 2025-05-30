import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { organizationService } from "@/lib/organizationService";

// GET /api/organization/members?orgId=xxx - Get organization members
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: "User ID and Organization ID are required" },
        { status: 400 }
      );
    }

    // Check if user has permission to view members
    const hasPermission = await organizationService.hasPermission(userId, orgId, 'view_members');
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const members = await organizationService.getOrganizationMembers(orgId);
    const invitations = await organizationService.getOrganizationInvitations(orgId);

    return NextResponse.json({
      members,
      invitations
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching organization members:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization members" },
      { status: 500 }
    );
  }
}

// POST /api/organization/members - Add new member or send invitation
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    const { organizationId, email, role, name } = body;

    if (!userId || !organizationId || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has permission to manage members
    const hasPermission = await organizationService.hasPermission(userId, organizationId, 'manage_members');
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Create invitation
    const invitation = await organizationService.createInvitation(
      organizationId,
      email,
      role,
      userId
    );

    return NextResponse.json({
      invitation,
      message: "Invitation sent successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error adding organization member:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add member" },
      { status: 500 }
    );
  }
}

// DELETE /api/organization/members - Remove member
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');
    const memberId = searchParams.get('memberId');

    if (!userId || !orgId || !memberId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Check if user has permission to manage members
    const hasPermission = await organizationService.hasPermission(userId, orgId, 'manage_members');
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const success = await organizationService.removeMember(orgId, memberId);

    if (!success) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Member removed successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error removing organization member:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove member" },
      { status: 500 }
    );
  }
}