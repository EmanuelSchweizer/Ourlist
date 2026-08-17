import { SignInForm } from "@/features/auth/components/SignInForm";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";
import { Card } from "@heroui/react";
import Link from "next/link";

export const SignInPage = () => {
    return (
        <div className="h-full">
            <Card className="w-full shadow-none rounded-none sm:shadow-surface sm:rounded-3xl text-gray-900 sm:max-w-md sm:mx-auto sm:my-10">
                <Card.Header className="mb-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
                </Card.Header>
                <Card.Content className="flex flex-col items-center">
                    <GoogleSignInButton />
                    <p className="text-lg font-semibold text-center my-3 text-gray-800">
                        Or
                    </p>
                    <SignInForm />
                    <p className="text-sm text-center font-medium text-gray-700 mt-6">
                        New here?{" "}
                        <Link href="/signUp" className="text-violet-700 hover:text-violet-600 underline">
                            Create an account
                        </Link>
                    </p>
                </Card.Content>
            </Card>
        </div>
    )
}

export default SignInPage;