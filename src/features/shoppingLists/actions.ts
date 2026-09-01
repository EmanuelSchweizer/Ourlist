"use server";

import { createAction } from "@/lib/server/action";
import { authFetch } from "@/lib/server/api-client";
import { ListItem, ShoppingList } from "@/types";
import { AddListItem, DeleteListItem, UpdateListItem, UpdateShoppingList } from "./types";

//ShoppingList

export const getAllShoppingLists = createAction<void, ShoppingList[]>(
    () => authFetch("/ShoppingList", { method: "GET" }),
    "fetch failed.",
);

export const updateShoppingList = createAction<UpdateShoppingList, ShoppingList>(
    (input) => authFetch(`/ShoppingList/${input.listId}`, {
        method: "PUT",
        body: JSON.stringify({
            Name: input.name,
        }),
    }),
    "update failed.",
);

export const deleteShoppingList = createAction<number, void>(
    (listId) => authFetch(`/ShoppingList/${listId}`, { method: "DELETE" }),
    "delete failed.",
);

//ListItem

export const addListItem = createAction<AddListItem, ListItem>(
    (input) => authFetch(`/shoppinglists/${input.listId}/items`, {
        method: "POST",
        body: JSON.stringify({
            Name: input.name,
        }),
    }),
    "post failed.",
);

export const updateListItem = createAction<UpdateListItem, ListItem>(
    (input) => authFetch(`/shoppinglists/${input.listId}/items/${input.itemId}`, {
        method: "PUT",
        body: JSON.stringify({
            Name: input.name,
            Bought: input.bought,
        }),
    }),
    "update failed.",
);

export const removeListItem = createAction<DeleteListItem, void>(
    (input) => authFetch(`/shoppinglists/${input.listId}/items/${input.itemId}`, {
        method: "DELETE",
    }),
    "delete failed.",
);