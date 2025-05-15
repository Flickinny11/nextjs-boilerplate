import { NextResponse } from "next/server";
import { logError } from "src/lib/errorLogger";

export async function handleApiError(error: any) {
  logError(error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
