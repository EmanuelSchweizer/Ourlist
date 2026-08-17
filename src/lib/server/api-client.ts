import { ApiError } from "next/dist/server/api-utils";

import "server-only";

export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.CSHARP_API_URL}${path}`, {
    ...init,
    headers: {
      "X-Api-Key": process.env.API_KEY!,   // ohne NEXT_PUBLIC_ Prefix!
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json();
}