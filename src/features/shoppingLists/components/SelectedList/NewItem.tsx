import { Input } from "@/components/ui/Input"
import { useState } from "react"
import { useShoppingListsStore } from "../../store"
import { useAddListItem } from "../../hooks/addListItem"
import { Button } from "@/components/ui/Button"
import { FaPlus } from "react-icons/fa6";

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
        <div className="flex items-center justify-between mx-3 py-3 space-x-3">
            <div className="w-full flex items-center gap-3 flex-1 min-w-0 ms-7">
                <Input
                    placeholder="Enter new item..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onBlur={handleBlur}
                />
                <div className="w-10">
                    {newItemName.length > 0 &&
                        <Button
                            size="sm"
                            isIconOnly
                            intent="primary"
                            onClick={handleBlur}
                        >
                            <FaPlus size={18} />
                        </Button>}
                </div>
            </div>
        </div>
    )
}