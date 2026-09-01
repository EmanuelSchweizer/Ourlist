"use client"

import { useMemo } from "react"
import { useShoppingListsStore } from "../../store"
import { BackToListsButton } from "./BackToListsButton"
import { ListTitle } from "./ListTitle"
import { ListItems } from "./ListItems"
import { ActivityFeed } from "./ActivityFeed"

export const SelectedList = () => {
    const { selectedListId, shoppingLists } = useShoppingListsStore()

    const selectedList = useMemo(() => {
        return shoppingLists.find(l => l.id === selectedListId)
    }, [selectedListId, shoppingLists])

    return (<>
        {selectedList &&
            <div className={`${!selectedList ? "hidden" : ""} w-full sm:w-2/3 flex flex-col sm:flex-row sm:h-full sm:min-h-0 gap-4`}>
                <div className="w-full sm:w-1/2 min-w-0 sm:h-full sm:flex sm:flex-col sm:min-h-0">
                    <ListTitle selectedList={selectedList} />
                    <ListItems selectedList={selectedList} />
                    <BackToListsButton />
                </div>
                <div className="w-full sm:w-1/2 mt-12">
                    <ActivityFeed selectedList={selectedList} />
                </div>
            </div>
        }
    </>)
}