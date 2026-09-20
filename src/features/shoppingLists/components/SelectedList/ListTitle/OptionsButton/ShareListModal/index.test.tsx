import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareListModal } from '.';
import { getSharedUserList, shareList, unShareList } from '@/features/shoppingLists/actions';
import { ActionResult } from '@/lib/server/action';
import { SharedUser, SharedUserList } from '@/features/shoppingLists/types';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast';

jest.mock("@/features/shoppingLists/actions", () => ({
    getSharedUserList: jest.fn(),
    shareList: jest.fn(),
    unShareList: jest.fn(),
}));

jest.mock("@/components/ui/toast", () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
    showWarningToast: jest.fn(),
}));

const mockGetSharedUserList = getSharedUserList as jest.Mock;
const mockShareList = shareList as jest.Mock;
const mockUnShareList = unShareList as jest.Mock;
const mockShowSuccessToast = showSuccessToast as jest.Mock;
const mockShowErrorToast = showErrorToast as jest.Mock;

const exampleSharedUsers: SharedUser[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
]

const setIsOpen = jest.fn()

describe("ShareListModal", () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("displays the shared users returned by getSharedUserList", async () => {
        mockGetSharedUserList.mockResolvedValue({
            success: true,
            data: { listId: 1, sharedUsers: exampleSharedUsers },
        } as ActionResult<SharedUserList>)

        render(<ShareListModal listId={1} listName="Groceries" isOpen setIsOpen={setIsOpen} />)

        await waitFor(() => expect(mockGetSharedUserList).toHaveBeenCalledWith(1))
        expect(await screen.findByText("Alice")).toBeInTheDocument()
        expect(screen.getByText("alice@example.com")).toBeInTheDocument()
        expect(screen.getByText("Bob")).toBeInTheDocument()
        expect(screen.getByText("bob@example.com")).toBeInTheDocument()
        expect(screen.queryByText("No participants yet.")).not.toBeInTheDocument()
    })

    it("shows a 'no participants' message when the shared user list is empty", async () => {
        mockGetSharedUserList.mockResolvedValue({
            success: true,
            data: { listId: 1, sharedUsers: [] },
        } as ActionResult<SharedUserList>)

        render(<ShareListModal listId={1} listName="Groceries" isOpen setIsOpen={setIsOpen} />)

        expect(await screen.findByText("No participants yet.")).toBeInTheDocument()
    })

    it("shares the list with a new participant and refreshes the list", async () => {
        const user = userEvent.setup()
        mockGetSharedUserList
            .mockResolvedValueOnce({ success: true, data: { listId: 1, sharedUsers: [] } } as ActionResult<SharedUserList>)
            .mockResolvedValueOnce({ success: true, data: { listId: 1, sharedUsers: exampleSharedUsers } } as ActionResult<SharedUserList>)
        mockShareList.mockResolvedValue({ success: true, data: undefined } as ActionResult<void>)

        render(<ShareListModal listId={1} listName="Groceries" isOpen setIsOpen={setIsOpen} />)
        await screen.findByText("No participants yet.")

        const emailInput = screen.getByPlaceholderText("example@example.com")
        const shareButton = screen.getByRole("button", { name: /share list button/ })
        expect(shareButton).toBeDisabled()

        await user.type(emailInput, "alice@example.com")
        expect(shareButton).toBeEnabled()
        await user.click(shareButton)

        await waitFor(() => expect(mockShareList).toHaveBeenCalledWith({ listId: 1, email: "alice@example.com" }))
        await waitFor(() => expect(mockGetSharedUserList).toHaveBeenCalledTimes(2))
        expect(mockShowSuccessToast).toHaveBeenCalled()
        expect(emailInput).toHaveValue("")
        expect(await screen.findByText("Alice")).toBeInTheDocument()
    })

    it("shows an error toast and does not refresh the list when sharing fails", async () => {
        const user = userEvent.setup()
        mockGetSharedUserList.mockResolvedValue({
            success: true,
            data: { listId: 1, sharedUsers: [] },
        } as ActionResult<SharedUserList>)
        mockShareList.mockResolvedValue({ success: false, message: "No user with this email exists." } as ActionResult<void>)

        render(<ShareListModal listId={1} listName="Groceries" isOpen setIsOpen={setIsOpen} />)
        await screen.findByText("No participants yet.")

        await user.type(screen.getByPlaceholderText("example@example.com"), "unknown@example.com")
        await user.click(screen.getByRole("button", { name: /share list button/ }))

        await waitFor(() => expect(mockShowErrorToast).toHaveBeenCalledWith("No user with this email exists."))
        expect(mockGetSharedUserList).toHaveBeenCalledTimes(1)
    })

    it("removes a participant after confirming in the popover", async () => {
        const user = userEvent.setup()
        mockGetSharedUserList
            .mockResolvedValueOnce({ success: true, data: { listId: 1, sharedUsers: exampleSharedUsers } } as ActionResult<SharedUserList>)
            .mockResolvedValueOnce({ success: true, data: { listId: 1, sharedUsers: [exampleSharedUsers[1]] } } as ActionResult<SharedUserList>)
        mockUnShareList.mockResolvedValue({ success: true, data: undefined } as ActionResult<void>)

        render(<ShareListModal listId={1} listName="Groceries" isOpen setIsOpen={setIsOpen} />)
        await screen.findByText("Alice")

        await user.click(screen.getByRole("button", { name: "remove alice@example.com button" }))
        expect(await screen.findByText("Remove participant?")).toBeInTheDocument()
        expect(mockUnShareList).not.toHaveBeenCalled()

        await user.click(screen.getByRole("button", { name: /confirm remove button/ }))

        await waitFor(() => expect(mockUnShareList).toHaveBeenCalledWith({ listId: 1, sharedUserId: 1 }))
        await waitFor(() => expect(mockGetSharedUserList).toHaveBeenCalledTimes(2))
        expect(mockShowSuccessToast).toHaveBeenCalled()
        await waitFor(() => expect(screen.queryByText("Alice")).not.toBeInTheDocument())
    })

    it("does not remove a participant when the confirmation popover is cancelled", async () => {
        const user = userEvent.setup()
        mockGetSharedUserList.mockResolvedValue({
            success: true,
            data: { listId: 1, sharedUsers: exampleSharedUsers },
        } as ActionResult<SharedUserList>)

        render(<ShareListModal listId={1} listName="Groceries" isOpen setIsOpen={setIsOpen} />)
        await screen.findByText("Alice")

        await user.click(screen.getByRole("button", { name: "remove alice@example.com button" }))
        await screen.findByText("Remove participant?")

        await user.click(screen.getByRole("button", { name: /cancel remove button/ }))

        expect(mockUnShareList).not.toHaveBeenCalled()
        expect(screen.getByText("Alice")).toBeInTheDocument()
    })

    it("shows an error toast when removing a participant fails", async () => {
        const user = userEvent.setup()
        mockGetSharedUserList.mockResolvedValue({
            success: true,
            data: { listId: 1, sharedUsers: exampleSharedUsers },
        } as ActionResult<SharedUserList>)
        mockUnShareList.mockResolvedValue({ success: false, message: "Removal failed." } as ActionResult<void>)

        render(<ShareListModal listId={1} listName="Groceries" isOpen setIsOpen={setIsOpen} />)
        await screen.findByText("Alice")

        await user.click(screen.getByRole("button", { name: "remove alice@example.com button" }))
        await user.click(screen.getByRole("button", { name: /confirm remove button/ }))

        await waitFor(() => expect(mockShowErrorToast).toHaveBeenCalledWith("Removal failed."))
        expect(mockGetSharedUserList).toHaveBeenCalledTimes(1)
        expect(screen.getByText("Alice")).toBeInTheDocument()
    })
})
