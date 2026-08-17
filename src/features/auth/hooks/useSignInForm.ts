import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const INVALID_CREDENTIALS_ERROR = "Invalid email or password.";

type SignInFields = {
    email: string;
    password: string;
};

function parseSignInFields(formData: FormData): SignInFields {
    return {
        email: (formData.get("email") as string | null)?.trim() ?? "",
        password: (formData.get("password") as string | null)?.trim() ?? "",
    };
}

export function useSignInForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const fields = parseSignInFields(new FormData(e.currentTarget));

        try {
            const signInResponse = await signIn("credentials", {
                email: fields.email,
                password: fields.password,
                redirect: false,
            });

            if (signInResponse?.error) {
                setError(INVALID_CREDENTIALS_ERROR);
                return;
            }

            // Refresh to ensure session is fully loaded before redirecting
            router.refresh();

            // Small delay to allow session to be established
            await new Promise(resolve => setTimeout(resolve, 100));

            router.push("/");
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        error,
        isSubmitting,
        handleSubmit,
    };
}