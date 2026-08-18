"use client";

import { useSignUpForm } from "@/features/auth/hooks/useSignUpForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function SignUpForm() {
    const { error, isSubmitting, handleSubmit } = useSignUpForm();

    return (
        <form
            onSubmit={(e) => void handleSubmit(e)}
            className="w-full mt-6 text-xl text-black font-semibold flex flex-col space-y-4"
        >
            <Input
                type="text"
                name="name"
                placeholder="Name"
            />
            <Input
                type="email"
                name="email"
                placeholder="Email"
            />
            <Input
                type="password"
                name="password"
                placeholder="Password"
            />
            <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
            />
            {error && (
                <span className="p-1 mb-2 text-sm font-medium text-red-700 bg-red-500/15 rounded-md">
                    {error}
                </span>
            )}
            <Button type="submit" isDisabled={isSubmitting} intent={"primary"} className={"w-full"}>
                {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-sm text-center font-medium text-gray-700">
                Already have an account?{" "}
                <Link href="/signIn" className="text-violet-700 hover:text-violet-600 underline w-full">
                    Sign in
                </Link>
            </p>
        </form>
    );
}