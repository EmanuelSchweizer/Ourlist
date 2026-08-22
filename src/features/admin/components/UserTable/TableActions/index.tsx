import { User } from "@/types"
import { DeleteUser } from "./Delete"
import { EditUser } from "./Edit"
import { UpdateUserPasswort } from "./UpdatePassword"

interface Props{
    user: User
}

export const TableUserActions = ({user}: Props) => {
    return(<div className="flex justify-end w-full space-x-2 items-center">
        <EditUser user={user}/>
        <UpdateUserPasswort user={user}/>
        <DeleteUser user={user}/>
    </div>)
}