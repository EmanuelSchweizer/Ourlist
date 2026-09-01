import { useState } from "react"
import { Checkbox } from "@heroui/react"
import { MdDeleteOutline } from "react-icons/md"
import { ListItem } from "@/types"
import { Button } from "@/components/ui/Button"
import { useUpdateListItem } from "../../hooks/updateListItem"
import { useRemoveListItem } from "../../hooks/removeListItem"

interface Props {
    item: ListItem
}

export const ListItemRow = ({ item }: Props) => {
    const { handleSubmit: updateListItem } = useUpdateListItem()
    const { handleSubmit: removeListItem } = useRemoveListItem()
    const [isUpdating, setIsUpdating] = useState(false)

    const toggleBought = async () => {
        setIsUpdating(true)
        await updateListItem(item.listId, item.id, { bought: !item.bought })
        setIsUpdating(false)
    }

    const handleDelete = async () => {
        setIsUpdating(true)
        await removeListItem(item.listId, item.id)
    }

    return (
        <div className="flex items-center justify-between mx-3 py-3 border-b border-gray-200">
            <Checkbox isSelected={item.bought} isDisabled={isUpdating} onChange={toggleBought}>
                <Checkbox.Content>
                    <Checkbox.Control>
                        <Checkbox.Indicator />
                    </Checkbox.Control>
                    <span className={item.bought ? "text-gray-400 line-through" : "text-gray-900"}>
                        {item.name}
                    </span>
                </Checkbox.Content>
            </Checkbox>
            <Button
                aria-label="delete item button"
                isIconOnly
                size="sm"
                intent="danger"
                isDisabled={isUpdating}
                onPress={handleDelete}
            >
                <MdDeleteOutline size={18} />
            </Button>
        </div>
    )
}