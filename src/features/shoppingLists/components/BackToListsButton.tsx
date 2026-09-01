"use client"

import { Button } from "@/components/ui/Button"
import { MdArrowBack } from "react-icons/md"
import { useShoppingListsStore } from "../store"

export const BackToListsButton = () => {
    const setSelectedListId = useShoppingListsStore((state) => state.setSelectedListId)

    return (
        <Button
            aria-label="back to lists button"
            isIconOnly
            size="lg"
            intent="secondary"
            className="sm:hidden block fixed bottom-20 left-4 z-50 shadow-lg"
            onPress={() => setSelectedListId(null)}
        >
            <div className="flex w-full items-center justify-center">
                <MdArrowBack size={20} />
            </div>
        </Button>
    )
}
