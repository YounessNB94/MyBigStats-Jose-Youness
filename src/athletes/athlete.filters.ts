import type { Athlete } from "./athlete.types.js";
import { getAthleteFullName, normalizeText } from "./athlete.utils.js";

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
