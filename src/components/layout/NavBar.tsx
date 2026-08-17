"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBasketShopping } from "react-icons/fa6";

export const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userName = session?.user?.name?.trim() || session?.user?.email || "User";
  const isAuthenticated = status === "authenticated";
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin === true;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
    router.push("/signIn");
  };

  return (
    <>
      <nav className="sticky inset-x-0 top-0 z-10 border-b border-gray-950/5 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800 flex items-center">
                <div className="flex items-center text-white bg-violet-700 rounded-full w-8 h-8 justify-center">
                  <FaBasketShopping className="w-5 h-5" />
                </div>
                <span className="ml-2">Shopping List</span>
              </Link>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link href="/admin" className="text-sm font-medium text-violet-700 hover:text-violet-600 underline">
                    Admin Panel
                  </Link>
                )}
                <span className="text-sm font-semibold text-gray-700">{userName}</span>
                <Button
                  size="sm"
                  className="bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
                  onClick={() => void handleLogout()}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <Link href="/signIn" className="text-sm font-semibold text-violet-700 hover:text-violet-600 underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>)
}