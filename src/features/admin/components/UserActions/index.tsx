import { User } from "@/types"
import { DeleteUser } from "./Delete"
import { EditUser } from "./Edit"
import { ResetUserPasswort } from "./ResetPasswort"

interface Props{
    user: User
}

export const UserActions = ({user}: Props) => {
    return(<div className="flex justify-end w-full space-x-2 items-center">
        <EditUser/>
        <ResetUserPasswort/>
        <DeleteUser/>
    </div>)
}