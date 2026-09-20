import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import AdminPage from './page';
import { Role, User } from '@/types';
import { authFetch } from "@/lib/server/api-client";
import { getRoles } from "@/features/roles/api"
import { ActionResult } from '@/lib/server/action';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

jest.mock("next/navigation");
jest.mock("next-auth/react");

jest.mock("@/lib/server/api-client", () => ({
    authFetch: jest.fn(),
}));

jest.mock("@/features/roles/api", () => ({
    getRoles: jest.fn(),
}));

const mockAuthFetch = authFetch as jest.Mock;
const mockGetRoles = getRoles as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseSession = useSession as jest.Mock;
const mockRefresh = jest.fn();

const users =
    [{
        id: 1,
        name: "User 1",
        email: "user1@example.com",
        roleId: 2,
        roleName: "user"
    },
    {
        id: 2,
        name: "User 2",
        email: "user2@example.com",
        roleId: 2,
        roleName: "user"
    }] as User[]

const roles = [
    {
        id: 1,
        name: "admin"
    },
    {
        id: 2,
        name: "demoAdmin"
    },
    {
        id: 3,
        name: "user"
    },
] as Role[]

describe("admin page", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseRouter.mockReturnValue({ refresh: mockRefresh });
        mockGetRoles.mockResolvedValue({ success: true, data: roles } as ActionResult<Role[]>)
        mockUseSession.mockReturnValue({
            data: { user: { id: "1" }, expires: "999_999_999" } as Session,
            status: "authenticated",
        });
    })

    it("loads the users from the backend and displays them", async () => {
        mockAuthFetch.mockResolvedValue(users)

        render(await AdminPage())

        await screen.findByText(/user1@example.com/i);
        expect(screen.getByText(/user2@example.com/i)).toBeInTheDocument()
        expect(mockAuthFetch).toHaveBeenCalledWith("/User/allUsers", { method: "GET" })
    })
})
