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
        return typeof parsed?.message === "string" ? parsed.message : null;
    } catch {
        return null;
    }
}