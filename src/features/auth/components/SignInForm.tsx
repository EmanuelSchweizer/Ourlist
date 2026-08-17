"use client";

import { useSignInForm } from "@/features/auth/hooks/useSignInForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SignInForm(){
    const { error, isSubmitting, handleSubmit } = useSignInForm();

    return (
        <form 
        onSubmit={(e) => void handleSubmit(e)} 
        className="w-full mt-8 text-xl text-black font-semibold flex flex-col space-y-4">
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
            {error && <span className="p-1 mb-2 text-sm font-medium text-red-700 bg-red-500/15 rounded-md">
                {error}
                </span>}
            <Button
                intent="primary"
                type="submit"
                isDisabled={isSubmitting}
            >
                {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
        </form>
    )
}