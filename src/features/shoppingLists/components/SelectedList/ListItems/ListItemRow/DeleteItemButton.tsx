import { Button } from "@/components/ui/Button"
import { MdDeleteOutline } from "react-icons/md"
import { useRemoveListItem } from "@/features/shoppingLists/hooks/ListItems/removeListItem";
import { ListItem } from "@/types";
import { Popover } from "@heroui/react";

interface Props {
    setIsUpdating: (isUpdating: boolean) => void;
    isUpdating: boolean;
    item: ListItem;
}

export const DeleteItemButton = ({ setIsUpdating, isUpdating, item }: Props) => {
    const { handleSubmit: removeListItem } = useRemoveListItem()

    const handleDelete = async () => {
        setIsUpdating(true)
        await removeListItem(item.listId, item.id)
    }

    return (
        <Button
            aria-label="delete item button"
            isIconOnly
            size="sm"
            intent="danger"
            isDisabled={isUpdating}
            className="opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100! group-focus-within:opacity-100!"
            onPress={handleDelete}
        >
            <MdDeleteOutline size={18} />
        </Button>
    )
}