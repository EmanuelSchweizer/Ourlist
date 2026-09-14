import { Button } from "@/components/ui/Button"
import { useGetSharedUserList } from "@/features/shoppingLists/hooks/SharedList/getSharedUserList"
import { Modal } from "@heroui/react"
import { useEffect } from "react"
import { AddParticipantForm } from "./AddParticipantForm"
import { SharedUserRow } from "./SharedUserRow"

interface Props {
    listId: number
    listName: string
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const ShareListModal = ({ listId, listName, isOpen, setIsOpen }: Props) => {
    const { sharedUsers, handleSubmit: fetchSharedUsers, isLoading } = useGetSharedUserList()

    useEffect(() => {
        if (isOpen) fetchSharedUsers(listId)
    }, [isOpen, listId, fetchSharedUsers])

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
                                <Modal.Body className="space-y-5 pt-2">
                                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">List</p>
                                        <p className="truncate font-semibold text-slate-900">{listName}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Participants</p>
                                        <div className="space-y-2">
                                            {isLoading ? (
                                                <p className="text-sm text-slate-500">Loading participants...</p>
                                            ) : sharedUsers.length === 0 ? (
                                                <p className="text-sm text-slate-500">No participants yet.</p>
                                            ) : (
                                                sharedUsers.map((user) => (
                                                    <SharedUserRow
                                                        key={user.id}
                                                        listId={listId}
                                                        user={user}
                                                        onRemoved={() => fetchSharedUsers(listId)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200 pt-4">
                                        <AddParticipantForm
                                            listId={listId}
                                            onShared={() => fetchSharedUsers(listId)}
                                        />
                                    </div>
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
