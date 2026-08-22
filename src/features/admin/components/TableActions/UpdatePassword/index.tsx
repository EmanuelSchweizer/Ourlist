import { Button } from "@/components/ui/Button"
import { Modal } from "@heroui/react";
import { IoKeyOutline } from "react-icons/io5";
import { UpdatePasswordForm } from "./UpdatePasswordForm";
import { User } from "@/types";
import { useUpdateUserPassword } from "@/features/admin/hooks/updatePassword";

interface Props {
    user: User
}

export const UpdateUserPasswort = ({ user }: Props) => {
    const { handleSubmit, isLoading } = useUpdateUserPassword()

    return (
        <Modal>
            <Button size="sm" isIconOnly intent="secondary">
                <IoKeyOutline size={20} height={20} />
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
                                    <UpdatePasswordForm user={user} handleSubmit={handleSubmit} closeModal={renderProps.close} />
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