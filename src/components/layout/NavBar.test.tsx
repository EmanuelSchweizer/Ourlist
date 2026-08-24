import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { NavBar } from './NavBar';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import userEvent from '@testing-library/user-event';

jest.mock("next-auth/react");
jest.mock("next/navigation");

jest.mock("next-auth/jwt", () => ({
    getToken: jest.fn(),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("@/lib/server/api-client", () => ({
    serverFetch: jest.fn(),
}));

const mockUseSession = useSession as jest.Mock;

describe("NavBar", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })

    it("renders NavBar with sidebar when user is authenticated", async () => {
        mockUseSession.mockReturnValue({
            data: { user: { id: "1" }, expires: "999_999_999" } as Session,
            status: "authenticated",
        });
        render(<NavBar />)

        await screen.findByText(/Ourlist/i)
        expect(screen.getByRole('button', { name: /open sidebar/ })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Sign in/ })).not.toBeInTheDocument()
    })

    it("renders NavBar with Sign in button when user is not authenticated", async () => {
        mockUseSession.mockReturnValue({
            data: { user: { id: "1" }, expires: "999_999_999" } as Session,
            status: "unauthenticated",
        });
        render(<NavBar />)

        await screen.findByText(/Ourlist/i)
        expect(screen.queryByRole('button', { name: /open sidebar/ })).not.toBeInTheDocument()

        const signInLink = screen.queryByRole('link', { name: /Sign in/ })
        expect(signInLink).toBeInTheDocument()
        expect(signInLink).toHaveAttribute('href', '/signIn')
    })

    it("displays admin panel link when userRole is admin", async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
            data: { user: { id: "1", isAdmin: true, roleName: "admin" }, expires: "999_999_999" } as Session,
            status: "authenticated",
        });
        render(<NavBar />)

        await user.click(screen.getByRole('button', { name: /open sidebar/ }))

        const shoppinglistsLink = screen.queryByRole('link', { name: /Shopping Lists/ })
        expect(shoppinglistsLink).toBeInTheDocument()
        expect(shoppinglistsLink).toHaveAttribute('href', '/')

        const adminPanelLink = screen.queryByRole('link', { name: /Admin Panel/ })
        expect(adminPanelLink).toBeInTheDocument()
        expect(adminPanelLink).toHaveAttribute('href', '/admin')
    })

    it("does not display admin panel link when userRole is user", async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
            data: { user: { id: "1", isAdmin: false, roleName: "user" }, expires: "999_999_999" } as Session,
            status: "authenticated",
        });
        render(<NavBar />)

        await user.click(screen.getByRole('button', { name: /open sidebar/ }))

        const shoppinglistsLink = screen.queryByRole('link', { name: /Shopping Lists/ })
        expect(shoppinglistsLink).toBeInTheDocument()
        expect(shoppinglistsLink).toHaveAttribute('href', '/')

        const adminPanelLink = screen.queryByRole('link', { name: /Admin Panel/ })
        expect(adminPanelLink).not.toBeInTheDocument()
    })
})