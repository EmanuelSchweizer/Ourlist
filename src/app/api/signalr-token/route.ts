import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token?.error || !token?.accessToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ accessToken: token.accessToken });
}
