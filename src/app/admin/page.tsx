"use server";

import { DefaultPageLayout } from "@/components/ui/DefaultPageLayout";
import { UserTable } from "@/features/admin/components/UserTable";
import { authFetch } from "@/lib/server/api-client";
import { User } from "@/types";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { DEMO_USERS } from "@/features/admin/constants";

export default async function AdminPage() {
    const token = await getToken({
        req: { cookies: await cookies() } as unknown as NextRequest,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isDemoAdmin = token?.roleName === "demoAdmin";

    const users = isDemoAdmin ? DEMO_USERS : await authFetch<User[]>("/User/allUsers", { method: "GET" });

    return (<DefaultPageLayout>
        <UserTable users={users} />
    </DefaultPageLayout>)
}
