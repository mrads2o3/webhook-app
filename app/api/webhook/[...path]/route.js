import { NextResponse } from "next/server";
import { addWebhook, createId } from "../../../../lib/webhook-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function parseBody(request) {
  const contentType = request.headers.get("content-type") || "";
  const text = await request.text();
  if (!text) return null;

  if (contentType.includes("application/json")) {
    try { return JSON.parse(text); } catch { return text; }
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(text));
  }

  return text;
}

async function handle(request, context) {
  const { path = [] } = await context.params;
  const url = new URL(request.url);
  const headers = Object.fromEntries(request.headers.entries());
  const body = request.method === "GET" ? null : await parseBody(request);

  const item = {
    id: createId(),
    receivedAt: new Date().toISOString(),
    method: request.method,
    path: "/" + path.join("/"),
    url: request.url,
    query: Object.fromEntries(url.searchParams.entries()),
    headers,
    body,
    ip:
      headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      headers["x-real-ip"] ||
      "unknown"
  };

  addWebhook(item);

  return NextResponse.json(
    { success: true, id: item.id, receivedAt: item.receivedAt },
    { status: 200 }
  );
}

export async function GET(request, context) { return handle(request, context); }
export async function POST(request, context) { return handle(request, context); }
export async function PUT(request, context) { return handle(request, context); }
export async function PATCH(request, context) { return handle(request, context); }
export async function DELETE(request, context) { return handle(request, context); }