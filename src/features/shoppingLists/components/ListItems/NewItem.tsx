import { Input } from "@/components/ui/Input"
import { useState } from "react"
import { useShoppingListsStore } from "../../store"
import { useAddListItem } from "../../hooks/addListItem"

export const NewItem = () => {
    const [newItemName, setNewItemName] = useState("")
    const selectedListId = useShoppingListsStore((state) => state.selectedListId)
    const { handleSubmit: addListItem } = useAddListItem()

    const handleBlur = async () => {
        if (!newItemName.trim() || selectedListId === null) return
        await addListItem(selectedListId, newItemName)
        setNewItemName("")
    }

    return (
        <Input
            placeholder="Enter new item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onBlur={handleBlur}
        />
    )
}