import { twMerge } from "tailwind-merge"
import { AvatarColorName, getAvatarColorName } from "@/lib/avatarColors"

type Size = "sm" | "md" | "lg"

interface Props {
    name: string
    size?: Size
    className?: string
}

const AVATAR_COLOR_CLASSES: Record<AvatarColorName, string> = {
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    amber: "bg-amber-100 text-amber-700",
    lime: "bg-lime-100 text-lime-700",
    emerald: "bg-emerald-100 text-emerald-700",
    teal: "bg-teal-100 text-teal-700",
    cyan: "bg-cyan-100 text-cyan-700",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    fuchsia: "bg-fuchsia-100 text-fuchsia-700",
    pink: "bg-pink-100 text-pink-700",
    rose: "bg-rose-100 text-rose-700",
} as const

const SIZE_STYLES: Record<Size, string> = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-11 h-11 text-base",
} as const

export const Avatar = ({ name, size = "md", className }: Props) => {
    const initial = name.trim().charAt(0).toUpperCase()
    const color = AVATAR_COLOR_CLASSES[getAvatarColorName(name)]

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
