import { useCallback, useState } from "react";
import { showErrorToast } from "@/components/ui/toast";
import { getSharedUserList } from "../../actions";
import { SharedUser } from "../../types";

export function useGetSharedUserList() {
    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = useCallback(async (listId: number) => {
        setIsLoading(true);
        getSharedUserList(listId)
            .then((response) => {
                if (response.success) {
                    setSharedUsers(response.data.sharedUsers);
                } else {
                    showErrorToast(response.message);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    return {
        sharedUsers,
        handleSubmit,
        isLoading,
    };
}
