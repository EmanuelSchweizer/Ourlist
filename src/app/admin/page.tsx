"use server";


import { DefaultPageLayout } from "@/components/ui/DefaultPageLayout";
import { UserTable } from "@/features/admin/components/UserTable";
import { authFetch } from "@/lib/server/api-client";
import { User } from "@/types";

export default async function AdminPage() {
    const users = await authFetch<User[]>("/User/allUsers", { method: "GET" });

    return (<DefaultPageLayout>
        <UserTable users={users} />
    </DefaultPageLayout>)
}
