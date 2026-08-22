import { User } from "@/types"

interface Props{
    user: User
}

export const DeleteUserBody = ({user}: Props) => {
    return (<p>
        Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be
        undone.
    </p>)
}