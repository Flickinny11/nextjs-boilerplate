import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { organizationService } from "@/lib/organizationService";

// GET /api/organization - Get user's organizations
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const organizations = await organizationService.getUserOrganizations(userId);

    return NextResponse.json({
      organizations
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}

// POST /api/organization - Create new organization
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    const { name, planId, domain } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!name || !planId) {
      return NextResponse.json(
        { error: "Name and plan ID are required" },
        { status: 400 }
      );
    }

    const organization = await organizationService.createOrganization(
      name,
      userId,
      planId,
      domain
    );

    return NextResponse.json({
      organization,
      message: "Organization created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create organization" },
      { status: 500 }
    );
  }
}