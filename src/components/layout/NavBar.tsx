"use client";

import { FaBasketShopping } from "react-icons/fa6";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SideBarMenu } from "./SideBarMenu";

export const NavBar = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <>
      <nav className="sticky inset-x-0 top-0 z-20 border-b border-gray-950/5 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800 flex items-center">
                <div className="flex items-center text-white bg-violet-700 rounded-full w-8 h-8 justify-center">
                  <FaBasketShopping className="w-5 h-5" />
                </div>
                <span className="ml-2">Ourlist</span>
              </Link>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <SideBarMenu/>
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