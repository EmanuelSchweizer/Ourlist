"use client"

import { useMemo } from "react"
import { useShoppingListsStore } from "../../store"
import { BackToListsButton } from "./BackToListsButton"
import { ListTitle } from "./ListTitle"
import { ListItems } from "./ListItems"

export const SelectedList = () => {
    const { selectedListId, shoppingLists } = useShoppingListsStore()

    const selectedList = useMemo(() => {
        return shoppingLists.find(l => l.id === selectedListId)
    }, [selectedListId, shoppingLists])

    return (<>
        {selectedList &&
            <div className={`${!selectedList ? "hidden" : ""} w-full`}>
                <ListTitle selectedList={selectedList} />
                <ListItems selectedList={selectedList} />
                <BackToListsButton />
            </div>
            }
    </>)
}