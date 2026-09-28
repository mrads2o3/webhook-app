import { NextResponse } from "next/server";
import { getWebhooks, clearWebhooks } from "../../../lib/webhook-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const limit = new URL(request.url).searchParams.get("limit") || "100";
  return NextResponse.json(getWebhooks(limit));
}

export async function DELETE() {
  clearWebhooks();
  return NextResponse.json({ success: true });
}