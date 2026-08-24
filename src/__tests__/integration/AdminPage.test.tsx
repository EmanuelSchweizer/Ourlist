import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { JWT } from 'next-auth/jwt';
import AdminPage from '../../app/admin/page';
import { Role, User } from '@/types';
import { authFetch } from "@/lib/server/api-client";
import { getToken } from "next-auth/jwt";
import { getRoles } from "@/features/roles/api"
import { ActionResult } from '@/lib/server/action';
import { cookies } from 'next/headers';
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

jest.mock("next-auth/jwt", () => ({
    getToken: jest.fn(),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

const mockGetToken = getToken as jest.Mock;
const mockAuthFetch = authFetch as jest.Mock;
const mockGetRoles = getRoles as jest.Mock;
const mockCookies = cookies as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseSession = useSession as jest.Mock;
const mockRefresh = jest.fn();

const realUsers =
    [{
        id: 1,
        name: "Real User 1",
        email: "reals.user@realuser.com",
        roleId: 2,
        roleName: "user"
    },
    {
        id: 2,
        name: "Real User 2",
        email: "real.user@realuser.com",
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
    })

    it("displays demo user data when user is demo admin", async () => {
        mockCookies.mockResolvedValue({ getAll: () => [{ name: "next-auth.session-token", value: "dummy" }] });
        mockGetToken.mockResolvedValue({ roleName: "demoAdmin" } as JWT)
        mockAuthFetch.mockResolvedValue(realUsers)
        mockGetRoles.mockResolvedValue({ success: true, data: roles } as ActionResult<Role[]>)
        mockUseSession.mockReturnValue({
            data: { user: { id: "1" }, expires: "999_999_999" } as Session,
            status: "authenticated",
        });

        render(await AdminPage())

        await screen.findByText(/Anna Berger/i);

        expect(screen.queryByText(/realuser/i)).not.toBeInTheDocument()
    })
})