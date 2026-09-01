import { twMerge } from "tailwind-merge"

type Size = "sm" | "md" | "lg"

interface Props {
    name: string
    size?: Size
    className?: string
}

const AVATAR_COLORS = [
    "bg-red-100 text-red-700",
    "bg-orange-100 text-orange-700",
    "bg-amber-100 text-amber-700",
    "bg-lime-100 text-lime-700",
    "bg-emerald-100 text-emerald-700",
    "bg-teal-100 text-teal-700",
    "bg-cyan-100 text-cyan-700",
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-pink-100 text-pink-700",
    "bg-rose-100 text-rose-700",
] as const

const SIZE_STYLES: Record<Size, string> = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-11 h-11 text-base",
} as const

const hashString = (value: string) => {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

export const Avatar = ({ name, size = "md", className }: Props) => {
    const initial = name.trim().charAt(0).toUpperCase()
    const color = AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length]

    return (
        <span
            title={name}
            className={twMerge(
                "inline-flex items-center justify-center rounded-full font-semibold select-none",
                SIZE_STYLES[size],
                color,
                className
            )}
        >
            {initial}
        </span>
    )
}
