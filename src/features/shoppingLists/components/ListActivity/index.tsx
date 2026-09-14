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

    return (
        <div className={`${!selectedList ? "hidden" : "block"} w-full sm:h-full sm:flex sm:flex-col sm:min-h-0`}>
            {selectedList && <>
                <div className="w-full sm:min-h-0 mb-8 sm:mb-0 sm:mt-12">
                    <ActivityFeed selectedList={selectedList} />
                </div>
                <div className="w-full sm:flex-1 sm:min-h-0 sm:pt-4">
                    <PurchaseChart selectedList={selectedList} />
                </div>
            </>}
        </div>)
}