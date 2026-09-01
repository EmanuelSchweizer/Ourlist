import { Button } from "@/components/ui/Button"
import { Modal } from "@heroui/react"
import { FaChartPie } from "react-icons/fa";
import { ListActivity } from "../../ListActivity";


export const ShowListActivityButton = () => {
    return (<Modal>
        <Button
            aria-label="list activity button"
            isIconOnly
            size="sm"
            intent="secondary"
            className="opacity-100 transition-opacity"
        >
            <FaChartPie size={18} />
        </Button>
        <Modal.Backdrop>
            <Modal.Container>
                <Modal.Dialog>
                    {(renderProps) => (
                        <>
                            <Modal.Header>
                                <Modal.Heading>List Activity</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="space-y-4 pt-5">
                                <ListActivity/>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    aria-label="confirm button"
                                    intent="primary"
                                    onPress={() => renderProps.close()}
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