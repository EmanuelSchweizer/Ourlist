import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { updateUser } from "../actions"
import { screen, render, within, waitFor } from '@testing-library/react';
import { UserTable } from './UserTable';
import { Role, User } from '@/types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { getRoles } from '@/features/roles/api';
import { UpdateUser } from '../types';
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

const mockUpdateUser = updateUser as jest.Mock;
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

describe("UserTable - edit user", () => {
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

    it("shows disabled user roles select when session user is user", async () => {
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: "Admin User" })
        expect(row).toBeInTheDocument()

        const editButton = within(row).getByRole('button', { name: /edit user button/i })
        await user.click(editButton)
        await screen.findByText(/Edit user/i);

        const selectRolesField = screen.getByRole('button', { name: /User role/i })
        expect(selectRolesField).toBeInTheDocument()
        expect(selectRolesField).toBeDisabled()
    })

    it("updates user successfully", async () => {
        mockUpdateUser.mockResolvedValue({
            success: true,
            data: {
                id: 1,
                name: "Updated name",
                email: "updated@mustermann.com",
                roleId: 2,
                roleName: "admin",
            } as User
        } as ActionResult<User>)
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        await user.click(within(row).getByRole('button', { name: /edit user button/i }))
        await screen.findByText(/Edit user/i);

        await user.clear(screen.getByPlaceholderText("Name"))
        await user.type(screen.getByPlaceholderText("Name"), "Updated name")
        await user.clear(screen.getByPlaceholderText("Email"))
        await user.type(screen.getByPlaceholderText("Email"), "updated@mustermann.com")
        await user.click(screen.getByRole('button', { name: /User role/i }))
        await user.click(screen.getByRole('option', { name: 'admin' }))

        await user.click(screen.getByRole('button', { name: /confirm button/ }))
        await waitFor(() => expect(mockUpdateUser).toHaveBeenCalledWith({
            name: "Updated name",
            email: "updated@mustermann.com",
            roleId: 2,
            userId: 1
        } as UpdateUser))
        await waitFor(() => expect(mockRefresh).toHaveBeenCalled())
        await waitFor(() => expect(mockShowSuccessToast).toHaveBeenCalledWith("User updated successfully."))
    })

    it("throws validation error when fields are empty", async () => {
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        await user.click(within(row).getByRole('button', { name: /edit user button/i }))
        await screen.findByText(/Edit user/i);

        await user.clear(screen.getByPlaceholderText("Name"))
        await user.type(screen.getByPlaceholderText("Name"), " ")

        await user.click(screen.getByRole('button', { name: /confirm button/ }))
        await waitFor(() => expect(mockShowErrorToast).toHaveBeenCalledWith("All fields are required."))
        expect(mockUpdateUser).not.toHaveBeenCalled()
        expect(mockRefresh).not.toHaveBeenCalled()
    })

    it("doesn't send up form when email is invalid", async () => {
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        await user.click(within(row).getByRole('button', { name: /edit user button/i }))
        await screen.findByText(/Edit user/i);

        await user.clear(screen.getByPlaceholderText("Email"))

        await user.click(screen.getByRole('button', { name: /confirm button/ }))
        expect(mockUpdateUser).not.toHaveBeenCalled()
        expect(mockRefresh).not.toHaveBeenCalled()
    })

    it("shows a warning messegage when user is a demoAdmin", async () => {
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

        await user.click(within(row).getByRole('button', { name: /edit user button/i }))
        await screen.findByText(/Edit user/i);

        await user.click(screen.getByRole('button', { name: /confirm button/ }))
        await waitFor(() => expect(mockShowWarningToast).toHaveBeenCalledWith("A demo admin has no permission."))
        expect(mockUpdateUser).not.toHaveBeenCalled()
        expect(mockRefresh).not.toHaveBeenCalled()
    })

    it("shows an error message when api returns error", async () => {
        mockUpdateUser.mockResolvedValue({
            success: false,
            message: "some error"
        } as ActionResult<User>)
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        const editButton = within(row).getByRole('button', { name: /edit user button/i })
        expect(editButton).toBeInTheDocument()

        await user.click(editButton)
        await screen.findByText(/Edit user/i);

        await user.click(screen.getByRole('button', { name: /confirm button/ }))
        await waitFor(() => expect(mockUpdateUser).toHaveBeenCalledWith({
            name: "Max Mustermann",
            email: "max@mustermann.com",
            roleId: 1,
            userId: 1
        } as UpdateUser))
        await waitFor(() => expect(mockShowErrorToast).toHaveBeenCalledWith("some error"))
        expect(mockRefresh).not.toHaveBeenCalled()
    })
})
