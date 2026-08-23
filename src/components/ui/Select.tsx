import { Select as HeroUISelect, Label, SelectProps } from "@heroui/react"
import { twMerge } from "tailwind-merge"

interface Props{
    label: string
}

export function Select<T extends object>({ children, className, label, ...rest }: SelectProps<T> & Readonly<{ children: React.ReactNode } & Props>) {
    return (
        <HeroUISelect
            {...rest}
            className={twMerge("w-full focus:ring-2 focus:ring-violet-700 focus:ring-offset-0", className as string | undefined)}
        >
            <Label>{label}</Label>
            <HeroUISelect.Trigger>
                <HeroUISelect.Value />
                <HeroUISelect.Indicator />
            </HeroUISelect.Trigger>
            <HeroUISelect.Popover>
                {children}
            </HeroUISelect.Popover>
        </HeroUISelect>
    )
}