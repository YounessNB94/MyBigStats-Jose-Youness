import type { Athlete } from "../athletes/athlete.types.js";
import { findAthleteById } from "../athletes/athlete.service.js";
import { getAthleteDisplayName } from "../athletes/athlete.utils.js";
import { compareAthletes } from "./comparator.service.js";
import { ComparisonError } from "./comparator.errors.js";
import type { ComparisonValue } from "./comparator.types.js";

export interface ComparatorElements {
  firstAthleteSelect: HTMLSelectElement;
  secondAthleteSelect: HTMLSelectElement;
  compareButton: HTMLButtonElement;
  comparisonResult: HTMLElement;
}

export function getComparatorElements(): ComparatorElements | null {
  const firstAthleteSelect = document.querySelector<HTMLSelectElement>(
    "#first-athlete"
  );
  const secondAthleteSelect = document.querySelector<HTMLSelectElement>(
    "#second-athlete"
  );
  const compareButton = document.querySelector<HTMLButtonElement>(
    "#compare-athletes"
  );
  const comparisonResult = document.querySelector<HTMLElement>(
    "#comparison-result"
  );

  if (
    !firstAthleteSelect ||
    !secondAthleteSelect ||
    !compareButton ||
    !comparisonResult
  ) {
    return null;
  }

  return {
    firstAthleteSelect,
    secondAthleteSelect,
    compareButton,
    comparisonResult
  };
}

function populateAthleteSelect(
  select: HTMLSelectElement,
  athletes: Athlete[]
): void {
  select.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Sélectionnez un athlète";
  select.append(placeholder);

  athletes.forEach((athlete) => {
    const option = document.createElement("option");
    option.value = String(athlete.id);
    option.textContent = getAthleteDisplayName(athlete);
    select.append(option);
  });
}

function getSelectedAthlete(
  select: HTMLSelectElement,
  athletes: Athlete[]
): Athlete | undefined {
  if (!select.value) {
    return undefined;
  }

  return findAthleteById(athletes, Number(select.value));
}

function renderComparisonError(container: HTMLElement, message: string): void {
  container.replaceChildren();

  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  container.append(errorMessage);
}

function getBestValueLabel(
  value: ComparisonValue,
  firstAthlete: Athlete,
  secondAthlete: Athlete
): string {
  if (value.firstValue === value.secondValue) {
    return "Égalité";
  }

  const winner =
    value.firstValue > value.secondValue ? firstAthlete : secondAthlete;

  return `Meilleure valeur : ${getAthleteDisplayName(winner)}`;
}

export function calculateBarWidth(value: number, maximum: number): number {
  if (maximum <= 0) {
    return 0;
  }

  return Math.round((value / maximum) * 100);
}

function createComparisonBarRow(
  athleteName: string,
  value: number,
  maximum: number,
  metricLabel: string
): HTMLElement {
  const row = document.createElement("div");
  row.classList.add("comparison-row");

  const name = document.createElement("span");
  name.textContent = athleteName;

  const barShell = document.createElement("div");
  barShell.classList.add("comparison-bar-shell");

  const bar = document.createElement("div");
  bar.classList.add("comparison-bar");
  bar.style.width = `${calculateBarWidth(value, maximum)}%`;
  bar.setAttribute("role", "img");
  bar.setAttribute("aria-label", `${value} ${metricLabel.toLowerCase()}`);
  barShell.append(bar);

  const valueLabel = document.createElement("strong");
  valueLabel.textContent = String(value);

  row.append(name, barShell, valueLabel);

  return row;
}

function renderComparisonResult(
  container: HTMLElement,
  firstAthlete: Athlete,
  secondAthlete: Athlete,
  values: ComparisonValue[]
): void {
  container.replaceChildren();

  const card = document.createElement("article");
  card.classList.add("comparison-card");

  const title = document.createElement("h3");
  title.textContent = `${getAthleteDisplayName(firstAthlete)} vs ${getAthleteDisplayName(secondAthlete)}`;
  card.append(title);

  if (values.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Aucune statistique disponible pour ce sport.";
    card.append(emptyMessage);
    container.append(card);
    return;
  }

  values.forEach((value) => {
    const metricTitle = document.createElement("h4");
    metricTitle.textContent = value.label;

    const maximum = Math.max(value.firstValue, value.secondValue);

    const firstRow = createComparisonBarRow(
      getAthleteDisplayName(firstAthlete),
      value.firstValue,
      maximum,
      value.label
    );

    const secondRow = createComparisonBarRow(
      getAthleteDisplayName(secondAthlete),
      value.secondValue,
      maximum,
      value.label
    );

    const bestLine = document.createElement("p");
    bestLine.textContent = getBestValueLabel(value, firstAthlete, secondAthlete);

    card.append(metricTitle, firstRow, secondRow, bestLine);
  });

  container.append(card);
}

export function initializeComparator(
  elements: ComparatorElements,
  athletes: Athlete[]
): void {
  populateAthleteSelect(elements.firstAthleteSelect, athletes);
  populateAthleteSelect(elements.secondAthleteSelect, athletes);

  elements.compareButton.addEventListener("click", () => {
    const firstAthlete = getSelectedAthlete(
      elements.firstAthleteSelect,
      athletes
    );
    const secondAthlete = getSelectedAthlete(
      elements.secondAthleteSelect,
      athletes
    );

    try {
      const values = compareAthletes(firstAthlete, secondAthlete);

      renderComparisonResult(
        elements.comparisonResult,
        firstAthlete!,
        secondAthlete!,
        values
      );
    } catch (error: unknown) {
      if (error instanceof ComparisonError) {
        renderComparisonError(elements.comparisonResult, error.message);
        return;
      }

      renderComparisonError(
        elements.comparisonResult,
        "Une erreur inattendue est survenue."
      );
    }
  });
}
