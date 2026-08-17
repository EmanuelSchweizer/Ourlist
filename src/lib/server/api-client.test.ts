/**
 * @jest-environment node
 */
import { authFetch } from "@/lib/server/api-client";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

const mockCookies = cookies as jest.Mock;

async function sessionCookie(token: Record<string, unknown>) {
    const value = await encode({ token, secret: process.env.NEXTAUTH_SECRET! });
    return { name: "next-auth.session-token", value };
}

describe("authFetch", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("reads the access token out of the encrypted session cookie and sends it as a Bearer header", async () => {
        const cookie = await sessionCookie({ accessToken: "access-token-123" });
        mockCookies.mockResolvedValue({ getAll: () => [cookie] });
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({ "content-length": "13" }),
            json: async () => ({ hello: "world" }),
        });

        await authFetch("/some/path");

        const [, options] = mockFetch.mock.calls[0];
        expect(options.headers.Authorization).toBe("Bearer access-token-123");
    });

    it("throws when there is no session cookie at all", async () => {
        mockCookies.mockResolvedValue({ getAll: () => [] });

        await expect(authFetch("/some/path")).rejects.toThrow();
        expect(mockFetch).not.toHaveBeenCalled();
    });
});
