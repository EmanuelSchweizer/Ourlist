import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signUp } from "@/features/auth/actions/signUp";

export const PASSWORD_RULES_MESSAGE = "Password must be 8-100 characters, including uppercase, lowercase, a number and a special character.";

const GENERIC_SIGN_UP_ERROR = "Sign up failed.";

type SignUpFields = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseSignUpFields(formData: FormData): SignUpFields {
    return {
        name: (formData.get("name") as string | null)?.trim() ?? "",
        email: (formData.get("email") as string | null)?.trim() ?? "",
        password: (formData.get("password") as string | null)?.trim() ?? "",
        confirmPassword: (formData.get("confirmPassword") as string | null)?.trim() ?? "",
    };
}

function validateSignUpFields(fields: SignUpFields): string | null {
    if (!fields.name || !fields.email || !fields.password || !fields.confirmPassword) {
        return "All fields are required.";
    }

    if (!isValidEmail(fields.email)) {
        return "Please enter a valid email address.";
    }

    if (!isStrongPassword(fields.password)) {
        return PASSWORD_RULES_MESSAGE;
    }

    if (fields.password !== fields.confirmPassword) {
        return "Passwords do not match.";
    }

    return null;
}

function isStrongPassword(password: string): boolean {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;
}

export function useSignUpForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const fields = parseSignUpFields(new FormData(e.currentTarget));
        const validationError = validateSignUpFields(fields);

        if (validationError) {
            setError(validationError);
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await signUp({
                name: fields.name,
                email: fields.email,
                password: fields.password,
            });

            if (!result.success) {
                setError(result.message);
                return;
            }

            const signInResponse = await signIn("credentials", {
                email: fields.email,
                password: fields.password,
                redirect: false,
            });

            if (signInResponse?.error) {
                router.refresh();
                router.push("/signIn");
                return;
            }

            router.refresh();
            await new Promise(resolve => setTimeout(resolve, 100));
            router.push("/");
        } catch {
            setError(GENERIC_SIGN_UP_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        error,
        isSubmitting,
        handleSubmit
    };
}