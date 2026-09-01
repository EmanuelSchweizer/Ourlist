import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { removeListItem } from "../actions";
import { useShoppingListsStore } from "../store";

export function useRemoveListItem() {
    const removeListItemFromStore = useShoppingListsStore((state) => state.removeListItem);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (listId: number, itemId: number) => {
        setIsLoading(true);
        removeListItem({ listId, itemId })
            .then((response) => {
                if (response.success) {
                    removeListItemFromStore(listId, itemId);
                    showSuccessToast("Item removed successfully.");
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
