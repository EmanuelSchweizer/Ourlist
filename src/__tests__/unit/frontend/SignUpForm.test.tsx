import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { SignUpForm } from '@/features/auth/components/SignUpForm';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { signUp } from '@/features/auth/actions/signUp';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
}));

jest.mock('@/features/auth/actions/signUp', () => ({
    signUp: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockSignUp = signUp as jest.Mock;
const mockSignIn = signIn as jest.Mock;

describe('SignUpForm', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseRouter.mockReturnValue({ push: mockPush, refresh: mockRefresh });
    });

    it('renders the form with all fields and submit button', () => {
        render(<SignUpForm />);

        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });

    it('displays password rules message', async () => {
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'weakpass');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'weakpass');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/Password must be at least 10 characters and include uppercase, lowercase, number, and special character./i)).toBeInTheDocument();
    });

    it('displays empty fields error message', async () => {
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/All fields are required./i)).toBeInTheDocument();
    });

    it('displays invalid email error message', async () => {
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@invalid');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'ValidPass123!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/Please enter a valid email address./i)).toBeInTheDocument();
    });

    it('displays password mismatch error message', async () => {
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'DifferentPass456!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/Passwords do not match./i)).toBeInTheDocument();
    });

    it('submits the form and redirects on successful sign up', async () => {
        mockSignUp.mockResolvedValueOnce({
            success: true,
            user: { Id: '1', Name: 'Test User', Email: 'test@example.com', RoleName: 'user' },
        });
        mockSignIn.mockResolvedValueOnce({ error: undefined, ok: true });
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'ValidPass123!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));

        expect(mockRefresh).toHaveBeenCalled();
        expect(screen.queryByText(/Sign up failed./i)).not.toBeInTheDocument();
    });

    it('displays generic error message on failed sign up', async () => {
        mockSignUp.mockResolvedValueOnce({ success: false, message: 'Sign up failed.' });
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Already Existing User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'alreadyexisting@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'ValidPass123!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/Sign up failed./i)).toBeInTheDocument();
        expect(mockPush).not.toHaveBeenCalled();
        expect(mockRefresh).not.toHaveBeenCalled();
    });

    it('sign up fails when the email is already in use', async () => {
        mockSignUp.mockResolvedValueOnce({ success: false, message: 'User already exists' });
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'New User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'alreadyexisting@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'ValidPass123!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/User already exists/i)).toBeInTheDocument();
        expect(mockPush).not.toHaveBeenCalled();
        expect(mockRefresh).not.toHaveBeenCalled();
    });

    it('sign up successfully but sign in fails', async () => {
        mockSignUp.mockResolvedValueOnce({
            success: true,
            user: { Id: '1', Name: 'Test User', Email: 'test@example.com', RoleName: 'user' },
        });
        mockSignIn.mockResolvedValueOnce({ error: 'error', ok: false });
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'ValidPass123!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/signIn'));
        expect(mockRefresh).toHaveBeenCalled();
    })

    it('signUp throws network error', async () => {
        mockSignUp.mockRejectedValueOnce(new Error('Network error'));
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'ValidPass123!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/Sign up failed./i)).toBeInTheDocument();
        expect(mockPush).not.toHaveBeenCalled();
        expect(mockRefresh).not.toHaveBeenCalled();
    });
});