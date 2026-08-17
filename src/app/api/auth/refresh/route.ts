import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const refreshResponse = await fetch(`${process.env.API_URL}/User/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.BACKEND_API_KEY as string,
            },
            body: JSON.stringify(body),
        });

        const responseBody = await refreshResponse.json().catch(() => ({ message: "Token refresh failed." }));

        if (!refreshResponse.ok) {
            return NextResponse.json(
                { message: responseBody?.message ?? "Token refresh failed." },
                { status: refreshResponse.status }
            );
        }

        return NextResponse.json(responseBody, { status: refreshResponse.status });
    } catch {
        return NextResponse.json({ message: "Token refresh failed." }, { status: 500 });
    }
}
