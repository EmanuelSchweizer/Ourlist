import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInPage } from '@/app/(auth)/signIn/page'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock('next-auth/react');
jest.mock('next/navigation');

const mockSignIn = signIn as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();
const mockRefresh = jest.fn();

describe("SignIn page", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseRouter.mockReturnValue({ push: mockPush, refresh: mockRefresh });
    });

    it("renders SignInPage", async () => {
        render(<SignInPage />)

        expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
        const createAccountLink = screen.getByRole('link', { name: /Create an account/i })
        expect(createAccountLink).toBeInTheDocument()
        expect(createAccountLink).toHaveAttribute('href', '/signUp')
    })

    it("logs in with google", async () => {
        const user = userEvent.setup()
        mockSignIn.mockResolvedValue({ error: null, ok: true, status: 201, url: null })
        render(<SignInPage />)

        await user.click(screen.getByRole('button', { name: /Sign in with Google/i }))

        await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith('google'))
        expect(screen.getByPlaceholderText(/Email/i)).not.toHaveValue()
        expect(screen.getByPlaceholderText(/Password/i)).not.toHaveValue()
        expect(mockPush).not.toHaveBeenCalled()
        expect(mockRefresh).not.toHaveBeenCalled()
    })

    it("logs in with credentials", async () => {
        const user = userEvent.setup()
        mockSignIn.mockResolvedValue({ error: null, ok: true, status: 201, url: null })
        render(<SignInPage />)

        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com')
        await user.type(screen.getByPlaceholderText(/Password/i), 'ValidPassword123.')
        await user.click(screen.getByRole('button', { name: /Log in/i }))
        await screen.findByText(/Logging in.../i);

        await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith('credentials', { email: 'test@example.com', password: 'ValidPassword123.', redirect: false}))

        expect(screen.queryByText(/Invalid email or password./i)).not.toBeInTheDocument();
        expect(mockRefresh).toHaveBeenCalled()
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'))
    })

    //other testcases implemented in SignInForm.test.tsx
})