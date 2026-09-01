import { DefaultPageLayout } from "@/components/ui/DefaultPageLayout";
import { SelectedList } from "@/features/shoppingLists/components/SelectedList";
import { ShoppingLists } from "@/features/shoppingLists/components/ShoppingLists";

export default function Home() {
  return (
    <DefaultPageLayout className="flex w-full justify-center space-x-3">
      <ShoppingLists />
      <SelectedList />
    </DefaultPageLayout>
  );
}
