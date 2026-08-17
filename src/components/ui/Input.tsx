import { Input as HeroUIInput, InputProps } from "@heroui/react"

export const Input = (props: InputProps) => {

    return (
    <HeroUIInput
        type="submit"
        {...props}
        className={"w-full focus:ring-2 focus:ring-violet-700 focus:ring-offset-0"}
    />
    )
}