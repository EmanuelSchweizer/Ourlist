import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { addListItem } from "../actions";
import { useShoppingListsStore } from "../store";

export function useAddListItem() {
    const addListItemToStore = useShoppingListsStore((state) => state.addListItem);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (listId: number, name: string) => {
        setIsLoading(true);
        addListItem({ listId, name })
            .then((response) => {
                if (response.success) {
                    addListItemToStore(listId, response.data);
                    showSuccessToast("Item added successfully.");
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
