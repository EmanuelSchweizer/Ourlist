import { Button } from "@/components/ui/Button"
import { MdDeleteOutline } from "react-icons/md"
import { ShoppingList } from "@/types"
import { Popover } from "@heroui/react"
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react"
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface Props {
    list: ShoppingList
}

export const DeleteListOption = ({ list }: Props) => {
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    return (
        <>
            <Popover isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
                <DeleteConfirmModal listId={list.id} isOpen={modalOpen} setIsOpen={setModalOpen} />
                <Button
                    aria-label="delete list button"
                    isIconOnly
                    size="sm"
                    intent="secondary"
                    className="opacity-100 transition-opacity"
                >
                    <SlOptionsVertical size={18} />
                </Button>
                <Popover.Content placement="top" className={"p-0"}>
                    <Popover.Dialog className={"p-0"}>
                        <Button
                            aria-label="delete list button"
                            size="sm"
                            intent="danger"
                            onClick={() => {
                                setModalOpen(true)
                                setPopoverOpen(false)
                            }}
                        >
                            <MdDeleteOutline size={18} /> Delete List
                        </Button>
                    </Popover.Dialog>
                </Popover.Content>
            </Popover>
        </>
    )
}
