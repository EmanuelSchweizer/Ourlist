import { Input } from "@/components/ui/Input"
import { User } from "@/types"
import { SubmitEvent} from "react"


interface Props {
    closeModal: () => void,
    user: User
    handleSubmit: (e: SubmitEvent<HTMLFormElement>, userId: number, closeModal: () => void) => void
}

export const UpdatePasswordForm = ({ user, handleSubmit, closeModal }: Props) => {

    return (<form id="edit-user-form" onSubmit={(e) => handleSubmit(e, user.id, closeModal)} className="space-y-4">
        <Input
            required
            name="newPassword"
            aria-label="new user password"
            label="New password"
            placeholder="New password"
            type="text"
        />
    </form>)
}