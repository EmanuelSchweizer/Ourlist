import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteUser } from "../actions";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";

export function useDeleteUser() {
    const router = useRouter();
    const session = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (userId: number, closeModal: () => void) => {
        if (session.data?.user.roleName !== "admin") {
            showWarningToast("A demo admin has no permission.")
            return
        }

        setIsLoading(true)
        deleteUser({ userId: userId })
            .then((response) => {
                if (response.success) {
                    router.refresh()
                    close()
                    showSuccessToast("User deleted successfully.")
                } else {
                    showErrorToast(response.message)
                }
            })
            .finally(() => {
                setIsLoading(false)
            })
    };

    return {
        handleSubmit,
        isLoading
    };
}