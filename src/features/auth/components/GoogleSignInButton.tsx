"use client";
import { FcGoogle } from "react-icons/fc";

import { signIn } from "next-auth/react";
import { Button } from "@heroui/react";

interface GoogleSignInButtonProps {
    label?: string;
}

export const GoogleSignInButton = ({ label = "Sign in with Google" }: GoogleSignInButtonProps) => {
    return (
        <Button
            variant="primary"
            className={"w-full flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"}
            onClick={() => signIn("google")}
        >
            <FcGoogle className="w-5 h-5 mr-2" />
            {label}
        </Button>
    );
}