import { useState } from "react";
import { showErrorToast } from "@/components/ui/toast";
import { unShareList } from "../../actions";

export function useUnShareList() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (listId: number, sharedUserId: number, onSuccess: () => void) => {
        setIsLoading(true);
        unShareList({ listId, sharedUserId })
            .then((response) => {
                if (response.success) {
                    onSuccess();
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
