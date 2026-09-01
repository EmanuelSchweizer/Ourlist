import { DefaultPageLayout } from "@/components/ui/DefaultPageLayout";
import { SelectedList } from "@/features/shoppingLists/components/SelectedList";
import { ShoppingLists } from "@/features/shoppingLists/components/ShoppingLists";
import { ListActivity } from "@/features/shoppingLists/components/ListActivity";

export default function Home() {
  return (
    <DefaultPageLayout className="w-full sm:grid sm:grid-cols-3 gap-4">
      <ShoppingLists />
      <SelectedList />
      <div className="sm:block hidden">
        <ListActivity />
      </div>
    </DefaultPageLayout>
  );
}
