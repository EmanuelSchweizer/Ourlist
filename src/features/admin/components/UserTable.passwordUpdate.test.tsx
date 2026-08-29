import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { updatePassword } from "../actions"
import { screen, render, within, waitFor } from '@testing-library/react';
import { UserTable } from './UserTable';
import { Role, User } from '@/types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { getRoles } from '@/features/roles/api';
import { UpdatePassword } from '../types';
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

const mockUpdatePassword = updatePassword as jest.Mock;
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

describe("UserTable - update user password", () => {
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

    it("updates user password successfully", async () => {
        mockUpdatePassword.mockResolvedValue({ success: true, data: undefined } as ActionResult<void>)
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        const updatePasswortButton = within(row).getByRole('button', { name: /update password button/i })
        expect(updatePasswortButton).toBeInTheDocument()

        await user.click(updatePasswortButton)

        await user.type(screen.getByPlaceholderText("New password"), "ValidPassword123.")

        await screen.findByText(/Update password/i);

        await user.click(screen.getByRole('button', { name: /confirm button/ }))
        await waitFor(() => expect(mockUpdatePassword).toHaveBeenCalledWith({ userId: 1, newPassword: "ValidPassword123." } as UpdatePassword))
        await waitFor(() => expect(mockShowSuccessToast).toHaveBeenCalledWith("Password updated successfully."))
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

        const updatePasswortButton = within(row).getByRole('button', { name: /update password button/i })
        expect(updatePasswortButton).toBeInTheDocument()

        await user.click(updatePasswortButton)

        await user.type(screen.getByPlaceholderText("New password"), "ValidPassword123.")

        await screen.findByText(/Update password/i);

        await user.click(screen.getByRole('button', { name: /confirm button/ }))

        await waitFor(() => expect(mockShowWarningToast).toHaveBeenCalledWith("A demo admin has no permission."))
        expect(mockUpdatePassword).not.toHaveBeenCalled()
        expect(mockRefresh).not.toHaveBeenCalled()
    })

    it("shows an error message when api returns error", async () => {
        mockUpdatePassword.mockResolvedValue({ success: false, message: "some error" } as ActionResult<void>)
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        const updatePasswortButton = within(row).getByRole('button', { name: /update password button/i })
        expect(updatePasswortButton).toBeInTheDocument()

        await user.click(updatePasswortButton)

        await user.type(screen.getByPlaceholderText("New password"), "ValidPassword123.")

        await screen.findByText(/Update password/i);

        await user.click(screen.getByRole('button', { name: /confirm button/ }))
        await waitFor(() => expect(mockUpdatePassword).toHaveBeenCalledWith({ userId: 1, newPassword: "ValidPassword123." } as UpdatePassword))
        await waitFor(() => expect(mockShowErrorToast).toHaveBeenCalledWith("some error"))
        expect(mockRefresh).not.toHaveBeenCalled()
    })

    it("shows an error message when new password is not valid", async () => {
        mockUpdatePassword.mockResolvedValue({ success: false, message: "some error" } as ActionResult<void>)
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        const updatePasswortButton = within(row).getByRole('button', { name: /update password button/i })
        expect(updatePasswortButton).toBeInTheDocument()

        await user.click(updatePasswortButton)

        await user.type(screen.getByPlaceholderText("New password"), "123")

        await screen.findByText(/Update password/i);

        await user.click(screen.getByRole('button', { name: /confirm button/ }))
        await waitFor(() => expect(mockShowErrorToast).toHaveBeenCalledWith("Password must be 8-100 characters, including uppercase, lowercase, a number and a special character."))
        expect(mockUpdatePassword).not.toHaveBeenCalled()
        expect(mockRefresh).not.toHaveBeenCalled()
    })

    it("shows an error message when new password is empty", async () => {
        mockUpdatePassword.mockResolvedValue({ success: false, message: "some error" } as ActionResult<void>)
        const user = userEvent.setup();
        render(<UserTable users={exampleUsers} />)

        const row = screen.getByRole('row', { name: /max mustermann/i })
        expect(row).toBeInTheDocument()

        const updatePasswortButton = within(row).getByRole('button', { name: /update password button/i })
        expect(updatePasswortButton).toBeInTheDocument()

        await user.click(updatePasswortButton)

        await user.type(screen.getByPlaceholderText("New password"), " ")

        await screen.findByText(/Update password/i);

        await user.click(screen.getByRole('button', { name: /confirm button/ }))
        await waitFor(() => expect(mockShowErrorToast).toHaveBeenCalledWith("Password is required."))
        expect(mockUpdatePassword).not.toHaveBeenCalled()
        expect(mockRefresh).not.toHaveBeenCalled()
    })
})
