"use server";

import { createAction } from "@/lib/server/action";
import { authFetch } from "@/lib/server/api-client";
import { ListItem, ShoppingList } from "@/types";
import { AddListItem, DeleteListItem, UpdateListItem } from "./types";

export const getAllShoppingLists = createAction<void, ShoppingList[]>(
    () => authFetch("/ShoppingList", { method: "GET" }),
    "fetch failed.",
);

export const deleteShoppingList = createAction<number, void>(
    (listId) => authFetch(`/shoppinglists/${listId}`, { method: "DELETE" }),
    "delete failed.",
);

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