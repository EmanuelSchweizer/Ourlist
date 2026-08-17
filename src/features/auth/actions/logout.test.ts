/**
 * @jest-environment node
 */
import { logout } from "@/features/auth/actions/logout";
import { serverFetch } from "@/lib/server/api-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

jest.mock("@/lib/server/api-client", () => ({
    serverFetch: jest.fn(),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

const mockServerFetch = serverFetch as jest.Mock;
const mockCookies = cookies as jest.Mock;
const mockRedirect = redirect as unknown as jest.Mock;

describe("logout", () => {
    const mockCookieStore = {
        get: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(() => {
        jest.resetAllMocks();
        mockCookies.mockResolvedValue(mockCookieStore);
    });

    it("calls the backend logout endpoint with the refresh token when one is present", async () => {
        mockCookieStore.get.mockReturnValue({ value: "refresh-token-123" });
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

    it("skips the backend call when there is no refresh token cookie", async () => {
        mockCookieStore.get.mockReturnValue(undefined);

        await logout();

        expect(mockServerFetch).not.toHaveBeenCalled();
    });

    it("still deletes cookies and redirects when the backend call fails", async () => {
        mockCookieStore.get.mockReturnValue({ value: "refresh-token-123" });
        mockServerFetch.mockRejectedValue(new Error("network error"));

        await logout();

        expect(mockCookieStore.delete).toHaveBeenCalledWith("refreshToken");
        expect(mockCookieStore.delete).toHaveBeenCalledWith("accessToken");
        expect(mockRedirect).toHaveBeenCalledWith("/login");
    });

    it("deletes both auth cookies and redirects to /login", async () => {
        mockCookieStore.get.mockReturnValue(undefined);

        await logout();

        expect(mockCookieStore.delete).toHaveBeenCalledWith("refreshToken");
        expect(mockCookieStore.delete).toHaveBeenCalledWith("accessToken");
        expect(mockRedirect).toHaveBeenCalledWith("/login");
    });
});
