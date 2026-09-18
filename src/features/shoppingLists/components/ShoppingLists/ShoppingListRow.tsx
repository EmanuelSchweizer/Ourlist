import { ShoppingList } from "@/types"
import { IoIosArrowForward } from "react-icons/io"
import { useShoppingListsStore } from "../../store"
import { Avatar } from "@/components/ui/Avatar"
import { useSession } from "next-auth/react"

interface Props {
    list: ShoppingList
    isLast?: boolean
}

export const ShoppingListRow = ({ list, isLast }: Props) => {
    const { setSelectedListId, selectedListId } = useShoppingListsStore()
    const session = useSession()

    const isUserListOwner = Number(session.data?.user.id) === list.ownerId
    const isSelected = list.id === selectedListId

    return (
        <div className={`hover:bg-violet-50 hover:text-violet-900 cursor-pointer border-l-4 rounded-lg ${isSelected ? "bg-violet-50 text-violet-900 border-violet-600" : "border-transparent"}`}>
            <div
                onClick={() => setSelectedListId(list.id)}
                className={`flex items-center justify-between mx-3 p-4 ${isLast ? "" : "border-b border-gray-200"}`}>
                <div className="flex items-center min-w-0 gap-2">
                    <p className="truncate">{list.name}</p>
                    {!isUserListOwner && <Avatar name={list.ownerName} size="sm" className="shrink-0" />}
                </div>
                <div className={`flex items-center space-x-2 ${isSelected ? "text-violet-900" : "text-gray-500"}`}>
                    <p>{`${list.items.filter(i => i.bought).length} / ${list.items.length}`}</p>
                    <IoIosArrowForward width={20} height={20} />
                </div>
            </div>
        </div>
    )
}