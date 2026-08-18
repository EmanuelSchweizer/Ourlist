"use client";

import { User } from "@/types"
import { useCallback, useEffect, useState } from "react"
import { getUsers } from "../api"
import { UserTable } from "./UserTable"
import { LoadingScreen } from "@/components/ui/LoadingScreen"
import { ErrorScreen } from "@/components/ui/ErrorScreen"

export const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const load = useCallback(() => {
        setIsLoading(true);
        getUsers()
            .then((response) => {
                if (response.success) {
                    setUsers(response.data);
                    setError("");
                } else {
                    setError(response.message);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    if(isLoading) return <LoadingScreen />;
    if(error) return <ErrorScreen message={error} onRetry={load}/>;
    return <UserTable users={users} />;
}