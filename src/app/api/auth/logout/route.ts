import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const logoutResponse = await fetch(`${process.env.API_URL}/User/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.BACKEND_API_KEY as string,
            },
            body: JSON.stringify(body),
        });

        if (!logoutResponse.ok) {
            const responseBody = await logoutResponse.json().catch(() => ({ message: "Logout failed." }));
            return NextResponse.json(
                { message: responseBody?.message ?? "Logout failed." },
                { status: logoutResponse.status }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch {
        return NextResponse.json({ message: "Logout failed." }, { status: 500 });
    }
}
