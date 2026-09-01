import { Input } from "@heroui/react"
import { useEffect, useState } from "react"
import { useUpdateShoppingList } from "../../hooks/ShoppingList/updateShoppingList"
import { ShoppingList } from "@/types"
import { DeleteListButton } from "../ShoppingLists/DeleteListButton"
import { useSession } from "next-auth/react"

interface Props {
    selectedList: ShoppingList
}

export const ListTitle = ({ selectedList }: Props) => {
    const session = useSession()
    const [isUpdating, setIsUpdating] = useState(false)
    const [name, setName] = useState("")
    const { handleSubmit: updateShoppingList } = useUpdateShoppingList()

    const isUserListOwner = Number(session.data?.user.id) === selectedList.ownerId

    useEffect(() => {
        selectedList && setName(selectedList.name)
    }, [selectedList])

    const handleNameBlur = async () => {
        if (!selectedList) return

        const trimmedName = name.trim()
        if (!trimmedName) {
            setName(selectedList.name)
            return
        }
        if (trimmedName === selectedList.name) return

        setIsUpdating(true)
        await updateShoppingList(selectedList.id, trimmedName)
        setIsUpdating(false)
    }

    return (
        <div className="group flex items-center justify-between m-2 space-x-3">
            {isUserListOwner ?
                <Input
                    aria-label="item name"
                    disabled={isUpdating}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    className="shadow-none focus:shadow-field truncate min-w-0 flex-1 bg-transparent p-0 text-gray-800 text-xl font-bold"
                /> :
                <h2 className="text-gray-800 text-xl font-bold">
                    {name}
                </h2>
            }
            {isUserListOwner && <DeleteListButton list={selectedList} />}
        </div>)
}