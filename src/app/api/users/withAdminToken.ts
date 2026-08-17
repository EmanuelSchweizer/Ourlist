import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

type AdminAuth = { accessToken: string } | { error: NextResponse };

export async function requireAdminAccessToken(req: NextRequest): Promise<AdminAuth> {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAdmin = (token as { isAdmin?: boolean } | null)?.isAdmin === true;
    const accessToken = (token as { accessToken?: string } | null)?.accessToken;

    if (!isAdmin || !accessToken) {
        return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }

    return { accessToken };
}

export function backendHeaders(accessToken: string) {
    return {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY as string,
        "Authorization": `Bearer ${accessToken}`,
    };
}
