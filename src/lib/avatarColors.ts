// Shared color-per-name assignment, used to keep Avatar initials and the
// PurchaseChart legend visually consistent for the same person.
export const AVATAR_COLOR_NAMES = [
    "red", "orange", "amber", "lime", "emerald", "teal",
    "cyan", "blue", "violet", "fuchsia", "pink", "rose",
] as const

export type AvatarColorName = typeof AVATAR_COLOR_NAMES[number]

const hashString = (value: string) => {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

export const getAvatarColorName = (name: string): AvatarColorName =>
    AVATAR_COLOR_NAMES[hashString(name) % AVATAR_COLOR_NAMES.length]
