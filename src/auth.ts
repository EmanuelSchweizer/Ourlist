import { NextAuthOptions } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/signIn",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            const userFromSignIn = user as {
                id?: string;
                isAdmin?: boolean;
                accessToken?: string;
                refreshToken?: string;
            } | undefined;
            const isCredentialsSignIn = account?.provider === "credentials";

            if (userFromSignIn?.id && isCredentialsSignIn) {
                token.userId = userFromSignIn.id;
                token.isAdmin = userFromSignIn.isAdmin ?? false;
                token.accessToken = userFromSignIn.accessToken;
                token.refreshToken = userFromSignIn.refreshToken;
                return token;
            }

            if (!token.userId && token.email) {
                const resolveUserResponse = await fetch(`${process.env.API_URL}/User/resolveOrCreateUser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": process.env.BACKEND_API_KEY as string,
                    },
                    body: JSON.stringify({
                        email: token.email,
                        name: token.name,
                    }),
                });

                if (resolveUserResponse.ok) {
                    const data = await resolveUserResponse.json();
                    if (data?.user?.id) {
                        token.userId = data.user.id;
                        token.isAdmin = data.user.roleName === "admin";
                        token.accessToken = data.token;
                        token.refreshToken = data.refreshToken;
                    }
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user && typeof token.userId === "string") {
                const user = session.user as { id?: string; isAdmin?: boolean };
                user.id = token.userId;
                user.isAdmin = token.isAdmin === true;
            }

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
            async authorize(credentials: Record<"email" | "password", string> | undefined) {
                if (!credentials || !credentials.email || !credentials.password) return null

                const loginResponse = await fetch(`${process.env.API_URL}/User/signIn`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": process.env.BACKEND_API_KEY as string,
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    })
                })

                if (!loginResponse.ok) {
                    return null
                }

                const data = await loginResponse.json()

                if (data?.user?.id && data?.user?.email) {
                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        isAdmin: data.user.roleName === "admin",
                        accessToken: data.token,
                        refreshToken: data.refreshToken,
                    }
                }

                return null
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
}