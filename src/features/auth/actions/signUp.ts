"use server";

import { createAction } from "@/lib/server/action";
import { serverFetch } from "@/lib/server/api-client";
import { SignUpInput, SignUpUser } from "../types";

export const signUp = createAction<SignUpInput, SignUpUser>(
    (input) => serverFetch("/User/signup", { method: "POST", body: JSON.stringify(input) }),
    "Sign up failed.",
);