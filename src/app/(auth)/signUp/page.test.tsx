import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { redirect, useRouter } from 'next/navigation';
import SignUpPage from './page';
import userEvent from '@testing-library/user-event';
import { signUp } from '@/features/auth/actions/signUp';
import { signIn, SignInResponse } from 'next-auth/react';
import { ActionResult } from '@/lib/server/action';
import { SignUpUser } from '@/features/auth/types';

jest.mock('next-auth/react');
jest.mock('next/navigation');

jest.mock('@/features/auth/actions/signUp', () => ({
    signUp: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockSignUp = signUp as jest.Mock;
const mockSignIn = signIn as jest.Mock;

describe("SignUp page", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseRouter.mockReturnValue({ push: mockPush, refresh: mockRefresh });
    });

    it("renders SignUpPage", async () => {
        render(<SignUpPage />)

        expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign up with Google/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign Up/ })).toBeInTheDocument();
        const signInLink = screen.getByRole('link', { name: /Sign in/ })
        expect(signInLink).toBeInTheDocument()
        expect(signInLink).toHaveAttribute('href', '/signIn')
    })

    it("sign in with google", async () => {
        const user = userEvent.setup()
        mockSignIn.mockResolvedValue({ error: null, ok: true, status: 201, url: null })
        render(<SignUpPage />)

        await user.click(screen.getByRole('button', { name: /Sign up with Google/i }))

        await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith('google'))
        expect(screen.getByPlaceholderText(/Email/i)).not.toHaveValue()
        expect(screen.getByPlaceholderText(/Name/i)).not.toHaveValue()
        expect(screen.getByPlaceholderText(/Password/)).not.toHaveValue()
        expect(screen.getByPlaceholderText(/Confirm password/i)).not.toHaveValue()
        expect(mockPush).not.toHaveBeenCalled()
        expect(mockRefresh).not.toHaveBeenCalled()
    })

    it("sign up with credentials", async () => {
        const user = userEvent.setup()
        mockSignUp.mockResolvedValue({ success: true, data: { Name: 'Test User', Email: 'test@example.com', RoleName: 'user' } } as ActionResult<SignUpUser>)
        render(<SignUpPage />)
        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User')
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com')
        await user.type(screen.getByPlaceholderText(/Password/), 'ValidPassword123.')
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'ValidPassword123.')
        await user.click(screen.getByRole('button', { name: /Sign Up/ }))

        await waitFor(() => expect(mockSignUp).toHaveBeenCalledWith({ name: 'Test User', email: 'test@example.com', password: 'ValidPassword123.' }))
        await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith('credentials', { email: 'test@example.com', password: 'ValidPassword123.', redirect: false }))

        expect(screen.queryByText(/Sign up failed./i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Password must be 8-100 characters, including uppercase, lowercase, a number and a special character./i)).not.toBeInTheDocument();
        expect(screen.queryByText(/All fields are required./i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Passwords do not match./i)).not.toBeInTheDocument();

        expect(mockRefresh).toHaveBeenCalled()
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'))
    })

    //other testcases implemented in SignUpForm.test.tsx
})