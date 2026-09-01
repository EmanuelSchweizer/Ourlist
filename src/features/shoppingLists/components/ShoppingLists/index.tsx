"use client"

import { useEffect } from "react"
import { useShoppingListsStore } from "../../store"
import { ShoppingListRow } from "./ShoppingListRow"
import { AddNewListButton } from "./AddNewListButton"

export const ShoppingLists = () => {
    const { fetchShoppingLists, shoppingLists, selectedListId } = useShoppingListsStore()

    useEffect(() => {
        fetchShoppingLists()
    }, [fetchShoppingLists])

    return (
        <div className={`${selectedListId ? "w-full sm:flex hidden" : "w-full"} h-full flex flex-col min-h-0`}>
            <div className="flex items-center justify-between w-full pe-4">
                <h2 className="text-xl font-bold text-start text-gray-800 m-2 shrink-0">My Lists</h2>
                <AddNewListButton />
            </div>
            <div className="w-full rounded-2xl overflow-hidden text-gray-900 bg-white flex-1 min-h-0 overflow-y-auto h-full">
                {shoppingLists.length === 0 ?
                    <div className="flex-1 flex items-center justify-center text-sm text-gray-400 h-full">
                        No lists yet
                    </div> :
                    shoppingLists
                        .sort((a, b) =>
                            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                        )
                        .map((l, i, arr) => (
                            <ShoppingListRow key={l.id} list={l} isLast={i === arr.length - 1} />
                        ))
                }
            </div >
        </div>
    )
}