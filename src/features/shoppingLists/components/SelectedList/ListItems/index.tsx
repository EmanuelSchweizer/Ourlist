import { ShoppingList } from "@/types"
import { ListItemRow } from "./ListItemRow"
import { NewItem } from "./NewItem"

interface Props {
    selectedList: ShoppingList
}

export const ListItems = ({ selectedList }: Props) => {

    return (
        <div className="w-full rounded-2xl overflow-hidden text-gray-900 bg-white flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
                {selectedList?.items.length === 0 ?
                    <div className="flex-1 flex items-center justify-center text-sm text-gray-400 h-full">
                        No items yet
                    </div> :
                    selectedList?.items.sort((a, b) => {
                        if (a.bought !== b.bought) return a.bought ? 1 : -1
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    })
                        .map(item => <ListItemRow item={item} key={item.id} />)}
            </div>
            <NewItem />
        </div>
    )
}