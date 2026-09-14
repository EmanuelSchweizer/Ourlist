"use client"

import { useMemo } from "react"
import { useShoppingListsStore } from "../../store"
import { ListTitle } from "./ListTitle"
import { ListItems } from "./ListItems"

export const SelectedList = () => {
    const { selectedListId, shoppingLists } = useShoppingListsStore()

    const selectedList = useMemo(() => {
        return shoppingLists.find(l => l.id === selectedListId)
    }, [selectedListId, shoppingLists])

    return (<>
        {selectedList &&
            <div className={`${!selectedList ? "hidden" : ""} w-full h-full flex flex-row min-h-0 space-x-4`}>
                <div className="w-full h-full min-w-0 flex flex-col min-h-0">
                    <ListTitle selectedList={selectedList} />
                    <ListItems selectedList={selectedList} />
                </div>
            </div>
        }
    </>)
}