"use server";

import { createAction } from "@/lib/server/action";
import { authFetch } from "@/lib/server/api-client";
import { User } from "@/types";
import { UpdateUser, UpdatePassword, DeleteUser } from "./types";

export const getUsers = createAction<void, User[]>(
    () => authFetch("/User/allUsers", { method: "GET" }),
    "fetch failed.",
);

export const updateUser = createAction<UpdateUser, User>(
    (input) => authFetch(`/User/${input.userId}`,
        {
            method: "PUT",
            body: JSON.stringify({
                Name: input.name,
                Email: input.email,
                RoleId: input.roleId
            }),
        }),
    "user update failed.",
);

export const updatePassword = createAction<UpdatePassword, void>(
    (input) => authFetch(`/User/${input.userId}/password`,
        {
            method: "PUT",
            body: JSON.stringify({
                NewPassword: input.newPassword
            }),
        }),
    "password update failed.",
);

export const deleteUser = createAction<DeleteUser, void>(
    (input) => authFetch(`/User/${input.userId}`, { method: "DELETE", headers: { "id": String(input.userId) } }),
    "delete user failed.",
);
