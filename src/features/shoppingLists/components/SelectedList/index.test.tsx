import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { SelectedList } from '.';
import { useShoppingListsStore } from '../../store';
import { addListItem, updateListItem, removeListItem } from '../../actions';
import { showErrorToast } from '@/components/ui/toast';
import { ShoppingList, ListItem } from '@/types';

jest.mock("next-auth/react");

jest.mock("@/features/shoppingLists/actions", () => ({
    getAllShoppingLists: jest.fn(),
    addShoppingList: jest.fn(),
    updateShoppingList: jest.fn(),
    deleteShoppingList: jest.fn(),
    addListItem: jest.fn(),
    updateListItem: jest.fn(),
    removeListItem: jest.fn(),
}));

jest.mock("@/components/ui/toast", () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
    showWarningToast: jest.fn(),
}));

const mockUseSession = useSession as jest.Mock;
const mockAddListItem = addListItem as jest.Mock;
const mockUpdateListItem = updateListItem as jest.Mock;
const mockRemoveListItem = removeListItem as jest.Mock;
const mockShowErrorToast = showErrorToast as jest.Mock;

const exampleItems: ListItem[] = [
    {
        id: 1,
        name: "Milk",
        bought: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        listId: 1,
        createdByUser: { id: 1, name: "TestUser" },
        boughtByUser: null,
        boughtAt: null,
    },
    {
        id: 2,
        name: "Bread",
        bought: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        listId: 1,
        createdByUser: { id: 1, name: "TestUser" },
        boughtByUser: { id: 1, name: "TestUser" },
        boughtAt: new Date(),
    },
]

const exampleShoppingList: ShoppingList = {
    id: 1,
    name: "MyExampleList",
    updatedAt: new Date(),
    createdAt: new Date(),
    ownerEmail: "example@email.com",
    items: exampleItems,
    ownerId: 1,
    ownerName: "TestUser"
}

describe("SelectedList", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        useShoppingListsStore.setState({ shoppingLists: [], selectedListId: null });
        mockUseSession.mockReturnValue({
            data: {
                user: {
                    id: "1",
                    name: "TestUser",
                    email: "example@email.com",
                    roleId: "2",
                    roleName: "admin"
                },
                expires: "999_999"
            } as Session,
            status: "authenticated"
        })
    })

    it("renders the items of the selected list", async () => {
        const user = userEvent.setup()
        useShoppingListsStore.setState({ shoppingLists: [exampleShoppingList], selectedListId: 1 })
        render(<SelectedList />)

        expect(screen.getByDisplayValue("Milk")).toBeInTheDocument()
        expect(screen.getByRole("checkbox", { name: /Mark Milk as bought/i })).not.toBeChecked()
        expect(screen.queryByText("No items yet")).not.toBeInTheDocument()

        // Bought items start out collapsed inside the "Bought" accordion.
        expect(screen.getByRole("button", { name: /Bought \(1\)/i })).toBeInTheDocument()
        await user.click(screen.getByRole("button", { name: /Bought \(1\)/i }))

        expect(screen.getByDisplayValue("Bread")).toBeInTheDocument()
        expect(screen.getByRole("checkbox", { name: /Mark Bread as bought/i })).toBeChecked()
    })

    it("shows a placeholder when the selected list has no items", () => {
        useShoppingListsStore.setState({ shoppingLists: [{ ...exampleShoppingList, items: [] }], selectedListId: 1 })
        render(<SelectedList />)

        expect(screen.getByText("No items yet")).toBeInTheDocument()
        expect(screen.queryByDisplayValue("Milk")).not.toBeInTheDocument()
    })

    it("adds a new item to the list", async () => {
        const user = userEvent.setup()
        mockAddListItem.mockResolvedValue({
            success: true, data: {
                id: 3,
                name: "Eggs",
                bought: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                listId: 1,
                createdByUser: { id: 1, name: "TestUser" },
                boughtByUser: null,
                boughtAt: null,
            }
        })
        useShoppingListsStore.setState({ shoppingLists: [exampleShoppingList], selectedListId: 1 })
        render(<SelectedList />)

        const newItemInput = screen.getByPlaceholderText("Enter new item...")
        await user.type(newItemInput, "Eggs")
        await user.click(screen.getByRole("button", { name: /add item button/i }))

        await waitFor(() => expect(mockAddListItem).toHaveBeenCalledWith({ listId: 1, name: "Eggs" }))
        expect(await screen.findByDisplayValue("Eggs")).toBeInTheDocument()
    })

    it("edits an item's name", async () => {
        const user = userEvent.setup()
        mockUpdateListItem.mockResolvedValue({
            success: true, data: { ...exampleItems[0], name: "Oat Milk" }
        })
        useShoppingListsStore.setState({ shoppingLists: [exampleShoppingList], selectedListId: 1 })
        render(<SelectedList />)

        const nameInput = screen.getByDisplayValue("Milk")
        await user.clear(nameInput)
        await user.type(nameInput, "Oat Milk")
        await user.tab()

        await waitFor(() => expect(mockUpdateListItem).toHaveBeenCalledWith({
            listId: 1, itemId: 1, name: "Oat Milk", bought: false
        }))
        expect(await screen.findByDisplayValue("Oat Milk")).toBeInTheDocument()
    })

    it("deletes an item", async () => {
        const user = userEvent.setup()
        mockRemoveListItem.mockResolvedValue({ success: true, data: undefined })
        useShoppingListsStore.setState({ shoppingLists: [exampleShoppingList], selectedListId: 1 })
        render(<SelectedList />)

        expect(screen.getByDisplayValue("Milk")).toBeInTheDocument()
        const [deleteMilkButton] = screen.getAllByRole("button", { name: /delete item button/i })
        await user.click(deleteMilkButton)

        await waitFor(() => expect(mockRemoveListItem).toHaveBeenCalledWith({ listId: 1, itemId: 1 }))
        await waitFor(() => expect(screen.queryByDisplayValue("Milk")).not.toBeInTheDocument())
        expect(screen.getByDisplayValue("Bread")).toBeInTheDocument()
    })

    it("marks an item as bought", async () => {
        const user = userEvent.setup()
        mockUpdateListItem.mockResolvedValue({
            success: true, data: { ...exampleItems[0], bought: true }
        })
        useShoppingListsStore.setState({ shoppingLists: [exampleShoppingList], selectedListId: 1 })
        render(<SelectedList />)

        await user.click(screen.getByRole("checkbox", { name: /Mark Milk as bought/i }))

        await waitFor(() => expect(mockUpdateListItem).toHaveBeenCalledWith({
            listId: 1, itemId: 1, name: "Milk", bought: true
        }))
        await waitFor(() => expect(screen.getByRole("checkbox", { name: /Mark Milk as bought/i })).toBeChecked())
    })

    it("checks the checkbox immediately and reverts it if marking as bought fails", async () => {
        const user = userEvent.setup()
        let resolveUpdate: (value: { success: false; message: string }) => void
        mockUpdateListItem.mockReturnValue(new Promise((resolve) => { resolveUpdate = resolve }))
        useShoppingListsStore.setState({ shoppingLists: [exampleShoppingList], selectedListId: 1 })
        render(<SelectedList />)

        await user.click(screen.getByRole("checkbox", { name: /Mark Milk as bought/i }))

        expect(screen.getByRole("checkbox", { name: /Mark Milk as bought/i })).toBeChecked()

        resolveUpdate!({ success: false, message: "Update failed." })

        await waitFor(() => expect(screen.getByRole("checkbox", { name: /Mark Milk as bought/i })).not.toBeChecked())
        expect(mockShowErrorToast).toHaveBeenCalledWith("Update failed.")
    })
})
