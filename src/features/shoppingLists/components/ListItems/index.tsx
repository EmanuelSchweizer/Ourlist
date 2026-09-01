"use client"

import { useMemo } from "react"
import { useShoppingListsStore } from "../../store"
import { ListItemRow } from "./ListItem"
import { NewItem } from "./NewItem"


export const ListItems = () => {
    const { selectedListId, shoppingLists } = useShoppingListsStore()

    const selectedList = useMemo(() => {
        return shoppingLists.find(l => l.id === selectedListId)
    }, [selectedListId, shoppingLists])

    return (
    <div className={`${!selectedList ? "hidden": ""} w-full`}>
        <h2 className="text-xl font-bold text-start text-gray-800 m-2">{selectedList?.name}</h2>
        <div className="w-full rounded-2xl text-gray-900 bg-white">
            {selectedList?.items.map(item => <ListItemRow item={item} key={item.id}/>)}
            <NewItem/>
        </div >
    </div>)
}