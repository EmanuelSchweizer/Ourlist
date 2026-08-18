
import { DefaultPageLayout } from "@/components/ui/DefaultPageLayout";
import { UserTable } from "../../features/admin/components/UserTable";

export default function AdminPage(){
    return(<DefaultPageLayout>
        <UserTable/>
    </DefaultPageLayout>)
    }
