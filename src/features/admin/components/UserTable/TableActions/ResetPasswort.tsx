import { Button } from "@/components/ui/Button"
import { IoKeyOutline } from "react-icons/io5";

export const ResetUserPasswort = () => {
    return (<Button size="sm" isIconOnly intent="secondary">
        <IoKeyOutline size={20} height={20} />
    </Button>)
}