import type { Athlete } from "../athletes/athlete.types.js";
import { getAthleteRole } from "../athletes/athlete.utils.js";

export function getAvailablePositions(athletes: Athlete[]): string[] {
  const positions = athletes.map((athlete) => getAthleteRole(athlete));

  return [...new Set(positions)].sort((first, second) =>
    first.localeCompare(second, "fr")
  );
}

export function renderPositionOptions(
  select: HTMLSelectElement,
  athletes: Athlete[]
): void {
  select.replaceChildren();

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Toutes";
  select.append(defaultOption);

  getAvailablePositions(athletes).forEach((position) => {
    const option = document.createElement("option");
    option.value = position;
    option.textContent = position;
    select.append(option);
  });
}
