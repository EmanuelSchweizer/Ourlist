import { Input } from "@heroui/react"
import { useEffect, useState } from "react"
import { useUpdateShoppingList } from "../../../hooks/ShoppingList/updateShoppingList"
import { ShoppingList } from "@/types"
import { DeleteListOption } from "./DeleteListOption"
import { Avatar } from "@/components/ui/Avatar"
import { useSession } from "next-auth/react"
import { ShowListActivityButton } from "./ShowListActivityButton"

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
        <div className="group flex items-center justify-between space-x-3 p-1 w-full">
            {isUserListOwner ?
                <Input
                    aria-label="item name"
                    disabled={isUpdating}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    className="shadow-none focus:shadow-field truncate min-w-0 p-1 flex-1 bg-transparent text-gray-800 text-xl font-bold"
                /> :
                <div className="flex items-center min-w-0 gap-2">
                    <h2 className="truncate text-gray-800 text-xl font-bold">
                        {name}
                    </h2>
                    <Avatar name={selectedList.ownerName} size="sm" className="shrink-0" />
                </div>
            }
            <div className="flex gap-2">
                <div className="sm:hidden">
                    <ShowListActivityButton />
                </div>
                <DeleteListOption list={selectedList} />
            </div>
        </div>)
}