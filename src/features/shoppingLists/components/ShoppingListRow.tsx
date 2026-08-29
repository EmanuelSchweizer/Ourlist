import { ShoppingList } from "@/types"
import { IoIosArrowForward } from "react-icons/io"

interface Props {
    list: ShoppingList
    isLast?: boolean
}

export const ShoppingListRow = ({ list, isLast }: Props) => {
    return (
        <div className="hover:bg-violet-50 hover:text-violet-900 cursor-pointer">
            <div className={`flex items-center justify-between mx-3 py-3 ${isLast ? "" : "border-b border-gray-200"}`}>
                <p>{list.name}</p>
                <div className="flex items-center text-gray-500 space-x-2">
                    <p>{list.items.length}</p>
                    <IoIosArrowForward width={20} height={20} />
                </div>
            </div>
        </div>
    )
}