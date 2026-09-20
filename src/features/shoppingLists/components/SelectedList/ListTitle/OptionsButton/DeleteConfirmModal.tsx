import { Button } from "@/components/ui/Button"
import { useRemoveShoppingList } from "@/features/shoppingLists/hooks/ShoppingList/removeShoppingList"
import { Modal } from "@heroui/react"

interface Props{
    listId: number
    listName: string
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const DeleteConfirmModal = ({listId, isOpen, setIsOpen, listName}: Props) => {
    const { handleSubmit: removeShoppingList, isLoading } = useRemoveShoppingList()

    return (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[360px]">
                        {(renderProps) => (
                            <>
                                <Modal.Header>
                                    <Modal.Heading>Delete List?</Modal.Heading>
                                </Modal.Header>
                                <Modal.Body className="space-y-4 pt-5">
                                    <p>
                                        <span>{"Are you sure to delete the list "}</span>
                                        <span className="font-bold">{listName}</span>
                                        <span>{"?"}</span>
                                    </p>
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