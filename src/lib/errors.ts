/** Thrown when a backend request fails. Status 0 means the request never got through. */
export class ApiError extends Error {
    constructor(
        public readonly status: number,
        /** Raw response body — parsed by the action wrapper to extract a message */
        public readonly body: string,
    ) {
        super(`API request failed with status ${status}`);
        this.name = "ApiError";
    }

    /** True for 4xx responses — caused by the request, not the server */
    get isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    /** True when the backend could not be reached at all */
    get isNetworkError(): boolean {
        return this.status === 0;
    }
}