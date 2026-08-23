import "server-only";
import { ApiError } from "@/lib/errors";

export type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; message: string };

export function createAction<TInput, TOutput>(
    fn: (input: TInput) => Promise<TOutput>,
    fallbackMessage: string,
) {
    return async (input: TInput): Promise<ActionResult<TOutput>> => {
        try {
            return { success: true, data: await fn(input) };
        } catch (error) {
            if (error instanceof ApiError) {
                console.error("Action ApiError:", error.status, error.body);
                return { success: false, message: parseErrorMessage(error.body) ?? fallbackMessage };
            }
            console.error("Unhandled action error:", error);
            return { success: false, message: fallbackMessage };
        }
    };
}

function parseErrorMessage(body: string): string | null {
    try {
        const parsed = JSON.parse(body);

        if (typeof parsed?.message === "string") {
            return parsed.message;
        }

        // ASP.NET's ValidationProblemDetails shape: { errors: { FieldName: ["msg", ...] } }
        if (parsed?.errors && typeof parsed.errors === "object") {
            const firstFieldErrors = Object.values(parsed.errors)[0];
            if (Array.isArray(firstFieldErrors) && typeof firstFieldErrors[0] === "string") {
                return firstFieldErrors[0];
            }
        }

        return null;
    } catch {
        return null;
    }
}