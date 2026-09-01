import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { updateListItem } from "../../actions";
import { useShoppingListsStore } from "../../store";

export function useUpdateListItem() {
    const updateListItemInStore = useShoppingListsStore((state) => state.updateListItem);
    const shoppingLists = useShoppingListsStore((state) => state.shoppingLists);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (
        listId: number,
        itemId: number,
        changes: { name?: string; bought?: boolean }
    ) => {
        const currentItem = shoppingLists
            .find((list) => list.id === listId)
            ?.items.find((item) => item.id === itemId);

        if (!currentItem) {
            showErrorToast("Item not found.");
            return;
        }

        setIsLoading(true);
        updateListItem({
            listId,
            itemId,
            name: changes.name ?? currentItem.name,
            bought: changes.bought ?? currentItem.bought,
        })
            .then((response) => {
                if (response.success) {
                    updateListItemInStore(listId, response.data);
                    showSuccessToast("Item updated successfully.");
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
