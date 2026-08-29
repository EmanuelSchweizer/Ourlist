import { ShoppingList } from '@/types'
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
}

export const useShoppingListsStore = create<State>()((set) => ({
    shoppingLists: [],
    loading: false,
    error: null,
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
    }
}))