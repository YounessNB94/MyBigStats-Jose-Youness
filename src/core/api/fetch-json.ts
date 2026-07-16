import { ApiError } from "../errors/api.errors.js";

export async function fetchJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(
        `Erreur HTTP ${response.status}`,
        response.status
      );
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Impossible de contacter le serveur.");
  }
}