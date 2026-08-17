"use server";

import { serverFetch } from "@/lib/server/api-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
        await serverFetch("/User/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        }).catch(() => {});
    }

    cookieStore.delete("refreshToken");
    cookieStore.delete("accessToken");
    redirect("/login");
}