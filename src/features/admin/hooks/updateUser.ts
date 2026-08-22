import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateUser } from "../actions";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";

type UpdateFileds = {
    name: string;
    email: string;
    roleId: string;
};

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseUpdateFields(formData: FormData): UpdateFileds {
    return {
        email: (formData.get("email") as string | null)?.trim() ?? "",
        name: (formData.get("name") as string | null)?.trim() ?? "",
        roleId: (formData.get("roleId") as string | null)?.trim() ?? "",
    };
}

function validateFields(fields: UpdateFileds): string | null {
    if (!fields.name || !fields.email || !fields.roleId) {
        return "All fields are required.";
    }

    if (!isValidEmail(fields.email)) {
        return "Please enter a valid email address.";
    }

    if (!fields.roleId) {
        return "Role is required."
    }

    return null;
}

export function useUpdateUser() {
    const router = useRouter();
    const session = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, userId: number, closeModal: () => void) => {
        e.preventDefault();

        const fields = parseUpdateFields(new FormData(e.currentTarget));

        console.log("fields", fields)

        const validationError = validateFields(fields);

        if (validationError) {
            showErrorToast(validationError)
            return;
        }

        if (session.data?.user.roleName !== "admin") {
            showWarningToast("A demo admin has no permission.")
            return
        }

        setIsLoading(true)
        updateUser({ name: fields.name, email: fields.email, roleId: parseInt(fields.roleId), userId: userId })
            .then((response) => {
                if (response.success) {
                    router.refresh()
                    showSuccessToast("User updated successfully.")
                    closeModal()
                } else {
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