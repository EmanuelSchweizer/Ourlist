import { Button } from "@/components/ui/Button"
import { MdDeleteOutline } from "react-icons/md"
import { ShoppingList } from "@/types"
import { Dropdown, Label, Popover } from "@heroui/react"
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react"
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { FaUsers } from "react-icons/fa6";
import { ShareListModal } from "./ShareListModal";
import { useSession } from "next-auth/react";

interface Props {
    list: ShoppingList
}

export const OptionsButton = ({ list }: Props) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
    const [shareListModalOpen, setShareListModalOpen] = useState<boolean>(false)
    const session = useSession()
    const userIsListOwner = Number(session.data?.user.id) === list.ownerId

    return (
        <>
        <DeleteConfirmModal setIsOpen={setDeleteModalOpen} isOpen={deleteModalOpen} listId={list.id} listName={list.name}/>
        <ShareListModal setIsOpen={setShareListModalOpen} isOpen={shareListModalOpen} listId={list.id} listName={list.name}/>
            <Dropdown>
                <Button
                    aria-label="list options button"
                    isIconOnly
                    size="sm"
                    intent="secondary"
                    className="opacity-100 transition-opacity"
                >
                    <SlOptionsVertical size={18} />
                </Button>
                <Dropdown.Popover>
                    <Dropdown.Menu onAction={(key) => key.toString() === "delete-list" ? setDeleteModalOpen(true) : setShareListModalOpen(true)}>
                        {userIsListOwner && <Dropdown.Item id="manage-participants" textValue="Manage participants">
                            <FaUsers size={18} />
                            <Label>Manage Participants</Label>
                        </Dropdown.Item>}
                        <Dropdown.Item id="delete-list" textValue="Delete list" variant="danger">
                            <MdDeleteOutline size={18} className="text-red-400"/>
                            <Label>Delete List</Label>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
        </>
    )
}
