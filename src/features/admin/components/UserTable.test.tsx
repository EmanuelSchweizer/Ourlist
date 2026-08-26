import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { deleteUser, updatePassword, updateUser } from "../actions"
import { screen, render, within, waitFor } from '@testing-library/react';
import { UserTable } from './UserTable';
import { Role, User } from '@/types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { getRoles } from '@/features/roles/api';
import { DeleteUser } from '../types';
import { showSuccessToast } from '@/components/ui/toast';
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
const mockDeleteUser = deleteUser as jest.Mock;
const mockUpdatePassword = updatePassword as jest.Mock;
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

describe("User table", () => {
    beforeEach(() => {
        jest.resetAllMocks();
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
        });
        mockGetRoles.mockResolvedValue({
            success: true,
            data: [
                { id: 1, name: "user" },
                { id: 2, name: "admin" },
                { id: 3, name: "demoAdmin" },
            ] as Role[]
        })
        mockUseRouter.mockReturnValue({ refresh: mockRefresh })
    })

    it("deletes user successfully from table", async () => {
        const user = userEvent.setup();
        mockDeleteUser.mockResolvedValue({success: true, data: undefined} as ActionResult<void>)
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
})