import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(request, context) {
    const { path = [] } = await context.params;

    const url = new URL(request.url);

    return NextResponse.json({
        success: true,
        method: request.method,
        path: "/" + path.join("/"),
        url: request.url,
        query: Object.fromEntries(url.searchParams.entries()),
    });
}

export async function GET(request, context) {
    return handle(request, context);
}

export async function POST(request, context) {
    return handle(request, context);
}

export async function PUT(request, context) {
    return handle(request, context);
}

export async function PATCH(request, context) {
    return handle(request, context);
}

export async function DELETE(request, context) {
    return handle(request, context);
}