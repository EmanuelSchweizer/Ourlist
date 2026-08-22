import { unstable_cache } from "next/cache";
import { serverFetch } from "./api-client";
import { Role } from "@/types";

export const getCachedRoles = unstable_cache(
    () => serverFetch<Role[]>("/Role"),
    ["roles"],
    { revalidate: false, tags: ["roles"] },
);