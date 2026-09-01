"use client"

import { useMemo } from "react"
import { ActivityFeed } from "./ActivityFeed"
import { PurchaseChart } from "./PurchaseChart"
import { useShoppingListsStore } from "../../store"

export const ListActivity = () => {
    const { selectedListId, shoppingLists } = useShoppingListsStore()

    const selectedList = useMemo(() => {
        return shoppingLists.find(l => l.id === selectedListId)
    }, [selectedListId, shoppingLists])

    return (<>
        <div className={`${!selectedList ? "hidden" : "block"} w-full sm:h-full sm:flex sm:flex-col sm:min-h-0 gap-4`}>
            {selectedList && <>
                <div className="w-full sm:h-[30%] sm:shrink-0 sm:min-h-0 sm:mt-12">
                    <ActivityFeed selectedList={selectedList} />
                </div>
                <div className="w-full sm:flex-1 sm:min-h-0">
                    <PurchaseChart selectedList={selectedList} />
                </div>
            </>}
        </div>
    </>)
}