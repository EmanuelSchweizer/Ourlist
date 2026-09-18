import { ShoppingList } from "@/types"
import { AvatarColorName, getAvatarColorName } from "@/lib/avatarColors"

export interface PurchaseSegment {
    key: string
    label: string
    count: number
    color: string
}

// Same hue per person as their Avatar (see lib/avatarColors) — solid swatch
// instead of the avatar's pastel bg, since this fills an SVG stroke.
const AVATAR_COLOR_HEX: Record<AvatarColorName, string> = {
    red: "#ef4444",
    orange: "#f97316",
    amber: "#f59e0b",
    lime: "#84cc16",
    emerald: "#10b981",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    blue: "#3b82f6",
    violet: "#8b5cf6",
    fuchsia: "#d946ef",
    pink: "#ec4899",
    rose: "#f43f5e",
}

// Buyers beyond this count fold into "Others" so the legend stays readable.
const MAX_INDIVIDUAL_BUYERS = 4
const OTHERS_COLOR = "#008300"
const UNBOUGHT_COLOR = "#6b7280"

export const computePurchaseBreakdown = (selectedList: ShoppingList): PurchaseSegment[] => {
    const boughtByBuyer = new Map<number, { name: string; count: number }>()
    let unboughtCount = 0

    selectedList.items.forEach(item => {
        if (item.bought && item.boughtByUser) {
            const existing = boughtByBuyer.get(item.boughtByUser.id)
            if (existing) {
                existing.count += 1
            } else {
                boughtByBuyer.set(item.boughtByUser.id, { name: item.boughtByUser.name, count: 1 })
            }
        } else {
            unboughtCount += 1
        }
    })

    const buyers = Array.from(boughtByBuyer.entries())
        .sort(([a], [b]) => a - b)
        .map(([id, value]) => ({ id, ...value }))

    const segments: PurchaseSegment[] = buyers.slice(0, MAX_INDIVIDUAL_BUYERS).map(buyer => ({
        key: `buyer-${buyer.id}`,
        label: buyer.name,
        count: buyer.count,
        color: AVATAR_COLOR_HEX[getAvatarColorName(buyer.name)],
    }))

    const overflowBuyers = buyers.slice(MAX_INDIVIDUAL_BUYERS)
    if (overflowBuyers.length > 0) {
        segments.push({
            key: "others",
            label: "Others",
            count: overflowBuyers.reduce((sum, b) => sum + b.count, 0),
            color: OTHERS_COLOR,
        })
    }

    if (unboughtCount > 0) {
        segments.push({ key: "unbought", label: "Not bought yet", count: unboughtCount, color: UNBOUGHT_COLOR })
    }

    return segments
}
