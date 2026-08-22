import { useRouter } from "next/navigation";
import { useState } from "react";
import { updatePassword } from "../api";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

type UpdateFileds = {
    newPassword: string;
};

function isStrongPassword(password: string): boolean {
    const hasMinLength = password.length >= 10;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;
}

function parseUpdateFields(formData: FormData): UpdateFileds {
    return {
        newPassword: (formData.get("newPassword") as string | null)?.trim() ?? ""
    };
}

function validateFields(fields: UpdateFileds): string | null {
    if (!fields.newPassword) {
        return "Password is required.";
    }

    if (!isStrongPassword(fields.newPassword)) {
        return "Password must be 8-100 characters, including uppercase, lowercase, a number and a special character.";
    }

    return null;
}

export function useUpdateUserPassword() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, userId: number, closeModal: () => void) => {
        e.preventDefault();

        const fields = parseUpdateFields(new FormData(e.currentTarget));

        const validationError = validateFields(fields);

        if (validationError) {
            showErrorToast(validationError)
            return;
        }

        setIsLoading(true)
        updatePassword({ newPassword: fields.newPassword, userId: userId })
            .then((response) => {
                if (response.success) {
                    router.refresh()
                    showSuccessToast("Password updated successfully.")
                    closeModal()
                }else{
                    showErrorToast(response.message)
                }
            })
            .finally(() => setIsLoading(false))
    };

    return {
        handleSubmit,
        isLoading
    };
}