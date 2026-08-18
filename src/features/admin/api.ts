"use server";

import { createAction } from "@/lib/server/action";
import { authFetch } from "@/lib/server/api-client";
import { User } from "@/types";

export const getUsers = createAction<void, User[]>(
    (input) => authFetch("/User/allUsers", { method: "GET" }),
    "fetch failed.",
);