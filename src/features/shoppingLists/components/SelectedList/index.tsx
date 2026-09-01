"use client"

import { useMemo } from "react"
import { useShoppingListsStore } from "../../store"
import { ListItemRow } from "./ListItem"
import { NewItem } from "./NewItem"
import { DeleteListButton } from "../ShoppingLists/DeleteListButton"
import { BackToListsButton } from "../ShoppingLists/BackToListsButton"


export const SelectedList = () => {
    const { selectedListId, shoppingLists } = useShoppingListsStore()

    const selectedList = useMemo(() => {
        return shoppingLists.find(l => l.id === selectedListId)
    }, [selectedListId, shoppingLists])

    return (
    <div className={`${!selectedList ? "hidden": ""} w-full`}>
        <div className="group flex items-center justify-between m-2">
            <h2 className="text-xl font-bold text-start text-gray-800">{selectedList?.name}</h2>
            {selectedList && <DeleteListButton list={selectedList}/>}
        </div>
        <div className="w-full rounded-2xl text-gray-900 bg-white">
            {selectedList?.items
            .sort((a, b) => {
                if (a.bought !== b.bought) return a.bought ? 1 : -1
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            })
            .map(item => <ListItemRow item={item} key={item.id}/>)}
            <NewItem/>
        </div >
        {selectedList && <BackToListsButton/>}
    </div>)
}