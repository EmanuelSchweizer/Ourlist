import { IoListOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import { SideBarLink } from "./Link"
import { useSession } from "next-auth/react";

interface Props{
    setIsOpen: (value: boolean) => void
}

export const SideBarLinks = ({setIsOpen}: Props) => {
    const { data: session } = useSession();
    
    const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin === true;

    return (<nav className="space-y-1">
        <SideBarLink setIsOpen={setIsOpen} href="/" Icon={IoListOutline} title="Shopping Lists"/>
        {isAdmin && (
        <SideBarLink setIsOpen={setIsOpen} href="/admin" Icon={IoShieldCheckmarkOutline} title="Admin Panel"/>
        )}
    </nav>)
}