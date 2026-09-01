"use client"

import { useEffect } from "react"
import { useShoppingListsStore } from "../store"
import { ShoppingListRow } from "./ShoppingListRow"

export const ShoppingLists = () => {
    const { fetchShoppingLists, shoppingLists, selectedListId } = useShoppingListsStore()

    useEffect(() => {
        fetchShoppingLists()
    }, [fetchShoppingLists])

    return (
        <div className={`${selectedListId? "w-full" : "w-1/2"}`}>
            <h2 className="text-xl font-bold text-start text-gray-800 m-2">My Lists</h2>
            <div className="w-full rounded-2xl text-gray-900 bg-white">
                <div>
                    {shoppingLists
                        .sort((a, b) =>
                            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                        )
                        .map((l, i, arr) => (
                            <ShoppingListRow key={l.id} list={l} isLast={i === arr.length - 1} />
                        ))}
                </div>
            </div >
        </div>
    )
}