import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteUser } from "../actions";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

export function useDeleteUser() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (userId: number, closeModal: () => void) => {
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