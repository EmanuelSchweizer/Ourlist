"use server"

import { createAction } from "@/lib/server/action";
import { getCachedRoles } from "@/lib/server/roles";
import { Role } from "@/types";

export const getRoles = createAction<void, Role[]>(
    (input) => getCachedRoles(),
    "fetch failed.",
);