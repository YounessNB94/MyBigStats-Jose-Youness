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

    const firstLine = document.createElement("p");
    firstLine.textContent = `${getAthleteDisplayName(firstAthlete)} : ${value.firstValue}`;

    const secondLine = document.createElement("p");
    secondLine.textContent = `${getAthleteDisplayName(secondAthlete)} : ${value.secondValue}`;

    const bestLine = document.createElement("p");
    bestLine.textContent = getBestValueLabel(value, firstAthlete, secondAthlete);

    card.append(metricTitle, firstLine, secondLine, bestLine);
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
