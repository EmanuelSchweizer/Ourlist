import { ShoppingList } from "@/types"
import { ListItemRow } from "./ListItemRow"
import { NewItem } from "./NewItem"

interface Props {
    selectedList: ShoppingList
}

export const ListItems = ({ selectedList }: Props) => {

    return (
        <div className="w-full rounded-2xl text-gray-900 bg-white">
            {selectedList?.items
                .sort((a, b) => {
                    if (a.bought !== b.bought) return a.bought ? 1 : -1
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                })
                .map(item => <ListItemRow item={item} key={item.id} />)}
            <NewItem />
        </div >
    )
}