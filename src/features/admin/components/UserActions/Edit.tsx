import { Button } from "@/components/ui/Button"
import { FaRegEdit } from "react-icons/fa";

export const EditUser = () => {
    return (<Button size="sm" isIconOnly intent="secondary">
        <FaRegEdit size={20} height={20} />
    </Button>)
}