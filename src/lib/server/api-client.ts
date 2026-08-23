// lib/server/api-client.ts
import "server-only";

import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { ApiError } from "@/lib/errors";

const BASE_URL = process.env.API_URL;
const API_KEY = process.env.BACKEND_API_KEY;

type FetchOptions = RequestInit & {
  /** Bearer token for endpoints that require a user context */
  accessToken?: string;
  /** Request timeout in milliseconds, defaults to 10s */
  timeoutMs?: number;
};

export async function serverFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!BASE_URL || !API_KEY) {
    throw new Error("Missing API_URL or BACKEND_API_KEY environment variable.");
  }

  const { accessToken, timeoutMs = 10_000, headers, ...init } = options;

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });
  } catch {
    // Network failure or timeout — the request never reached the backend.
    // Status 0 is the convention for "no response received".
    throw new ApiError(0, JSON.stringify({ message: "Backend is unreachable." }));
  }

  if (!response.ok) {
    // Read as text, not JSON: error responses may be HTML or empty,
    // and .json() would throw and mask the original error.
    throw new ApiError(response.status, await response.text().catch(() => ""));
  }

  // Handle empty bodies (e.g. the logout endpoint returns 204 No Content).
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function authFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const token = await getToken({
    req: { cookies: await cookies() } as unknown as NextRequest,
    secret: process.env.NEXTAUTH_SECRET ?? "test-secret",
  });
  const accessToken = token?.accessToken;

  if (!accessToken) throw new ApiError(401, JSON.stringify({ message: "Not authenticated." }));
  return serverFetch<T>(path, { ...options, accessToken });
}