"use server";

import { createAction } from "@/lib/server/action";
import { authFetch } from "@/lib/server/api-client";
import { ListItem, ShoppingList } from "@/types";
import { AddListItem, AddShoppingList, DeleteListItem, SharedUserList, ShareList, UpdateListItem, UpdateShoppingList } from "./types";

//ShoppingList

export const getAllShoppingLists = createAction<void, ShoppingList[]>(
    () => authFetch("/ShoppingList", { method: "GET" }),
    "fetch failed.",
);

export const addShoppingList = createAction<AddShoppingList, ShoppingList>(
    (input) => authFetch(`/ShoppingList`, {
        method: "POST",
        body: JSON.stringify({
            Name: input.name,
        }),
    }),
    "add failed.",
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

//Share Lists
export const getSharedUserList = createAction<number, SharedUserList>(
    (listId) => authFetch(`/SharedList/${listId}`, {
        method: "GET",
    }),
    "fetch failed.",
);

export const shareList = createAction<ShareList, void>(
    (input) => authFetch(`/SharedList/${input.listId}`, {
        method: "POST",
        body: JSON.stringify({
            Email: input.email,
        }),
    }),
    "post failed.",
);

export const unShareList = createAction<{listId: number, sharedUserId: number}, void>(
    (input) => authFetch(`/SharedList/${input.listId}/${input.sharedUserId}`, {
        method: "DELETE",
    }),
    "fetch failed.",
);