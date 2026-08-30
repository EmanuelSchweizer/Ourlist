import { DefaultPageLayout } from "@/components/ui/DefaultPageLayout";
import { ShoppingLists } from "@/features/shoppingLists/components/ShoppingLists";

export default function Home() {
  return (
    <DefaultPageLayout>
      <ShoppingLists />
    </DefaultPageLayout>
  );
}
