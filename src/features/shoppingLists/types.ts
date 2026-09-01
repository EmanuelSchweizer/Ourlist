//ShoppingLists

export interface UpdateShoppingList {
    listId: number
    name: string
}

//ListItems

export interface AddListItem {
    listId: number
    name: string
}

export interface UpdateListItem {
    listId: number
    itemId: number
    name?: string
    bought?: boolean
}

export interface DeleteListItem {
    listId: number
    itemId: number
}