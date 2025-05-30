import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { organizationService } from "@/lib/organizationService";

export const dynamic = 'force-dynamic'

// GET /api/organization/billing?orgId=xxx - Get organization billing info and usage
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

    // Check if user has permission to view billing
    const hasPermission = await organizationService.hasPermission(userId, orgId, 'view_usage');
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Insufficient permissions to view billing information" },
        { status: 403 }
      );
    }

    const organization = await organizationService.getOrganization(orgId);
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const usage = await organizationService.getOrganizationUsage(orgId);

    return NextResponse.json({
      billing: organization.billing,
      plan: organization.plan,
      usage
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching organization billing:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing information" },
      { status: 500 }
    );
  }
}