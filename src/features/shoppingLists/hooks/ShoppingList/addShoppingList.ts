import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { addShoppingList } from "../../actions";
import { useShoppingListsStore } from "../../store";
import { AddShoppingList } from "../../types";

function parseFormFields(formData: FormData): AddShoppingList {
    return {
        name: (formData.get("name") as string | null)?.trim() ?? ""
    };
}

export function useAddShoppingList() {
    const addShoppingListInStore = useShoppingListsStore((state) => state.addShoppingList);
    const setSelectedListId = useShoppingListsStore((state) => state.setSelectedListId);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
        e.preventDefault();
        const fields = parseFormFields(new FormData(e.currentTarget));

        setIsLoading(true);
        addShoppingList({ name: fields.name })
            .then((response) => {
                if (response.success) {
                    addShoppingListInStore(response.data);
                    showSuccessToast("List added successfully.");
                    setSelectedListId(response.data.id)
                    closeModal()
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
