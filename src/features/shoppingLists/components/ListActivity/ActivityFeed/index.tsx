"use client"

import { useSession } from "next-auth/react"
import { ShoppingList } from "@/types"
import { groupActivity } from "./groupActivity"
import { ActivityItem } from "./ActivityItem"

interface Props {
    selectedList: ShoppingList
}

export const ActivityFeed = ({ selectedList }: Props) => {
    const session = useSession()
    const userId = Number(session.data?.user.id)

    const groups = groupActivity(selectedList)

    return (
        <div className="min-w-0 sm:shrink-0 rounded-2xl bg-white p-4 sm:h-full sm:flex sm:flex-col sm:min-h-0">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 sm:shrink-0">Activity</h3>
            <ul className="space-y-3 sm:flex-1 sm:min-h-0 overflow-y-auto max-h-[210px] sm:max-h-none">
                {groups.length === 0 ?
                    <div className="flex-1 flex items-center justify-center text-sm text-gray-400 h-full">
                        No items yet
                    </div> :
                    groups.map(group => (
                        <ActivityItem key={group.key} group={group} isCurrentUser={group.userId === userId} />
                    ))}
            </ul>
        </div>
    )
}
