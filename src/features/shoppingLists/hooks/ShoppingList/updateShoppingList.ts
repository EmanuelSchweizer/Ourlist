import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { updateShoppingList } from "../../actions";
import { useShoppingListsStore } from "../../store";

export function useUpdateShoppingList() {
    const updateShoppingListInStore = useShoppingListsStore((state) => state.updateShoppingList);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (listId: number, name: string) => {
        setIsLoading(true);
        updateShoppingList({ listId, name })
            .then((response) => {
                if (response.success) {
                    updateShoppingListInStore(response.data);
                    showSuccessToast("List updated successfully.");
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
