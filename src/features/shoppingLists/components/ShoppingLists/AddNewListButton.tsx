import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@heroui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa6"
import { useAddShoppingList } from "../../hooks/ShoppingList/addShoppingList"

export const AddNewListButton = () => {
    const { handleSubmit: addShoppingList, isLoading } = useAddShoppingList()
    const [name, setName] = useState("")

    return (
        <Modal>
            <Button
                size="sm"
                isIconOnly
                intent="primary"
            >
                <FaPlus size={10} />
            </Button>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[360px]">
                        {(renderProps) => (
                            <>
                                <Modal.Header>
                                    <Modal.Heading>Create new List</Modal.Heading>
                                </Modal.Header>
                                <Modal.Body className="space-y-4 pt-5">
                                    <form id="create-list-form" onSubmit={(e) => addShoppingList(e, renderProps.close)}>
                                        <Input
                                            aria-label="name input"
                                            value={name}
                                            name="name"
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter list name..."
                                        />
                                    </form>
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
                                        isDisabled={isLoading || !name}
                                        intent="primary"
                                        form="create-list-form"
                                        type="submit"
                                    >
                                        Confirm
                                    </Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>)
}