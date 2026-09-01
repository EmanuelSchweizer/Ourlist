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
        <Popover>
            <Button
                aria-label="delete item button"
                isIconOnly
                size="sm"
                intent="danger"
                isDisabled={isUpdating}
                className="opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100! group-focus-within:opacity-100!"
            >
                <MdDeleteOutline size={18} />
            </Button>
            <Popover.Content placement="top" className={"p-0"}>
                <Popover.Dialog className={"p-0"}>
                    <Button
                        aria-label="delete item button"
                        size="md"
                        intent="danger"
                        isDisabled={isUpdating}
                        onPress={handleDelete}
                    >
                        <p>Delete</p>
                    </Button>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    )
}