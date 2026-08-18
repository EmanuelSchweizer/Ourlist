
import { DefaultPageLayout } from "@/components/ui/DefaultPageLayout";
import { Users } from "@/features/admin/components/Users";

export default async function AdminPage() {
    return (<DefaultPageLayout>
        <Users/>
    </DefaultPageLayout>)
}
