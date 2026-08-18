import { Button as HeroUIButton, ButtonProps } from "@heroui/react"
import { twMerge } from "tailwind-merge";

type Intent = "primary" | "secondary"

const BUTTON_STYLES: Record<Intent, string> = {
  primary: "bg-violet-700 hover:bg-violet-600 text-white font-semibold",
  secondary: "border border-slate-300 bg-slate-100 text-violet-700 ...",
} as const;

interface Props extends ButtonProps {
  intent?: Intent;
}

export const Button = ({ intent = "primary", className, ...rest }: Props) => {

  return (
    <HeroUIButton
      {...rest}
      className={twMerge(BUTTON_STYLES[intent], className as string | undefined)} />
  )
}