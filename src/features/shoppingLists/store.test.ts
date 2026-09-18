import { ListItem, ShoppingList } from "@/types";
import { useShoppingListsStore } from "./store";

jest.mock("./actions", () => ({
    getAllShoppingLists: jest.fn(),
}));

const item = (id: number, name = `item ${id}`): ListItem => ({
    id,
    name,
    bought: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    listId: 1,
    createdByUser: { id: 1, name: "user" },
    boughtByUser: null,
    boughtAt: null,
});

const list = (items: ListItem[]): ShoppingList => ({
    id: 1,
    name: "list",
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 1,
    ownerName: "owner",
    ownerEmail: "owner@example.com",
    items,
});

describe("shopping list store: addListItem", () => {
    beforeEach(() => {
        useShoppingListsStore.setState({ shoppingLists: [list([])] });
    });

    it("appends a new item", () => {
        useShoppingListsStore.getState().addListItem(1, item(1));

        expect(useShoppingListsStore.getState().shoppingLists[0].items).toHaveLength(1);
    });

    it("does not add the same item twice (REST response and broadcast can both arrive)", () => {
        useShoppingListsStore.getState().addListItem(1, item(1));
        useShoppingListsStore.getState().addListItem(1, item(1));

        expect(useShoppingListsStore.getState().shoppingLists[0].items).toHaveLength(1);
    });

    it("replaces an existing item with the same id by the newer data", () => {
        useShoppingListsStore.getState().addListItem(1, item(1, "old"));
        useShoppingListsStore.getState().addListItem(1, item(1, "new"));

        const items = useShoppingListsStore.getState().shoppingLists[0].items;
        expect(items).toHaveLength(1);
        expect(items[0].name).toBe("new");
    });
});
