import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { shareList } from "../../actions";

export function useShareList() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (listId: number, email: string, onSuccess: () => void) => {
        setIsLoading(true);
        shareList({ listId, email })
            .then((response) => {
                if (response.success) {
                    onSuccess();
                    showSuccessToast("User added as participant successfully.");
                } else {
                    showErrorToast(response.message);
                }
            })
            .finally(() => setIsLoading(false));
    };

    return {
        handleSubmit,
        isLoading,
    };
}
