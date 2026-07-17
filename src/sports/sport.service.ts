import { API_URLS } from "../config/api.config.js";
import { ApiError, SportNotFoundError } from "../core/errors/api.errors.js";
import { fetchJson } from "../core/api/fetch-json.js";
import type { Sport, SportSlug } from "./sport.types.js";

export async function getSports(): Promise<Sport[]> {
  return fetchJson<Sport[]>(API_URLS.sports);
}

export function findSportById(
  sports: Sport[],
  sportId: number
): Sport | undefined {
  return sports.find((sport) => sport.id === sportId);
}

export function findSportBySlug(
  sports: Sport[],
  sportSlug: SportSlug
): Sport | undefined {
  return sports.find((sport) => sport.slug === sportSlug);
}

export function getSportBySlug(
  sports: Sport[],
  sportSlug: SportSlug
): Sport {
  const sport = findSportBySlug(sports, sportSlug);

  if (!sport) {
    throw new SportNotFoundError(sportSlug);
  }

  return sport;
}

export function ensureSportExists(
  sports: Sport[],
  sportSlug: SportSlug
): Sport {
  try {
    return getSportBySlug(sports, sportSlug);
  } catch (error: unknown) {
    if (error instanceof SportNotFoundError) {
      throw error;
    }

    throw new ApiError("Une erreur inattendue est survenue.");
  }
}