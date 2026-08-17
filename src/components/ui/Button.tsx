import { Button as HeroUIButton, ButtonProps } from "@heroui/react"

type Intent = "primary" | "secondary"

const BUTTON_STYLES: Record<Intent, string> = {
  primary: "w-full bg-violet-700 hover:bg-violet-600 text-white font-semibold",
  secondary: "w-full border border-slate-300 bg-slate-100 ...",
} as const;

interface Props extends ButtonProps{
  intent?: Intent;
}

export const Button = ({ intent = "primary", className, ...rest }: Props) => {

    return (
    <HeroUIButton
        type="submit"
        {...rest}
        className={BUTTON_STYLES[intent]}
    />
    )
}