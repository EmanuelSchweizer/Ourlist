import { Button } from "@/components/ui/Button"
import { Modal } from "@heroui/react"

interface Props {
    listId: number
    listName: string
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const ShareListModal = ({ listId, listName, isOpen, setIsOpen }: Props) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[360px]">
                        {(renderProps) => (
                            <>
                                <Modal.Header>
                                    <Modal.Heading>Manage Participants</Modal.Heading>
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
                                        Close
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