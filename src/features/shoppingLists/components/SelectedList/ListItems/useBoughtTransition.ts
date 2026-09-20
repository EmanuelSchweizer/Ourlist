import { useLayoutEffect, useRef, useState } from "react"
import { ListItem } from "@/types"

const HOLD_MS = 2000
const LEAVE_MS = 300

type TransitionPhase = "pending" | "leaving"

export function useBoughtTransition(items: ListItem[]) {
    const [phases, setPhases] = useState<Record<number, TransitionPhase>>({})
    const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
    const prevBoughtRef = useRef<Record<number, boolean>>({})

    const clearTimer = (itemId: number) => {
        clearTimeout(timers.current[itemId])
        delete timers.current[itemId]
    }

    const removePhase = (itemId: number) => {
        setPhases((prev) => {
            if (!(itemId in prev)) return prev
            const next = { ...prev }
            delete next[itemId]
            return next
        })
    }

    const startTransition = (itemId: number) => {
        clearTimer(itemId)
        setPhases((prev) => ({ ...prev, [itemId]: "pending" }))
        timers.current[itemId] = setTimeout(() => {
            setPhases((prev) => ({ ...prev, [itemId]: "leaving" }))
            timers.current[itemId] = setTimeout(() => {
                removePhase(itemId)
            }, LEAVE_MS)
        }, HOLD_MS)
    }

    // Runs synchronously after the items list changes (before paint) so a
    // freshly-bought item never disappears from the DOM for a frame before
    // its hold/leave animation kicks in.
    useLayoutEffect(() => {
        const prevBought = prevBoughtRef.current
        const nextBought: Record<number, boolean> = {}

        items.forEach((item) => {
            nextBought[item.id] = item.bought
            const wasBought = prevBought[item.id] ?? item.bought

            if (!wasBought && item.bought) {
                startTransition(item.id)
            } else if (wasBought && !item.bought) {
                clearTimer(item.id)
                removePhase(item.id)
            }
        })

        prevBoughtRef.current = nextBought
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items])

    useLayoutEffect(() => () => {
        Object.keys(timers.current).forEach((key) => clearTimeout(timers.current[Number(key)]))
    }, [])

    return {
        isPending: (itemId: number) => phases[itemId] === "pending",
        isLeaving: (itemId: number) => phases[itemId] === "leaving",
    }
}
