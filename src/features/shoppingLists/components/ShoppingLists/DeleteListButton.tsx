import { Button } from "@/components/ui/Button"
import { MdDeleteOutline } from "react-icons/md"
import { useRemoveShoppingList } from "../../hooks/removeShoppingList"
import { ShoppingList } from "@/types"
import { Popover } from "@heroui/react"

interface Props {
    list: ShoppingList
}

export const DeleteListButton = ({ list }: Props) => {
    const { handleSubmit: removeShoppingList, isLoading } = useRemoveShoppingList()

    return (
        <Popover>
            <Button
                aria-label="delete list button"
                isIconOnly
                size="sm"
                intent="danger"
                isDisabled={isLoading}
                className="opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100! group-focus-within:opacity-100!"
            >
                <MdDeleteOutline size={18} />
            </Button>
            <Popover.Content placement="top" className={"p-0"}>
                <Popover.Dialog className={"p-0"}>
                    <Button
                        aria-label="delete list button"
                        size="md"
                        intent="danger"
                        isDisabled={isLoading}
                        onPress={() => removeShoppingList(list.id)}
                    >
                        <p>Delete</p>
                    </Button>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    )
}
