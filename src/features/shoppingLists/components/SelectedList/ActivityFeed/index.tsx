"use client"

import { useSession } from "next-auth/react"
import { ShoppingList, UserSummary } from "@/types"
import { Avatar } from "@/components/ui/Avatar"

interface Props {
    selectedList: ShoppingList
}

type ActivityType = "added" | "bought"

interface ActivityGroup {
    key: string
    userName: string
    type: ActivityType
    itemNames: string[]
    day: Date
}

const startOfDay = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

const formatDay = (day: Date) => {
    const today = startOfDay(new Date())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (day.getTime() === today.getTime()) return "today"
    if (day.getTime() === yesterday.getTime()) return "yesterday"
    return day.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export const ActivityFeed = ({ selectedList }: Props) => {
    const session = useSession()
    const isUserListOwner = Number(session.data?.user.id) === selectedList.ownerId

    const participantIds = new Set<number>([selectedList.ownerId])
    selectedList.items.forEach(item => {
        participantIds.add(item.createdByUser.id)
        if (item.boughtByUser) participantIds.add(item.boughtByUser.id)
    })
    // A list counts as shared if it isn't ours (we only see those we have access to)
    // or if items were created/bought by more than one user.
    const isShared = !isUserListOwner || participantIds.size > 1

    if (!isShared) return null

    const groups = new Map<string, ActivityGroup>()

    const addEvent = (user: UserSummary, date: Date, type: ActivityType, itemName: string) => {
        const day = startOfDay(date)
        const key = `${user.id}-${type}-${day.getTime()}`
        const existing = groups.get(key)
        if (existing) {
            existing.itemNames.push(itemName)
        } else {
            groups.set(key, { key, userName: user.name, type, itemNames: [itemName], day })
        }
    }

    selectedList.items.forEach(item => {
        addEvent(item.createdByUser, new Date(item.createdAt), "added", item.name)
        if (item.bought && item.boughtByUser && item.boughtAt) {
            addEvent(item.boughtByUser, new Date(item.boughtAt), "bought", item.name)
        }
    })

    const sortedGroups = Array.from(groups.values()).sort((a, b) => b.day.getTime() - a.day.getTime())

    if (sortedGroups.length === 0) return null

    return (
        <div className="w-full sm:w-72 sm:shrink-0 rounded-2xl bg-white p-4 sm:h-full sm:flex sm:flex-col sm:min-h-0">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 sm:shrink-0">Activity</h3>
            <ul className="space-y-3 sm:flex-1 sm:min-h-0 sm:overflow-y-auto">
                {sortedGroups.map(group => (
                    <li key={group.key} className="flex items-start gap-3">
                        <Avatar name={group.userName} size="sm" className="shrink-0 mt-0.5" />
                        <div className="min-w-0">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium text-gray-900">{group.userName}</span>{" "}
                                {group.type === "added" ? "added" : "bought"} {group.itemNames.length}{" "}
                                {group.itemNames.length === 1 ? "item" : "items"} {formatDay(group.day)}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{group.itemNames.join(", ")}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
