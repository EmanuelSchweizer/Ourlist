import { ShoppingList } from "@/types"
import { ListItemRow } from "./ListItemRow"
import { NewItem } from "./NewItem"
import { BoughtItemsAccordion } from "./BoughtItemsAccordion"
import { useBoughtTransition } from "./useBoughtTransition"

interface Props {
    selectedList: ShoppingList
}

export const ListItems = ({ selectedList }: Props) => {
    const items = selectedList?.items ?? []
    const { isPending, isLeaving } = useBoughtTransition(items)

    const unboughtItems = items
        .filter((item) => !item.bought || isPending(item.id) || isLeaving(item.id))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    const boughtItems = items
        .filter((item) => item.bought && !isPending(item.id) && !isLeaving(item.id))
        .sort((a, b) => new Date(b.boughtAt ?? b.updatedAt).getTime() - new Date(a.boughtAt ?? a.updatedAt).getTime())

    return (
        <div className="w-full rounded-2xl overflow-hidden text-gray-900 bg-white flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
                {items.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-sm text-gray-400 h-full">
                        No items yet
                    </div>
                )}
                {items.length > 0 && unboughtItems.length === 0 && (
                    <div className="flex items-center justify-center text-sm text-gray-400 py-6">
                        No items left to buy
                    </div>
                )}
                {unboughtItems.map((item) => (
                    <div
                        key={item.id}
                        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isLeaving(item.id) ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
                            }`}
                    >
                        <div className="min-h-0 overflow-hidden">
                            <ListItemRow item={item} />
                        </div>
                    </div>
                ))}
                {boughtItems.length > 0 && <BoughtItemsAccordion items={boughtItems} />}
            </div>
            <NewItem />
        </div>
    )
}