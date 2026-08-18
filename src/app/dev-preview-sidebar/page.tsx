"use client";

import { SessionProvider } from "next-auth/react";
import { SideBarMenu } from "@/components/layout/SideBarMenu";

const fakeSession = {
    user: { name: "Jane Doe", email: "jane.doe@example.com", isAdmin: true },
    expires: new Date(Date.now() + 3600_000).toISOString(),
};

export default function DevPreviewSidebar() {
    return (
        <SessionProvider session={fakeSession}>
            <div className="p-8">
                <SideBarMenu />
            </div>
        </SessionProvider>
    );
}
