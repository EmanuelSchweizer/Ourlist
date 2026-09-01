import { Avatar } from "@/components/ui/Avatar"
import { ActivityGroup, formatActivityDay } from "./groupActivity"

interface Props {
    group: ActivityGroup
    isCurrentUser: boolean
}

export const ActivityItem = ({ group, isCurrentUser }: Props) => (
    <li className="flex items-start gap-3">
        <Avatar name={group.userName} size="sm" className="shrink-0 mt-0.5" />
        <div className="min-w-0">
            <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{isCurrentUser ? "you" : group.userName}</span>{" "}
                {group.type === "added" ? "added" : "bought"} {group.itemNames.length}{" "}
                {group.itemNames.length === 1 ? "item" : "items"} {formatActivityDay(group.day)}
            </p>
            <p className="text-sm text-gray-500 truncate">{group.itemNames.join(", ")}</p>
        </div>
    </li>
)
