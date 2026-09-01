import { ListItem, ShoppingList } from '@/types'
import { create } from 'zustand'
import { getAllShoppingLists } from './actions'

interface State {
    shoppingLists: ShoppingList[]
    loading: boolean
    error: string | null
    setShoppingLists: (shoppingLists: ShoppingList[]) => void
    fetchShoppingLists: () => Promise<void>
    addShoppingList: (shoppingList: ShoppingList) => void
    updateShoppingList: (shoppingList: ShoppingList) => void
    removeShoppingList: (id: number) => void

    addListItem: (listId: number, item: ListItem) => void
    updateListItem: (listId: number, item: ListItem) => void
    removeListItem: (listId: number, itemId: number) => void

    selectedListId: number | null;
    setSelectedListId: (selectedListId: number | null) => void
}

export const useShoppingListsStore = create<State>()((set) => ({
    loading: false,
    error: null,

    //lists
    selectedListId: null,
    setSelectedListId(selectedListId) {
        set({ selectedListId })
    },
    shoppingLists: [],

    setShoppingLists(shoppingLists) {
        set({ shoppingLists })
    },
    async fetchShoppingLists() {
        set({ loading: true, error: null })
        const response = await getAllShoppingLists()
        if (response.success) {
            set({ shoppingLists: response.data, loading: false })
        } else {
            set({ error: response.message, loading: false })
        }
    },
    addShoppingList(shoppingList) {
        set((state) => ({ shoppingLists: [...state.shoppingLists, shoppingList] }))
    },
    updateShoppingList(shoppingList) {
        set((state) => ({
            shoppingLists: state.shoppingLists.map((list) =>
                list.id === shoppingList.id ? shoppingList : list
            ),
        }))
    },
    removeShoppingList(id) {
        set((state) => ({
            shoppingLists: state.shoppingLists.filter((list) => list.id !== id),
        }))
    },

    //listItems
    addListItem(listId, item) {
        set((state) => ({
            shoppingLists: state.shoppingLists.map((list) =>
                list.id === listId
                    ? { ...list, items: [...list.items, item] }
                    : list
            ),
        }))
    },
    updateListItem(listId, item) {
        set((state) => ({
            shoppingLists: state.shoppingLists.map((list) =>
                list.id === listId
                    ? {
                        ...list,
                        items: list.items.map((existing) =>
                            existing.id === item.id ? item : existing
                        ),
                    }
                    : list
            ),
        }))
    },
    removeListItem(listId, itemId) {
        set((state) => ({
            shoppingLists: state.shoppingLists.map((list) =>
                list.id === listId
                    ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
                    : list
            ),
        }))
    },


}))