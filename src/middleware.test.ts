/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { middleware } from "./middleware";
import { getToken, JWT } from "next-auth/jwt";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

jest.mock("next-auth/jwt", () => ({
    getToken: jest.fn(),
}));

const mockGetToken = getToken as jest.Mock;

describe("", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("calls successfully homepage when user is authenticated", async () => {
        mockGetToken.mockResolvedValue({
            userId: "1",
            isAdmin: false,
            email: "example@test.com",
        } as JWT)
        mockFetch.mockResolvedValue({
            headers: { getSetCookie: () => [],}
        } as unknown as Response)
        const response = await middleware(new NextRequest("https://localhost/"))
        expect(response.status).toBe(200)
        expect(response.headers.get("location")).toBeNull();
    })

    it("redirects when user calls homepage and is not authenticated", async () => {
        mockGetToken.mockResolvedValue(null)
        mockFetch.mockResolvedValue({
            headers: { getSetCookie: () => [],}
        } as unknown as Response)
        const response = await middleware(new NextRequest("https://localhost/"))
        expect(response.status).toBe(307)
        expect(response.headers.get("location")).toBe("https://localhost/signIn?callbackUrl=%2F");
    })

    it("redirects when user calls signIn but is authenticated", async () => {
        mockGetToken.mockResolvedValue({
            userId: "1",
            isAdmin: false,
            email: "example@test.com",
        } as JWT)
        mockFetch.mockResolvedValue({
            headers: { getSetCookie: () => [],}
        } as unknown as Response)
        const response = await middleware(new NextRequest("https://localhost/signIn"))
        expect(response.status).toBe(307)
        expect(response.headers.get("location")).toBe("https://localhost/");
    })

    it("calls successfully admin page when user is admin", async () => {
        mockGetToken.mockResolvedValue({
            userId: "1",
            isAdmin: true,
            email: "example@test.com",
        } as JWT)
        mockFetch.mockResolvedValue({
            headers: { getSetCookie: () => [],}
        } as unknown as Response)
        const response = await middleware(new NextRequest("https://localhost/admin"))
        expect(response.status).toBe(200)
        expect(response.headers.get("location")).toBeNull();
    })

    it("redirects when user calls admin page but not admin", async () => {
        mockGetToken.mockResolvedValue({
            userId: "1",
            isAdmin: false,
            email: "example@test.com",
        } as JWT)
        mockFetch.mockResolvedValue({
            headers: { getSetCookie: () => [],}
        } as unknown as Response)
        const response = await middleware(new NextRequest("https://localhost/admin"))
        expect(response.status).toBe(307)
        expect(response.headers.get("location")).toBe("https://localhost/");
    })
})