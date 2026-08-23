import { Url } from "next/dist/shared/lib/router/router"
import Link from "next/link"
import { IconType } from "react-icons"

interface Props{
    setIsOpen: (value: boolean) => void,
    Icon: IconType,
    href: Url,
    title: string
}

export const SideBarLink = ({setIsOpen, Icon, href, title}: Props) =>{
    return(<Link
            slot="close"
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-violet-50 hover:text-violet-700"
            onClick={() => setIsOpen(false)}
        >
            <Icon height={20} width={20} />
            {title}
        </Link>)
}