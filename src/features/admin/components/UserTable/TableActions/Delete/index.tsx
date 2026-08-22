import { Button } from "@/components/ui/Button"
import { User } from "@/types";
import { Modal } from "@heroui/react";
import { MdDeleteOutline } from "react-icons/md";
import { useDeleteUser } from "@/features/admin/hooks/deleteUser";
import { useSession } from "next-auth/react";
import { DeleteUserBody } from "./Body";

interface Props {
    user: User
}

export const DeleteUser = ({ user }: Props) => {
    const session = useSession()
    const isSessionUser = session.data?.user.id === String(user.id)

    const { handleSubmit, isLoading } = useDeleteUser()

    return (<Modal>
        <Button isDisabled={isSessionUser} size="sm" isIconOnly intent="danger">
            <MdDeleteOutline size={20} height={20} />
        </Button>
        <Modal.Backdrop>
            <Modal.Container>
                <Modal.Dialog className="sm:max-w-[360px]">
                    {(renderProps) => (
                        <>
                            <Modal.Header>
                                <Modal.Heading>Delete user</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <DeleteUserBody user={user}/>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button intent="secondary" onPress={() => renderProps.close()}>
                                    Cancel
                                </Button>
                                <Button isDisabled={isLoading} intent="danger" onPress={() => handleSubmit(user.id, renderProps.close)}>Delete</Button>
                            </Modal.Footer>
                        </>
                    )}
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>
    )
}