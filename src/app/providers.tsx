"use client";

import { useEffect } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toast } from "@heroui/react";
import { logout } from "@/features/auth/actions/logout";

interface ProvidersProps {
  children: React.ReactNode;
}

// When the `jwt` callback gives up refreshing the access token, it sets
// `session.error`. There's no way back from that short of signing in again,
// so force it here instead of leaving every subsequent request failing silently.
const SessionErrorWatcher = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.error !== "RefreshFailed") return;

    void (async () => {
      await logout();
      await signOut({ redirect: false });
      router.push("/signIn");
    })();
  }, [session?.error, router]);

  return null;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <SessionProvider>
        <SessionErrorWatcher />
        {children}
      </SessionProvider>
      <Toast.Provider />
    </>
  );
};
