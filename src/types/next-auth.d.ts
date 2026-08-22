import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            isAdmin?: boolean;
            name?: string | null;
            email?: string | null;
            roleName?: string;
            image?: string | null;
        };
        error?: string;
    }

    interface User {
        id: string;
        isAdmin?: boolean;
        accessToken?: string;
        refreshToken?: string;
        roleName?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
        isAdmin?: boolean;
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
        error?: string;
        roleName?: string;
    }
}