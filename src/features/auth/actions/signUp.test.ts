/**
 * @jest-environment node
 */
import { signUp } from "@/features/auth/actions/signUp";
import { serverFetch } from "@/lib/server/api-client";
import { ApiError } from "@/lib/errors";

jest.mock("@/lib/server/api-client", () => ({
    serverFetch: jest.fn(),
}));

const mockServerFetch = serverFetch as jest.Mock;

describe("signUp", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("returns the created user when the backend responds successfully", async () => {
        const user = { Id: "1", Name: "Test name", Email: "test@example.com", RoleName: "user" };
        mockServerFetch.mockResolvedValue(user);

        const result = await signUp({ name: "Test name", email: "test@example.com", password: "ValidPass123!" });

        expect(mockServerFetch).toHaveBeenCalledWith(
            "/User/signup",
            expect.objectContaining({ method: "POST" })
        );
        expect(result).toEqual({ success: true, data: user });
    });

    it("returns the backend's error message when the user already exists", async () => {
        mockServerFetch.mockRejectedValue(new ApiError(409, JSON.stringify({ message: "User already exists" })));

        const result = await signUp({ name: "Existing User", email: "existing@example.com", password: "ValidPass123!" });

        expect(result).toEqual({ success: false, message: "User already exists" });
    });

    it("falls back to a generic message when the backend is unreachable", async () => {
        mockServerFetch.mockRejectedValue(new ApiError(0, JSON.stringify({ message: "Backend is unreachable." })));

        const result = await signUp({ name: "Test name", email: "test@example.com", password: "ValidPass123!" });

        expect(result).toEqual({ success: false, message: "Backend is unreachable." });
    });

    it("falls back to a generic message when the error body isn't JSON", async () => {
        mockServerFetch.mockRejectedValue(new ApiError(500, "<html>Internal Server Error</html>"));

        const result = await signUp({ name: "Test name", email: "test@example.com", password: "ValidPass123!" });

        expect(result).toEqual({ success: false, message: "Sign up failed." });
    });

    it("falls back to a generic message on an unexpected error", async () => {
        mockServerFetch.mockRejectedValue(new Error("unexpected"));

        const result = await signUp({ name: "Test name", email: "test@example.com", password: "ValidPass123!" });

        expect(result).toEqual({ success: false, message: "Sign up failed." });
    });
});
