"use server";

import { createAction } from "@/lib/server/action";
import { authFetch } from "@/lib/server/api-client";
import { User } from "@/types";

export const getUsers = createAction<void, User[]>(
    (input) => authFetch("/User/allUsers", { method: "GET" }),
    "fetch failed.",
);

export const updateUser = createAction<{ userId: number, name: string, email: string, roleId: number }, User>(
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

export const updatePassword = createAction<{ userId: number, newPassword: string }, void>(
    (input) => authFetch(`/User/${input.userId}/password`,
        {
            method: "PUT",
            body: JSON.stringify({
                NewPassword: input.newPassword
            }),
        }),
    "password update failed.",
);

export const deleteUser = createAction<{ userId: number }, void>(
    (input) => authFetch(`/User/${input.userId}`, { method: "DELETE", headers: { "id": String(input.userId) } }),
    "delete user failed.",
);
