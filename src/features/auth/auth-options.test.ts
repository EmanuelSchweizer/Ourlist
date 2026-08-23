/**
 * @jest-environment node
 */
import { Account, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

import { authOptions } from "@/features/auth/auth-options";
import { serverFetch } from "@/lib/server/api-client";

jest.mock("@/lib/server/api-client", () => ({
    serverFetch: jest.fn(),
}));

const mockServerFetch = serverFetch as jest.Mock;

const credentialsProvider = authOptions.providers.find(
    (p) => p.id === "credentials"
)!;

const jwt = authOptions.callbacks!.jwt!;
const session = authOptions.callbacks!.session!;

/** Builds a fake JWT with the given `exp` (seconds since epoch) as its only payload claim. */
function fakeJwt(exp: number): string {
    const payload = Buffer.from(JSON.stringify({ exp })).toString("base64");
    return `header.${payload}.signature`;
}

describe("authorize", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("returns null when credentials are missing", async () => {
        const result = await credentialsProvider.options.authorize({ email: "", password: "" });

        expect(result).toBeNull();
    });

    it("returns a user object when the backend confirms the login", async () => {
        mockServerFetch.mockResolvedValue({
            user: { id: 1, name: "Test User", email: "test@example.com", roleName: "user" },
            token: "access-token",
            refreshToken: "refresh-token",
        });

        const result = await credentialsProvider.options.authorize({ email: "test@example.com", password: "123456" });

        expect(result).toEqual({
            id: "1",
            name: "Test User",
            email: "test@example.com",
            isAdmin: false,
            accessToken: "access-token",
            refreshToken: "refresh-token",
            roleName: "user"
        });
    });

    it("returns null when the backend rejects the login", async () => {
        mockServerFetch.mockRejectedValue(new Error("request failed"));

        const result = await credentialsProvider.options.authorize({ email: "test@example.com", password: "123456" });

        expect(result).toBeNull();
    });

    it("returns null when the backend responds without a user id or email", async () => {
        mockServerFetch.mockResolvedValue({ user: { name: "Test User", roleName: "user" } });

        const result = await credentialsProvider.options.authorize({ email: "test@example.com", password: "123456" });

        expect(result).toBeNull();
    });

    it("returns an admin user object when roleName is admin", async () => {
        mockServerFetch.mockResolvedValue({
            user: { id: 1, name: "Test User", email: "test@example.com", roleName: "admin" },
        });

        const result = await credentialsProvider.options.authorize({ email: "test@example.com", password: "123456" });

        expect(result.isAdmin).toBe(true);
    });
});

describe("jwt callback", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("sets token fields directly from the credentials user, without calling the backend", async () => {
        const token = { name: "Test User", email: "test@example.com" } as JWT;
        const user = {
            id: "1",
            isAdmin: true,
            accessToken: "access-token",
            refreshToken: "refresh-token",
        } as User;
        const account = { providerAccountId: "123", provider: "credentials", type: "credentials" } as Account;

        const result = await jwt({ token, user, account });

        expect(mockServerFetch).not.toHaveBeenCalled();
        expect(result).toMatchObject({
            userId: "1",
            isAdmin: true,
            accessToken: "access-token",
            refreshToken: "refresh-token",
        });
    });

    it("resolves the user via the backend on Google sign-in", async () => {
        mockServerFetch.mockResolvedValue({
            user: { id: 2, roleName: "user" },
            token: "access-token",
            refreshToken: "refresh-token",
        });
        const token = { name: "Test User", email: "test@example.com" } as JWT;
        const account = { providerAccountId: "123", provider: "google", type: "oauth" } as Account;

        const result = await jwt({ token, user: undefined!, account });

        expect(mockServerFetch).toHaveBeenCalledWith(
            "/User/resolveOrCreateUser",
            expect.objectContaining({ method: "POST" })
        );
        expect(result).toMatchObject({ userId: "2", isAdmin: false, accessToken: "access-token" });
    });

    it("sets a ResolveFailed error when the backend rejects the Google sign-in", async () => {
        mockServerFetch.mockRejectedValue(new Error("backend down"));
        const token = { name: "Test User", email: "test@example.com" } as JWT;
        const account = { providerAccountId: "123", provider: "google", type: "oauth" } as Account;

        const result = await jwt({ token, user: undefined!, account });

        expect(result).toEqual({ ...token, error: "ResolveFailed" });
    });

    it("returns the token unchanged while the access token is still valid", async () => {
        const token = {
            userId: "1",
            accessToken: "still-valid",
            expiresAt: Date.now() + 10 * 60 * 1000,
        } as JWT;

        const result = await jwt({ token, user: undefined!, account: null });

        expect(mockServerFetch).not.toHaveBeenCalled();
        expect(result).toBe(token);
    });

    it("sets a RefreshFailed error when the token is expired and there is no refresh token", async () => {
        const token = { userId: "1", accessToken: "expired", expiresAt: Date.now() - 1000 } as JWT;

        const result = await jwt({ token, user: undefined!, account: null });

        expect(result).toEqual({ ...token, error: "RefreshFailed" });
    });

    it("refreshes the token when it is expired and a refresh token is available", async () => {
        mockServerFetch.mockResolvedValue({ token: fakeJwt(9_999_999_999), refreshToken: "new-refresh" });
        const token = {
            userId: "1",
            accessToken: "expired",
            refreshToken: "old-refresh",
            expiresAt: Date.now() - 1000,
            roleName: "user"
        } as JWT;

        const result = await jwt({ token, user: undefined!, account: null });

        expect(mockServerFetch).toHaveBeenCalledWith("/User/refresh", expect.objectContaining({ method: "POST" }));
        expect(result).toMatchObject({ accessToken: fakeJwt(9_999_999_999), refreshToken: "new-refresh", error: undefined, roleName: "user" });
    });

    it("sets a RefreshFailed error when the refresh request fails", async () => {
        mockServerFetch.mockRejectedValue(new Error("backend down"));
        const token = {
            userId: "1",
            isAdmin: false,
            accessToken: "expired",
            refreshToken: "old-refresh",
            expiresAt: Date.now() - 1000,
            email: "example@test.com",
        } as JWT;

        const result = await jwt({ token, user: undefined!, account: null });

        expect(result).toEqual({ ...token, error: "RefreshFailed" });
    });
});

describe("session callback", () => {
    it("copies id, isAdmin and error from the token onto the session user", async () => {
        const sessionObject = {
            user: {},
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        } as Session;
        const token = { userId: "3", isAdmin: true, error: "RefreshFailed" } as JWT;

        const result = (await session({
            session: sessionObject,
            token,
            user: undefined!,
            newSession: undefined,
            trigger: "update",
        })) as Session;

        expect(result.user.id).toBe("3");
        expect(result.user.isAdmin).toBe(true);
        expect(result.error).toBe("RefreshFailed");
    });

    it("treats a missing isAdmin flag as false", async () => {
        const sessionObject = {
            user: {},
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        } as Session;
        const token = { userId: "" } as JWT;

        const result = (await session({
            session: sessionObject,
            token,
            user: undefined!,
            newSession: undefined,
            trigger: "update",
        })) as Session;

        expect(result.user.isAdmin).toBe(false);
    });
});
