import type { Athlete, MmaAthlete } from "./athlete.types.js";

export function getAthleteFullName(athlete: Athlete): string {
  return `${athlete.first_name} ${athlete.last_name}`;
}

export function getAthleteDisplayName(athlete: Athlete): string {
  const fullName = getAthleteFullName(athlete);

  if (!athlete.nickname) {
    return fullName;
  }

  return `${athlete.first_name} "${athlete.nickname}" ${athlete.last_name}`;
}

export function formatBirthDate(athlete: Athlete): string {
  const birthDate = new Date(athlete.birth_date);

  return birthDate.toLocaleDateString("fr-FR");
}

export function getAthleteAge(athlete: Athlete): number {
  const birthDate = new Date(athlete.birth_date);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

export function isMmaAthlete(
  athlete: Athlete
): athlete is MmaAthlete {
  return athlete.sport_id === 3;
}

export function getAthleteRole(athlete: Athlete): string {
  if (isMmaAthlete(athlete)) {
    return athlete.weight_class;
  }

  return athlete.position;
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
