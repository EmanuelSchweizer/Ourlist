import { ShoppingList, UserSummary } from "@/types"

export type ActivityType = "added" | "bought"

export interface ActivityGroup {
    key: string
    userId: number
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

export const formatActivityDay = (day: Date) => {
    const today = startOfDay(new Date())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (day.getTime() === today.getTime()) return "today"
    if (day.getTime() === yesterday.getTime()) return "yesterday"
    return day.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export const groupActivity = (selectedList: ShoppingList): ActivityGroup[] => {
    const groups = new Map<string, ActivityGroup>()

    const addEvent = (user: UserSummary, date: Date, type: ActivityType, itemName: string) => {
        const day = startOfDay(date)
        const key = `${user.id}-${type}-${day.getTime()}`
        const existing = groups.get(key)
        if (existing) {
            existing.itemNames.push(itemName)
        } else {
            groups.set(key, { key, userId: user.id, userName: user.name, type, itemNames: [itemName], day })
        }
    }

    selectedList.items.forEach(item => {
        addEvent(item.createdByUser, new Date(item.createdAt), "added", item.name)
        if (item.bought && item.boughtByUser && item.boughtAt) {
            addEvent(item.boughtByUser, new Date(item.boughtAt), "bought", item.name)
        }
    })

    return Array.from(groups.values()).sort((a, b) => b.day.getTime() - a.day.getTime())
}
