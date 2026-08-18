import { Input as HeroUIInput, InputProps } from "@heroui/react"
import { twMerge } from "tailwind-merge"

export const Input = ({className, ...rest }: InputProps) => {

    return (
    <HeroUIInput
        {...rest}
        className={twMerge("w-full focus:ring-2 focus:ring-violet-700 focus:ring-offset-0", className as string | undefined)}
    />
    )
}