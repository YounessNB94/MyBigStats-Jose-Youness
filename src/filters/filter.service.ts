import type { Athlete } from "../athletes/athlete.types.js";
import { applyAthleteFilters } from "../athletes/athlete.filters.js";
import { renderAthletes } from "../athletes/athlete.view.js";
import { renderPositionOptions } from "./filter.view.js";
import type { ActiveAthleteFilters } from "./filter.types.js";

export interface AthleteFilterElements {
  searchInput: HTMLInputElement;
  positionSelect: HTMLSelectElement;
  resetButton: HTMLButtonElement;
  resultCount: HTMLElement;
  athleteList: HTMLElement;
}

export function getAthleteFilterElements(): AthleteFilterElements | null {
  const searchInput = document.querySelector<HTMLInputElement>(
    "#athlete-search"
  );
  const positionSelect = document.querySelector<HTMLSelectElement>(
    "#position-filter"
  );
  const resetButton = document.querySelector<HTMLButtonElement>(
    "#reset-filters"
  );
  const resultCount = document.querySelector<HTMLElement>("#result-count");
  const athleteList = document.querySelector<HTMLElement>("#athlete-list");

  if (
    !searchInput ||
    !positionSelect ||
    !resetButton ||
    !resultCount ||
    !athleteList
  ) {
    return null;
  }

  return { searchInput, positionSelect, resetButton, resultCount, athleteList };
}

export function initializeAthleteFilters(
  elements: AthleteFilterElements,
  athletes: Athlete[],
  sportSlug?: string
): void {
  const filters: ActiveAthleteFilters = {};

  renderPositionOptions(elements.positionSelect, athletes);

  function applyAndRender(): void {
    const filteredAthletes = applyAthleteFilters(athletes, filters);

    renderAthletes(elements.athleteList, filteredAthletes, sportSlug);

    elements.resultCount.textContent =
      `${filteredAthletes.length} athlète(s) trouvé(s)`;
  }

  elements.searchInput.addEventListener("input", () => {
    filters.query = elements.searchInput.value;
    applyAndRender();
  });

  elements.positionSelect.addEventListener("change", () => {
    filters.position = elements.positionSelect.value || undefined;
    applyAndRender();
  });

  elements.resetButton.addEventListener("click", () => {
    elements.searchInput.value = "";
    elements.positionSelect.value = "";
    filters.query = undefined;
    filters.position = undefined;
    applyAndRender();
  });

  applyAndRender();
}
