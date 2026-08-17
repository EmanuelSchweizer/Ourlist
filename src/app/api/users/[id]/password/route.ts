import { NextRequest, NextResponse } from "next/server";
import { requireAdminAccessToken, backendHeaders } from "../../withAdminToken";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdminAccessToken(req);
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await req.json();

    const response = await fetch(`${process.env.API_URL}/User/${id}/password`, {
        method: "PUT",
        headers: backendHeaders(auth.accessToken),
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const responseBody = await response.json().catch(() => null);
        return NextResponse.json(responseBody, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
}
