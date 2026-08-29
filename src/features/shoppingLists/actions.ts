"use server";

import { createAction } from "@/lib/server/action";
import { authFetch } from "@/lib/server/api-client";
import { ShoppingList } from "@/types";

export const getAllShoppingLists = createAction<void, ShoppingList[]>(
    () => authFetch("/ShoppingList", { method: "GET" }),
    "fetch failed.",
);
