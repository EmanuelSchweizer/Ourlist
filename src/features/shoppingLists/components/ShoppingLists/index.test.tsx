import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import { ShoppingLists } from '.';
import { addShoppingList, getAllShoppingLists } from '../../actions';
import { ActionResult } from '@/lib/server/action';
import { ShoppingList } from '@/types';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import userEvent from '@testing-library/user-event';
import { showSuccessToast } from '@/components/ui/toast';
import { AddShoppingList } from '../../types';

jest.mock("next-auth/react");

jest.mock("../../actions", () => ({
    getAllShoppingLists: jest.fn(),
    addShoppingList: jest.fn()
}));

jest.mock("@/components/ui/toast", () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
    showWarningToast: jest.fn(),
}));

const mockGetAllShoppingLists = getAllShoppingLists as jest.Mock;
const mockUseSession = useSession as jest.Mock;
const mockAddShoppingList = addShoppingList as jest.Mock;

const mockShowSuccessToast = showSuccessToast as jest.Mock;

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
        render(<ShoppingLists />)

        await screen.findByText(/My Lists/i);
        expect(screen.getByText("MyExampleList")).toBeInTheDocument()
        expect(screen.getByText("OtherUsersList")).toBeInTheDocument()

        expect(screen.queryByText("No lists yet")).not.toBeInTheDocument()
    })

    it("creates successfully a new list", async () => {
        const user = userEvent.setup()
        mockGetAllShoppingLists.mockResolvedValue({ success: true, data: exampleShoppingLists } as ActionResult<ShoppingList[]>)
        mockAddShoppingList.mockResolvedValue({
            success: true, data: {
                id: 3,
                name: "MyNewList",
                updatedAt: new Date(),
                createdAt: new Date(),
                ownerEmail: "example@email.com",
                items: [],
                ownerId: 1,
                ownerName: "TestUser"
            }
        } as ActionResult<ShoppingList>)
        render(<ShoppingLists />)

        await screen.findByText(/My Lists/i);
        expect(screen.getByText("MyExampleList")).toBeInTheDocument()
        expect(screen.getByText("OtherUsersList")).toBeInTheDocument()

        expect(screen.queryByText("No lists yet")).not.toBeInTheDocument()
        expect(screen.queryByText("MyNewList")).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /Add new list/ }))
        await screen.findByText(/Create new List/i);

        const listNameInput = screen.getByPlaceholderText("Enter list name...")
        const confirmButton = screen.getByRole("button", { name: /confirm button/ })
        expect(listNameInput).toBeInTheDocument()
        expect(confirmButton).toBeInTheDocument()
        expect(confirmButton).toBeDisabled()

        await user.type(listNameInput, "MyNewList")

        expect(confirmButton).not.toBeDisabled()
        await user.click(confirmButton)
        await waitFor(() => expect(mockAddShoppingList).toHaveBeenCalledWith({ name: "MyNewList" } as AddShoppingList))
        expect(screen.getByText("MyNewList")).toBeInTheDocument()
    })
})