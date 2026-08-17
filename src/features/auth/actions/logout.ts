"use server";

import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

import { serverFetch } from "@/lib/server/api-client";

export async function logout() {
    const token = await getToken({
        req: { cookies: await cookies() } as unknown as NextRequest,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (token?.refreshToken) {
        await serverFetch("/User/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        }).catch(() => {});
    }
}