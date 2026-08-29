import { ShoppingLists } from "@/features/shoppingLists/components/ShoppingLists";

export default function Home() {
  return (
    <main className="w-full">
      <div className="container mx-auto sm:py-3 lg:py-6 xl:py-8 w-full md:max-w-175">
        <ShoppingLists/>
      </div>
    </main>
  );
}
