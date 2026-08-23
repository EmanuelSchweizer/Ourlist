import { IoIosArrowForward } from "react-icons/io";
import { Button } from "../../ui/Button";
import { useSession } from "next-auth/react";

export const SideBarHeader = () => {
    const { data: session } = useSession();

    const userName = session?.user?.name?.trim()
    const userMail = session?.user?.email?.trim()
    const initials = userName
        ? userName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()
        : "?"

    return (<div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                {initials}
            </div>
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