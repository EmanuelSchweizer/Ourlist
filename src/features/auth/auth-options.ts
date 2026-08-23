import { NextAuthOptions } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { User } from "@/types"
import { serverFetch } from "@/lib/server/api-client";

type UserResponse = {
    user?: User;
    token?: string;
    refreshToken?: string;
};

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/signIn",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {

            //login with credentials
            if (user && account?.provider === "credentials") {
                return {
                    ...token,
                    userId: user.id,
                    isAdmin: user.isAdmin ?? false,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    expiresAt: getExpiryFromJwt(user.accessToken),
                    roleName: user.roleName
                };
            }

            //login via google & find user in backend
            if (account?.provider === "google" && token.email) {
                try {
                    const data = await serverFetch<UserResponse>("/User/resolveOrCreateUser", {
                        method: "POST",
                        body: JSON.stringify({ email: token.email, name: token.name }),
                    });

                    if (data.user?.id) {
                        return {
                            ...token,
                            userId: String(data.user.id),
                            isAdmin: data.user.roleName === "admin" || data.user.roleName === "demoAdmin",
                            accessToken: data.token,
                            refreshToken: data.refreshToken,
                            expiresAt: getExpiryFromJwt(data.token),
                            roleName: data.user?.roleName,
                        };
                    }
                } catch {
                    return { ...token, error: "ResolveFailed" };
                }
            }

            //token is valid => return unchanged token
            if (token.expiresAt && Date.now() < token.expiresAt - 60_000) {
                return token;
            }

            //token is expired => refresh
            if (!token.refreshToken) return { ...token, error: "RefreshFailed" };

            try {
                const data = await serverFetch<UserResponse>("/User/refresh", {
                    method: "POST",
                    body: JSON.stringify({ refreshToken: token.refreshToken }),
                });

                return {
                    ...token,
                    accessToken: data.token,
                    refreshToken: data.refreshToken ?? token.refreshToken,
                    expiresAt: getExpiryFromJwt(data.token),
                    error: undefined,
                    roleName: data.user?.roleName ?? token.roleName,
                };
            } catch {
                return { ...token, error: "RefreshFailed" };
            }
        },
        async session({ session, token }) {
            session.user.id = token.userId;
            session.user.isAdmin = token.isAdmin === true;
            session.error = token.error;
            session.user.roleName = token.roleName;
            
            return session;
        },
    },
    providers: [
        CredentialsProvider({
            name: "Sign In",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                try {
                    const data = await serverFetch<UserResponse>("/User/signIn", {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!data.user?.id || !data.user.email) return null;

                    return {
                        id: String(data.user.id),
                        name: data.user.name,
                        email: data.user.email,
                        isAdmin: data.user.roleName === "admin" || data.user.roleName === "demoAdmin",
                        accessToken: data.token,
                        refreshToken: data.refreshToken,
                        roleName: data.user.roleName
                    };
                } catch {
                    return null;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
}

function getExpiryFromJwt(token?: string): number | undefined {
    if (!token) return undefined;
    try {
        const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString("utf-8")
        );
        return typeof payload.exp === "number" ? payload.exp * 1000 : undefined;
    } catch {
        return undefined;
    }
}