import { useSession } from "next-auth/react"
import { ShoppingList } from "@/types"
import { computePurchaseBreakdown } from "./computePurchaseBreakdown"

interface Props {
    selectedList: ShoppingList
}

const RADIUS = 54
const STROKE = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const VIEWBOX_SIZE = (RADIUS + STROKE / 2) * 2
const GAP = 3

export const PurchaseChart = ({ selectedList }: Props) => {
    const session = useSession()
    const userId = Number(session.data?.user.id)

    const segments = computePurchaseBreakdown(selectedList)
    const totalItems = selectedList.items.length
    const boughtCount = selectedList.items.filter(i => i.bought).length

    const arcs = segments.reduce<{ cumulative: number; items: { segment: typeof segments[number]; length: number; offset: number }[] }>(
        (acc, segment) => {
            const rawLength = (segment.count / totalItems) * CIRCUMFERENCE
            const length = Math.max(rawLength - GAP, 0)
            return {
                cumulative: acc.cumulative + rawLength,
                items: [...acc.items, { segment, length, offset: -acc.cumulative }],
            }
        },
        { cumulative: 0, items: [] }
    ).items

    return (
        <div className="w-full rounded-2xl bg-white sm:p-4 sm:h-full sm:flex sm:flex-col sm:min-h-0">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 sm:shrink-0">Purchases</h3>
            {totalItems === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                    No items yet
                </div>
            ) : (
                <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 sm:overflow-y-auto">
                    <div className="relative shrink-0 w-36 h-36">
                        <svg
                            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
                            className="w-full h-full -rotate-90"
                        >
                            <circle
                                cx={VIEWBOX_SIZE / 2}
                                cy={VIEWBOX_SIZE / 2}
                                r={RADIUS}
                                fill="none"
                                stroke="#e1e0d9"
                                strokeWidth={STROKE}
                            />
                            {arcs.map(({ segment, length, offset }) => (
                                <circle
                                    key={segment.key}
                                    cx={VIEWBOX_SIZE / 2}
                                    cy={VIEWBOX_SIZE / 2}
                                    r={RADIUS}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth={STROKE}
                                    strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                                    strokeDashoffset={offset}
                                >
                                    <title>{`${segment.label}: ${segment.count} item${segment.count === 1 ? "" : "s"}`}</title>
                                </circle>
                            ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-gray-900">{boughtCount}/{totalItems}</span>
                            <span className="text-xs text-gray-500">bought</span>
                        </div>
                    </div>

                    <ul className="w-full flex flex-wrap justify-center gap-x-4 gap-y-1.5 sm:shrink-0">
                        {segments.map(segment => (
                            <li key={segment.key} className="flex items-center gap-1.5 text-sm text-gray-700">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
                                <span className="truncate max-w-32">
                                    {segment.key === `buyer-${userId}` ? "You" : segment.label}
                                </span>
                                <span className="text-gray-400">{segment.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
