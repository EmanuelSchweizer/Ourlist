import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useShareList } from "@/features/shoppingLists/hooks/SharedList/shareList"
import { useState } from "react"

interface Props {
    listId: number
    onShared: () => void
}

export const AddParticipantForm = ({ listId, onShared }: Props) => {
    const { handleSubmit: shareList, isLoading } = useShareList()
    const [email, setEmail] = useState("")

    const handleShare = () => {
        if (!email.trim()) return
        shareList(listId, email.trim(), () => {
            setEmail("")
            onShared()
        })
    }

    return (
        <div className="flex items-end gap-2">
            <div className="flex-1">
                <Input
                    aria-label="participant email input"
                    label="Add participant"
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleShare()}
                />
            </div>
            <Button
                aria-label="share list button"
                isDisabled={isLoading || !email.trim()}
                onPress={handleShare}
            >
                Share
            </Button>
        </div>
    )
}
