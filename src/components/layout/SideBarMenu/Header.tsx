import { IoIosArrowForward } from "react-icons/io";
import { Button } from "../../ui/Button";
import { Avatar } from "../../ui/Avatar";
import { useSession } from "next-auth/react";

export const SideBarHeader = () => {
    const { data: session } = useSession();

    const userName = session?.user?.name?.trim()
    const userMail = session?.user?.email?.trim()

    return (<div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
            <Avatar name={userName ?? "?"} size="lg" className="shrink-0" />
            <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{userName}</p>
                <p className="truncate text-sm text-gray-500">{userMail}</p>
            </div>
        </div>
        <Button
            slot="close"
            intent="secondary"
            className="shrink-0 rounded-full border-none bg-transparent p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
            <IoIosArrowForward width={20} height={20} />
        </Button>
    </div>)
}