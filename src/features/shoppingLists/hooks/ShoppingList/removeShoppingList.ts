import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { deleteShoppingList } from "../../actions";
import { useShoppingListsStore } from "../../store";

export function useRemoveShoppingList() {
    const removeShoppingListFromStore = useShoppingListsStore((state) => state.removeShoppingList);
    const selectedListId = useShoppingListsStore((state) => state.selectedListId);
    const setSelectedListId = useShoppingListsStore((state) => state.setSelectedListId);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (listId: number) => {
        setIsLoading(true);
        deleteShoppingList(listId)
            .then((response) => {
                if (response.success) {
                    removeShoppingListFromStore(listId);
                    if (selectedListId === listId) setSelectedListId(null);
                    showSuccessToast("List removed successfully.");
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
