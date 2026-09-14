import { Button } from "@/components/ui/Button"
import { useUnShareList } from "@/features/shoppingLists/hooks/SharedList/unShareList"
import { SharedUser } from "@/features/shoppingLists/types"
import { Popover } from "@heroui/react"
import { useState } from "react"
import { MdDeleteOutline } from "react-icons/md"

interface Props {
    listId: number
    user: SharedUser
    onRemoved: () => void
}

export const SharedUserRow = ({ listId, user, onRemoved }: Props) => {
    const { handleSubmit: unShareList, isLoading } = useUnShareList()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const handleRemove = () => {
        unShareList(listId, user.id, onRemoved)
        setIsConfirmOpen(false)
    }

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{user.name}</p>
                <p className="truncate text-sm text-slate-600">{user.email}</p>
            </div>
            <Popover isOpen={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <Popover.Trigger>
                    <Button
                        aria-label={`remove ${user.email} button`}
                        isIconOnly
                        size="sm"
                        intent="danger"
                        isDisabled={isLoading}
                    >
                        <MdDeleteOutline size={18} />
                    </Button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Dialog className="space-y-3 p-4">
                        <Popover.Heading>Remove participant?</Popover.Heading>
                        <p className="text-sm">
                            <span>{"Remove "}</span>
                            <span className="font-bold">{user.email}</span>
                            <span>{" from this list?"}</span>
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                aria-label="cancel remove button"
                                intent="secondary"
                                onPress={() => setIsConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                aria-label="confirm remove button"
                                intent="danger"
                                isDisabled={isLoading}
                                onPress={handleRemove}
                            >
                                Remove
                            </Button>
                        </div>
                    </Popover.Dialog>
                </Popover.Content>
            </Popover>
        </div>
    )
}
