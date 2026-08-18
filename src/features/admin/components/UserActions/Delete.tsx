import { Button } from "@/components/ui/Button"
import { MdDeleteOutline } from "react-icons/md";

export const DeleteUser = () => {
    return (<Button size="sm" isIconOnly intent="danger">
        <MdDeleteOutline size={20} height={20} />
    </Button>)
}