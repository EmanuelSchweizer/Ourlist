import { deleteShoppingList, getAllShoppingLists, updateShoppingList, } from '@/features/shoppingLists/actions';
import { useShoppingListsStore } from '@/features/shoppingLists/store';
import { UpdateShoppingList } from '@/features/shoppingLists/types';
import { ShoppingList } from '@/types';
import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Home from './page';
import { ActionResult } from '@/lib/server/action';

jest.mock("next-auth/react");

jest.mock("@/features/shoppingLists/actions", () => ({
    getAllShoppingLists: jest.fn(),
    updateShoppingList: jest.fn(),
    addShoppingList: jest.fn(),
    deleteShoppingList: jest.fn()
}));

jest.mock("@/components/ui/toast", () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
    showWarningToast: jest.fn(),
}));

const mockGetAllShoppingLists = getAllShoppingLists as jest.Mock;
const mockUpdateShoppingList = updateShoppingList as jest.Mock;
const mockDeleteShoppingList = deleteShoppingList as jest.Mock;
const mockUseSession = useSession as jest.Mock;

const exampleShoppingLists: ShoppingList[] = [
    {
        id: 1,
        name: "MyExampleList",
        updatedAt: new Date(),
        createdAt: new Date(),
        ownerEmail: "example@email.com",
        items: [],
        ownerId: 1,
        ownerName: "TestUser"
    },
    {
        id: 2,
        name: "OtherUsersList",
        updatedAt: new Date(),
        createdAt: new Date(),
        ownerEmail: "otherUser@email.com",
        items: [],
        ownerId: 2,
        ownerName: "OtherUser"
    },
]

describe("ShoppingLists", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        useShoppingListsStore.setState({ shoppingLists: [], selectedListId: null });
        mockUseSession.mockReturnValue({
            data: {
                user:
                {
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

    it("renders successfully all lists", async () => {
        mockGetAllShoppingLists.mockResolvedValue({ success: true, data: exampleShoppingLists } as ActionResult<ShoppingList[]>)
        render(<Home />)

        await screen.findByText(/My Lists/i);
        expect(screen.getByText("MyExampleList")).toBeInTheDocument()
        expect(screen.getByText("OtherUsersList")).toBeInTheDocument()

        expect(screen.queryByText("No lists yet")).not.toBeInTheDocument()
    })

    it("shows the list clicked in ShoppingLists in SelectedList as well", async () => {
        const user = userEvent.setup()
        mockGetAllShoppingLists.mockResolvedValue({ success: true, data: exampleShoppingLists } as ActionResult<ShoppingList[]>)
        render(<Home />)

        await screen.findByText(/My Lists/i)
        expect(screen.queryByDisplayValue("MyExampleList")).not.toBeInTheDocument()

        await user.click(screen.getByText("MyExampleList"))

        expect(await screen.findByDisplayValue("MyExampleList")).toBeInTheDocument()
    })

    it("deletes the selected list successfully", async () => {
        const user = userEvent.setup()
        mockGetAllShoppingLists.mockResolvedValue({ success: true, data: exampleShoppingLists } as ActionResult<ShoppingList[]>)
        mockDeleteShoppingList.mockResolvedValue({ success: true, data: undefined } as ActionResult<void>)
        render(<Home />)

        await screen.findByText(/My Lists/i)
        await user.click(screen.getByText("MyExampleList"))
        await screen.findByDisplayValue("MyExampleList")

        await user.click(screen.getByRole("button", { name: /list options button/i }))
        await user.click(await screen.findByText(/Delete List/i))

        const confirmButton = await screen.findByRole("button", { name: /confirm button/i })
        await user.click(confirmButton)

        await waitFor(() => expect(mockDeleteShoppingList).toHaveBeenCalledWith(1))
        await waitFor(() => expect(screen.queryByText("MyExampleList")).not.toBeInTheDocument())
        expect(screen.queryByDisplayValue("MyExampleList")).not.toBeInTheDocument()
    })

    it("renames the list successfully", async () => {
        const user = userEvent.setup()
        mockGetAllShoppingLists.mockResolvedValue({ success: true, data: exampleShoppingLists } as ActionResult<ShoppingList[]>)
        mockUpdateShoppingList.mockResolvedValue({
            success: true, data: { ...exampleShoppingLists[0], name: "RenamedList" }
        } as ActionResult<ShoppingList>)
        render(<Home />)

        await screen.findByText(/My Lists/i)
        await user.click(screen.getByText("MyExampleList"))

        const nameInput = await screen.findByDisplayValue("MyExampleList")
        await user.clear(nameInput)
        await user.type(nameInput, "RenamedList")
        await user.tab()

        await waitFor(() => expect(mockUpdateShoppingList).toHaveBeenCalledWith({ listId: 1, name: "RenamedList" } as UpdateShoppingList))
        expect(await screen.findByDisplayValue("RenamedList")).toBeInTheDocument()
    })
})