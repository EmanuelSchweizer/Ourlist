import { Button } from "@/components/ui/Button"
import { User } from "@/types";
import { Modal } from "@heroui/react";
import { MdDeleteOutline } from "react-icons/md";
import { useDeleteUser } from "@/features/admin/hooks/deleteUser";

interface Props {
    user: User
}

export const DeleteUser = ({ user }: Props) => {
    const {handleSubmit, isLoading} = useDeleteUser()
    
    return (<Modal>
        <Button size="sm" isIconOnly intent="danger">
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
                                <p>
                                    Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be
                                    undone.
                                </p>
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