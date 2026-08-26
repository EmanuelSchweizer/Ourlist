import { Button } from "@/components/ui/Button"
import { User } from "@/types";
import { Modal } from "@heroui/react";
import { FaRegEdit } from "react-icons/fa";
import { EditUserForm } from "./EditUserForm";
import { useUpdateUser } from "@/features/admin/hooks/updateUser";

interface Props {
    user: User
}

export const EditUser = ({ user }: Props) => {
    const { handleSubmit, isLoading } = useUpdateUser()

    return (
        <Modal>
            <Button
                aria-label="edit user button"
                size="sm"
                isIconOnly
                intent="secondary"
            >
                <FaRegEdit size={20} height={20} />
            </Button>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[360px]">
                        {(renderProps) => (
                            <>
                                <Modal.Header>
                                    <Modal.Heading>Edit user</Modal.Heading>
                                </Modal.Header>
                                <Modal.Body className="space-y-4 pt-5">
                                    <EditUserForm user={user} handleSubmit={handleSubmit} closeModal={renderProps.close} />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button intent="secondary" onPress={() => renderProps.close()}>
                                        Cancel
                                    </Button>
                                    <Button isDisabled={isLoading} intent="primary" form="edit-user-form" type="submit">Confirm</Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>)
}