import type { Athlete } from "./athlete.types.js";
import { getAthleteFullName, getAthleteRole, normalizeText } from "./athlete.utils.js";
import type { ActiveAthleteFilters } from "../filters/filter.types.js";

export function searchAthletes(
  athletes: Athlete[],
  query: string
): Athlete[] {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [...athletes];
  }

  return athletes.filter((athlete) => {
    const fullName = normalizeText(getAthleteFullName(athlete));
    const nickname = normalizeText(athlete.nickname ?? "");

    return (
      fullName.includes(normalizedQuery) ||
      nickname.includes(normalizedQuery)
    );
  });
}

export function applyAthleteFilters(
  athletes: Athlete[],
  filters: ActiveAthleteFilters
): Athlete[] {
  const normalizedQuery = normalizeText(filters.query ?? "");

  return athletes.filter((athlete) => {
    const fullName = normalizeText(getAthleteFullName(athlete));
    const nickname = normalizeText(athlete.nickname ?? "");
    const role = normalizeText(getAthleteRole(athlete));

    const matchesQuery =
      normalizedQuery === "" ||
      fullName.includes(normalizedQuery) ||
      nickname.includes(normalizedQuery);

    const matchesSport =
      filters.sportId === undefined ||
      athlete.sport_id === filters.sportId;

    const matchesPosition =
      !filters.position ||
      role === normalizeText(filters.position);

    return matchesQuery && matchesSport && matchesPosition;
  });
}
