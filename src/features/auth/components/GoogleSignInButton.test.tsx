import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GoogleSignInButton } from './GoogleSignInButton';

jest.mock('next-auth/react');
jest.mock("next/navigation");

const mockSignIn = signIn as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();
const mockRefresh = jest.fn();

describe("Google SignIn button", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseRouter.mockReturnValue({ push: mockPush, refresh: mockRefresh });
    });

    it("logs in with google", async () => {
        const user = userEvent.setup()
        mockSignIn.mockResolvedValue({ error: null, ok: true, status: 201, url: null })
        render(<GoogleSignInButton />)

        await user.click(screen.getByRole('button', { name: /Sign in with Google/i }))

        await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith('google'))
        expect(mockPush).not.toHaveBeenCalled()
        expect(mockRefresh).not.toHaveBeenCalled()
    })
})