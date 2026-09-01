import { DefaultPageLayout } from "@/components/ui/DefaultPageLayout";
import { ListItems } from "@/features/shoppingLists/components/ListItems";
import { ShoppingLists } from "@/features/shoppingLists/components/ShoppingLists";

export default function Home() {
  return (
    <DefaultPageLayout className="flex w-full sm:max-w-4xl sm:mx-auto sm:my-10 sm:space-x-6 justify-center">
      <ShoppingLists />
      <ListItems />
    </DefaultPageLayout>
  );
}
