import { NextRequest, NextResponse } from "next/server";
import { requireAdminAccessToken, backendHeaders } from "./withAdminToken";

export async function GET(req: NextRequest) {
    const auth = await requireAdminAccessToken(req);
    if ("error" in auth) return auth.error;

    const response = await fetch(`${process.env.API_URL}/User/allUsers`, {
        headers: backendHeaders(auth.accessToken),
    });

    const body = await response.json().catch(() => null);
    return NextResponse.json(body, { status: response.status });
}
