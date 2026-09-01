import { DefaultPageLayout } from "@/components/ui/DefaultPageLayout";
import { SelectedList } from "@/features/shoppingLists/components/SelectedList";
import { ShoppingLists } from "@/features/shoppingLists/components/ShoppingLists";

export default function Home() {
  return (
    <DefaultPageLayout className="flex w-full sm:max-w-4xl sm:mx-auto sm:my-10 sm:space-x-6 justify-center">
      <ShoppingLists />
      <SelectedList />
    </DefaultPageLayout>
  );
}
