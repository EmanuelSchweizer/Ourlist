import { Input } from "@/components/ui/Input"
import { useState } from "react"
import { useShoppingListsStore } from "../../../store"
import { useAddListItem } from "../../../hooks/ListItems/addListItem"
import { Button } from "@/components/ui/Button"
import { FaPlus } from "react-icons/fa6";

export const NewItem = () => {
    const [newItemName, setNewItemName] = useState("")
    const selectedListId = useShoppingListsStore((state) => state.selectedListId)
    const { handleSubmit: addListItem } = useAddListItem()

    const handleAdd = async () => {
        if (!newItemName.trim() || selectedListId === null) return
        await addListItem(selectedListId, newItemName)
        setNewItemName("")
    }

    return (
        <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0 rounded-b-2xl">
            <Input
                aria-label="new item name input"
                placeholder="Enter new item..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="bg-white shadow-none focus:shadow-field"
            />
            <Button
                aria-label="add item button"
                size="sm"
                isIconOnly
                intent="primary"
                isDisabled={!newItemName.trim()}
                onClick={handleAdd}
                className={"w-11"}
            >
                <FaPlus size={14}/>
            </Button>
        </div>
    )
}