import { Input as HeroUIInput, InputProps, Label } from "@heroui/react"
import { twMerge } from "tailwind-merge"

interface Props {
    label?: string
}

export const Input = ({ className, label, ...rest }: InputProps & Props) => {

    return (<>
        <Label>{label}</Label>
        <HeroUIInput
            {...rest}
            className={twMerge("w-full focus:ring-2 focus:ring-violet-700 focus:ring-offset-0", className as string | undefined)}
        />
    </>
    )
}