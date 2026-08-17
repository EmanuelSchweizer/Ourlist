import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SignInForm } from '@/features/auth/components/SignInForm';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockSignIn = signIn as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();
const mockRefresh = jest.fn();

describe('SignInForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush, refresh: mockRefresh });
  });

  it('signs the user in and redirects on valid credentials', async () => {
    mockSignIn.mockResolvedValue({ error: undefined, ok: true });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByPlaceholderText(/Email/i), 'admin-demo@example.com');
    await user.type(screen.getByPlaceholderText(/Password/i), 'demoadmin123');
    await user.click(screen.getByRole('button', { name: /Log In/i }));

    await screen.findByText(/Logging in.../i);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));

    expect(mockRefresh).toHaveBeenCalled();
    expect(screen.queryByText(/Invalid email or password./i)).not.toBeInTheDocument();
  });

  it('shows an error message on invalid credentials', async () => {
    mockSignIn.mockResolvedValue({ error: 'error', ok: false });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByPlaceholderText(/Email/i), 'wrong@example.com');
    await user.type(screen.getByPlaceholderText(/Password/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /Log In/i }));

    expect(await screen.findByText(/Invalid email or password./i)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('throws a network error and shows a generic error message', async () => {
    mockSignIn.mockRejectedValue({ error: 'network', ok: false });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByPlaceholderText(/Email/i), 'example@example.com')
    await user.type(screen.getByPlaceholderText(/Password/i), 'examplePassword123')
    await user.click(screen.getByRole('button', { name: /Log In/i }));

    expect(await screen.findByText(/An unexpected error occurred. Please try again./i)).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  })

  it('resets the error message after second submit', async () => {
    mockSignIn.mockResolvedValue({ error: 'error', ok: false });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByPlaceholderText(/Email/i), 'wrong@email.com')
    await user.type(screen.getByPlaceholderText(/Password/i), 'wrongPassword')
    await user.click(screen.getByRole('button', { name: /Log In/i }));

    expect(await screen.findByText(/Invalid email or password./i)).toBeInTheDocument()

    mockSignIn.mockResolvedValue({ error: undefined, ok: true });
    await user.clear(screen.getByPlaceholderText(/Email/i));
    await user.clear(screen.getByPlaceholderText(/Password/i));
    await user.type(screen.getByPlaceholderText(/Email/i), 'right@email.com')
    await user.type(screen.getByPlaceholderText(/Password/i), 'rightPassword')
    await user.click(screen.getByRole('button', { name: /Log In/i }));

    expect(screen.queryByText(/Invalid email or password./i)).not.toBeInTheDocument();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  })
});
