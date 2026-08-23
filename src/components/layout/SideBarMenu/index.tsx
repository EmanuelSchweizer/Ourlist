import { Drawer } from "@heroui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/actions/logout";
import { IoLogOutOutline } from "react-icons/io5";
import { Button } from "../../ui/Button";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import { SideBarLinks } from "./Links";
import { SideBarHeader } from "./Header";

export function SideBarMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();

    const handleLogout = async () => {
        await logout()
        await signOut({ redirect: false });
        router.refresh();
        router.push("/signIn");
        setIsOpen(false)
    };

    return (
        <Drawer >
            <Button intent="secondary" onPress={() => setIsOpen(true)}>
                <FiMenu height={20} width={20} className="text-gray-900" />
            </Button>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
                <Drawer.Content placement="right">
                    <Drawer.Dialog>
                        <Drawer.Header>
                            <Drawer.Heading>
                                <SideBarHeader/>
                            </Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body>
                            <SideBarLinks setIsOpen={setIsOpen}/>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button
                                slot="close"
                                intent="secondary"
                                className="w-full justify-center gap-2 border-none bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => void handleLogout()}
                            >
                                <IoLogOutOutline height={20} width={20} />
                                Log out
                            </Button>
                        </Drawer.Footer>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    );
}