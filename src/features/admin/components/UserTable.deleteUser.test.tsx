import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { deleteUser } from "../actions"
import { screen, render, within, waitFor } from '@testing-library/react';
import { UserTable } from './UserTable';
import { Role, User } from '@/types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { getRoles } from '@/features/roles/api';
import { DeleteUser } from '../types';
import { showErrorToast, showSuccessToast, showWarningToast } from '@/components/ui/toast';
import { ActionResult } from '@/lib/server/action';

jest.mock("next/navigation");
jest.mock("next-auth/react");

jest.mock("../actions", () => ({
    deleteUser: jest.fn(),
    updatePassword: jest.fn(),
    updateUser: jest.fn(),
}));

jest.mock("@/features/roles/api", () => ({
    getRoles: jest.fn(),
}));

jest.mock("@/components/ui/toast", () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
    showWarningToast: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseSession = useSession as jest.Mock;
const mockGetRoles = getRoles as jest.Mock;
const mockShowSuccessToast = showSuccessToast as jest.Mock;
const mockShowWarningToast = showWarningToast as jest.Mock;
const mockShowErrorToast = showErrorToast as jest.Mock;

const mockDeleteUser = deleteUser as jest.Mock;
const mockRefresh = jest.fn();

const exampleUsers =
    [{
        id: 1,
        name: "Max Mustermann",
        email: "max@mustermann.com",
        roleId: 1,
        roleName: "user"
    },
    {
        id: 2,
        name: "Admin User",
        email: "admin@example.com",
        roleId: 2,
        roleName: "admin"
    },
    {
        id: 3,
        name: "DemoAdmin User",
        email: "demoadmin@example.com",
        roleId: 3,
        roleName: "demoAdmin"
    },
    ] as User[]

describe("UserTable - delete user", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockGetRoles.mockResolvedValue({
            success: true,
            data: [
                { id: 1, name: "user" },
                { id: 2, name: "admin" },
                { id: 3, name: "demoAdmin" },
            ] as Role[]
        })
        mockUseSession.mockReturnValue({
            data: {
                user:
                {
                    id: "2",
                    name: "Admin User",
                    email: "admin@example.com",
                    roleId: "2",
                    roleName: "admin"
                },
                expires: "999_999"
            } as Session,
            status: "authenticated"
        })
        mockUseRouter.mockReturnValue({ refresh: mockRefresh })
    })

    it("deletes user successfully from table", async () => {
        mockDeleteUser.mockResolvedValue({ success: true, data: undefined } as ActionResult<void>)
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        const deleteButton = within(row).getByRole('button', { name: /delete user button/i })
        expect(deleteButton).toBeInTheDocument()

        await user.click(deleteButton)
        await screen.findByText(/Delete user/i);

        await user.click(screen.getByRole('button', { name: /delete button/ }))
        await waitFor(() => expect(mockDeleteUser).toHaveBeenCalledWith({ userId: 1 } as DeleteUser))
        await waitFor(() => expect(mockShowSuccessToast).toHaveBeenCalledWith("User deleted successfully."))
        await waitFor(() => expect(mockRefresh).toHaveBeenCalled())
    })

    it("throws an error when user is a demoAdmin", async () => {
        mockUseSession.mockReturnValue({
            data: {
                user:
                {
                    id: "3",
                    name: "DemoAdmin User",
                    email: "demoadmin@example.com",
                    roleId: "3",
                    roleName: "demoAdmin"
                },
                expires: "999_999"
            } as Session,
            status: "authenticated"
        });
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        const deleteButton = within(row).getByRole('button', { name: /delete user button/i })
        expect(deleteButton).toBeInTheDocument()

        await user.click(deleteButton)
        await screen.findByText(/Delete user/i);
        await user.click(screen.getByRole('button', { name: /delete button/ }))

        await waitFor(() => expect(mockShowWarningToast).toHaveBeenCalledWith("A demo admin has no permission."))
        expect(mockRefresh).not.toHaveBeenCalled()
        expect(mockDeleteUser).not.toHaveBeenCalled()
    })

    it("delete button is disabled when session user has the same id as user", () => {
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: "Admin User" })
        expect(row).toBeInTheDocument()

        const deleteButton = within(row).getByRole('button', { name: /delete user button/i })
        expect(deleteButton).toBeDisabled()
    })

    it("shows an error message when api returns error", async () => {
        mockDeleteUser.mockResolvedValue({ success: false, message: "some error" } as ActionResult<void>)
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        const deleteButton = within(row).getByRole('button', { name: /delete user button/i })
        expect(deleteButton).toBeInTheDocument()

        await user.click(deleteButton)
        await screen.findByText(/Delete user/i);
        await user.click(screen.getByRole('button', { name: /delete button/ }))

        await waitFor(() => expect(mockDeleteUser).toHaveBeenCalledWith({ userId: 1 } as DeleteUser))
        await waitFor(() => expect(mockShowErrorToast).toHaveBeenCalledWith("some error"))

        expect(mockRefresh).not.toHaveBeenCalled()
    })
})
