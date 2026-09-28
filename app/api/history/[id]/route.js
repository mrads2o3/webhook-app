import { NextResponse } from "next/server";
import { deleteWebhook, getWebhook } from "../../../../lib/webhook-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, context) {
  const { id } = await context.params;
  const item = getWebhook(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  const deleted = deleteWebhook(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}