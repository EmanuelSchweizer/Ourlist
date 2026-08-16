import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const signupResponse = await fetch(`${process.env.API_URL}/User/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.BACKEND_API_KEY as string,
            },
            body: JSON.stringify(body),
        });

        const responseJson = await signupResponse.json().catch(() => ({ message: "Sign up failed." }));

        if (!signupResponse.ok) {
            return NextResponse.json(
                { message: responseJson?.message ?? "Sign up failed." },
                { status: signupResponse.status }
            );
        }

        return NextResponse.json(responseJson, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Sign up failed." }, { status: 500 });
    }
}