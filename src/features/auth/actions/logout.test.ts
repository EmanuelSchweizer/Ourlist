/**
 * @jest-environment node
 */
import { logout } from "@/features/auth/actions/logout";
import { serverFetch } from "@/lib/server/api-client";
import { getToken } from "next-auth/jwt";

jest.mock("@/lib/server/api-client", () => ({
    serverFetch: jest.fn(),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn().mockResolvedValue({}),
}));

jest.mock("next-auth/jwt", () => ({
    getToken: jest.fn(),
}));

const mockServerFetch = serverFetch as jest.Mock;
const mockGetToken = getToken as jest.Mock;

describe("logout", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("calls the backend logout endpoint with the refresh token from the session", async () => {
        mockGetToken.mockResolvedValue({ refreshToken: "refresh-token-123" });
        mockServerFetch.mockResolvedValue(undefined);

        await logout();

        expect(mockServerFetch).toHaveBeenCalledWith(
            "/User/logout",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ refreshToken: "refresh-token-123" }),
            })
        );
    });

    it("skips the backend call when there is no session token", async () => {
        mockGetToken.mockResolvedValue(null);

        await logout();

        expect(mockServerFetch).not.toHaveBeenCalled();
    });

    it("skips the backend call when the token has no refresh token", async () => {
        mockGetToken.mockResolvedValue({ userId: "1" });

        await logout();

        expect(mockServerFetch).not.toHaveBeenCalled();
    });

    it("swallows backend errors instead of throwing", async () => {
        mockGetToken.mockResolvedValue({ refreshToken: "refresh-token-123" });
        mockServerFetch.mockRejectedValue(new Error("network error"));

        await expect(logout()).resolves.toBeUndefined();
    });
});
