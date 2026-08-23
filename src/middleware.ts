import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/signIn", "/signUp"];

// Routes whose Server Component calls authFetch directly on first render —
// these need a guaranteed-fresh token before rendering even starts.
const SERVER_FETCH_PATHS = ["/admin"];

function isPublicPath(pathname: string): boolean {
    if (PUBLIC_PATHS.includes(pathname)) return true;
    if (pathname.startsWith("/api/auth")) return true;
    if (pathname.startsWith("/_next")) return true;
    if (pathname === "/favicon.ico") return true;
    if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
    return false;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // Only for routes that fetch server-side on first render: trigger NextAuth's
    // own session endpoint, since only a Route Handler (not this middleware or a
    // Server Component) is guaranteed to be able to write a refreshed cookie back.
    if (SERVER_FETCH_PATHS.some((p) => pathname.startsWith(p))) {
        const sessionUrl = new URL("/api/auth/session", process.env.NEXTAUTH_URL);

        const sessionRes = await fetch(sessionUrl, {
            headers: { cookie: request.headers.get("cookie") ?? "" },
        });

        for (const cookieStr of sessionRes.headers.getSetCookie()) {
            const [pair] = cookieStr.split(";");
            const [name, ...rest] = pair.split("=");
            request.cookies.set(name, rest.join("="));
        }
    }

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    let response: NextResponse;

    if (PUBLIC_PATHS.includes(pathname) && token) {
        response = NextResponse.redirect(new URL("/", request.url));
    } else if (PUBLIC_PATHS.includes(pathname)) {
        response = NextResponse.next({ request });
    } else if (!token) {
        const signInUrl = new URL("/signIn", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        response = NextResponse.redirect(signInUrl);
    } else if (pathname.startsWith("/admin")) {
        const isAdmin = (token as { isAdmin?: boolean }).isAdmin === true;
        response = isAdmin ? NextResponse.next({ request }) : NextResponse.redirect(new URL("/", request.url));
    } else {
        response = NextResponse.next({ request });
    }

    // Mirror any refreshed cookie back to the browser too.
    for (const cookie of request.cookies.getAll()) {
        response.cookies.set(cookie.name, cookie.value);
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};