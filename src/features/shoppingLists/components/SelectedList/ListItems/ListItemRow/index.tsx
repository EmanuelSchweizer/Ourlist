import { useState } from "react"
import { Checkbox } from "@heroui/react"
import { ListItem } from "@/types"
import { Input } from "@/components/ui/Input"
import { useUpdateListItem } from "../../../../hooks/ListItems/updateListItem"
import { DeleteItemButton } from "./DeleteItemButton"

interface Props {
    item: ListItem
}

export const ListItemRow = ({ item }: Props) => {
    const { handleSubmit: updateListItem } = useUpdateListItem()
    const [isUpdating, setIsUpdating] = useState(false)
    const [name, setName] = useState(item.name)
    const [optimisticBought, setOptimisticBought] = useState<boolean | null>(null)
    const displayedBought = optimisticBought ?? item.bought

    const toggleBought = async () => {
        const previousBought = displayedBought
        const nextBought = !previousBought

        setOptimisticBought(nextBought)
        setIsUpdating(true)
        const success = await updateListItem(item.listId, item.id, { bought: nextBought })
        setIsUpdating(false)
        setOptimisticBought(success ? null : previousBought)
    }

    const handleNameBlur = async () => {
        const trimmedName = name.trim()
        if (!trimmedName) {
            setName(item.name)
            return
        }
        if (trimmedName === item.name) return

        setIsUpdating(true)
        await updateListItem(item.listId, item.id, { name: trimmedName })
        setIsUpdating(false)
    }

    return (
        <div className="group flex items-center justify-between mx-3 py-3 border-b border-gray-200 space-x-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <Checkbox
                    aria-label={`Mark ${item.name} as bought`}
                    isSelected={displayedBought}
                    onChange={toggleBought}
                    className="[--accent:var(--color-violet-700)] [--accent-hover:var(--color-violet-500)]"
                >
                    <Checkbox.Content>
                        <Checkbox.Control>
                            <Checkbox.Indicator/>
                        </Checkbox.Control>
                    </Checkbox.Content>
                </Checkbox>
                <Input
                    aria-label="item name"
                    value={name}
                    disabled={isUpdating}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    className={`shadow-none focus:shadow-field truncate min-w-0 flex-1 ${displayedBought ? "text-gray-400 line-through" : "text-gray-900"}`}
                />
            </div>
            <DeleteItemButton item={item} isUpdating={isUpdating} setIsUpdating={setIsUpdating}/>
        </div>
    )
}