import { Button } from "@/components/ui/Button"
import { useRemoveShoppingList } from "@/features/shoppingLists/hooks/ListItems/removeShoppingList"
import { Modal } from "@heroui/react"

interface Props{
    listId: number
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const DeleteConfirmModal = ({listId, isOpen, setIsOpen}: Props) => {
    const { handleSubmit: removeShoppingList, isLoading } = useRemoveShoppingList()

    return (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[360px]">
                        {(renderProps) => (
                            <>
                                <Modal.Header>
                                    <Modal.Heading>Create new List</Modal.Heading>
                                </Modal.Header>
                                <Modal.Body className="space-y-4 pt-5">

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        aria-label="cancel button"
                                        intent="secondary"
                                        onPress={() => renderProps.close()}
                                        type="submit"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        aria-label="confirm button"
                                        isDisabled={isLoading}
                                        intent="danger"
                                        onPress={() => removeShoppingList(listId)}
                                    >
                                        Delete
                                    </Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}