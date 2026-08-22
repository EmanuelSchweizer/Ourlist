import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { showErrorToast } from "@/components/ui/toast"
import { getRoles } from "@/features/roles/api"
import { Role, User } from "@/types"
import { ListBox } from "@heroui/react"
import { SubmitEvent, useEffect, useState } from "react"

interface Props {
    closeModal: () => void,
    user: User
    handleSubmit: (e: SubmitEvent<HTMLFormElement>, userId: number, closeModal: () => void) => void
}

export const EditUserForm = ({ user, handleSubmit, closeModal }: Props) => {
    const [roles, setRoles] = useState<Role[]>([])
    const [updatedUser, setUpdatedUser] = useState<User>(user)

    useEffect(() => {
        getRoles().then((response) => {
            if (response.success) {
                setRoles(response.data)
            } else {
                showErrorToast(response.message)
            }
        })
    }, [])

    return (<form id="edit-user-form" onSubmit={(e) => handleSubmit(e, user.id, closeModal)} className="space-y-4">
        <Input
            required
            value={updatedUser.name}
            onChange={(e) => setUpdatedUser((prev) => ({ ...prev, name: e.target.value }))}
            name="name"
            aria-label="User name"
            label="Name"
            placeholder="Name"
            type="text"
        />
        <Input
            required
            value={updatedUser.email}
            onChange={(e) => setUpdatedUser((prev) => ({ ...prev, email: e.target.value }))}
            name="email"
            label="Email"
            type="email"
            aria-label="User email"
            placeholder="Name"
        />
        <Select
            isRequired
            name="roleId"
            aria-label="User role"
            selectedKey={updatedUser.roleId}
            onSelectionChange={(key) => {
                if (key)
                    setUpdatedUser((prev) => ({ ...prev, roleId: Number(key) }))
            }}
            selectionMode="single"
            label="Role"
            placeholder="Select role"
        >
            <ListBox>
                {roles.map((role) => (
                    <ListBox.Item key={role.id} id={role.id} textValue={role.name}>
                        {role.name}
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                ))}
            </ListBox>
        </Select>
    </form>)
}