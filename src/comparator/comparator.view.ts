import type { Athlete } from "../athletes/athlete.types.js";
import { findAthleteById } from "../athletes/athlete.service.js";
import { getAthleteDisplayName, getAthleteRole } from "../athletes/athlete.utils.js";
import { compareAthletes } from "./comparator.service.js";
import { ComparisonError } from "./comparator.errors.js";
import { comparisonMetrics } from "./comparator.types.js";
import type { ComparisonValue } from "./comparator.types.js";

export interface ComparatorElements {
  singleAthleteSelect: HTMLSelectElement;
  singleAthleteResult: HTMLElement;
  firstAthleteSelect: HTMLSelectElement;
  secondAthleteSelect: HTMLSelectElement;
  compareButton: HTMLButtonElement;
  comparisonResult: HTMLElement;
}

interface RadarScale {
  metricLabel: string;
  maxValue: number;
}

export function getComparatorElements(): ComparatorElements | null {
  const singleAthleteSelect = document.querySelector<HTMLSelectElement>(
    "#single-athlete"
  );
  const singleAthleteResult = document.querySelector<HTMLElement>(
    "#single-athlete-result"
  );
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
    !singleAthleteSelect ||
    !singleAthleteResult ||
    !firstAthleteSelect ||
    !secondAthleteSelect ||
    !compareButton ||
    !comparisonResult
  ) {
    return null;
  }

  return {
    singleAthleteSelect,
    singleAthleteResult,
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

function getAthleteMetricValues(athlete: Athlete): number[] {
  const metrics = comparisonMetrics[athlete.sport_id];
  const stats = athlete.stats as unknown as Record<string, number>;

  return metrics.map((metric) => {
    return stats[metric.key] ?? 0;
  });
}

function getRadarScales(athletes: Athlete[], sportId: 1 | 2 | 3): RadarScale[] {
  const metrics = comparisonMetrics[sportId];

  return metrics.map((metric) => {
    const maxValue = athletes.reduce((currentMax, athlete) => {
      if (athlete.sport_id !== sportId) {
        return currentMax;
      }

      const stats = athlete.stats as unknown as Record<string, number>;
      const value = stats[metric.key] ?? 0;

      return Math.max(currentMax, value);
    }, 0);

    return {
      metricLabel: metric.label,
      maxValue: Math.max(maxValue, 1)
    };
  });
}

function getRadarPoints(
  values: number[],
  scales: RadarScale[],
  radius: number
): string {
  const count = values.length;

  if (count === 0) {
    return "";
  }

  const center = 100;

  return values
    .map((value, index) => {
      const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
      const distance = (value / scales[index].maxValue) * radius;
      const x = center + Math.cos(angle) * distance;
      const y = center + Math.sin(angle) * distance;

      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function getAxisLabelPosition(
  index: number,
  count: number,
  radius: number
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  const labelRadius = radius + 18;

  return {
    x: 100 + Math.cos(angle) * labelRadius,
    y: 100 + Math.sin(angle) * labelRadius
  };
}

function getRingLabelPosition(
  index: number,
  count: number,
  radius: number
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;

  return {
    x: 100 + Math.cos(angle) * radius,
    y: 100 + Math.sin(angle) * radius
  };
}

function createRadarChart(athlete: Athlete, scales: RadarScale[]): SVGSVGElement {
  const metrics = comparisonMetrics[athlete.sport_id];
  const values = getAthleteMetricValues(athlete);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute("viewBox", "0 0 200 200");
  svg.setAttribute("class", "athlete-radar");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Graphique radar des statistiques de ${getAthleteDisplayName(athlete)}`);

  const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
  title.textContent = `Statistiques radar de ${getAthleteDisplayName(athlete)}`;
  svg.append(title);

  const description = document.createElementNS("http://www.w3.org/2000/svg", "desc");
  description.textContent = metrics
    .map((metric, index) => {
      const maxValue = scales[index]?.maxValue ?? 1;
      const percentage = Math.round(((values[index] ?? 0) / maxValue) * 100);

      return `${metric.label}: ${values[index] ?? 0} (${percentage}%)`;
    })
    .join(". ");
  svg.append(description);

  [0.25, 0.5, 0.75, 1].forEach((ratio) => {
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const points = metrics
      .map((_, index) => {
        const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
        const x = 100 + Math.cos(angle) * 70 * ratio;
        const y = 100 + Math.sin(angle) * 70 * ratio;

        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

    polygon.setAttribute("points", points);
    polygon.setAttribute("class", "athlete-radar__grid");
    svg.append(polygon);
  });

  metrics.forEach((_, index) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const x = 100 + Math.cos(angle) * 70;
    const y = 100 + Math.sin(angle) * 70;

    line.setAttribute("x1", "100");
    line.setAttribute("y1", "100");
    line.setAttribute("x2", x.toFixed(1));
    line.setAttribute("y2", y.toFixed(1));
    line.setAttribute("class", "athlete-radar__axis");
    svg.append(line);
  });

  const dataPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  dataPolygon.setAttribute("points", getRadarPoints(values, scales, 70));
  dataPolygon.setAttribute("class", "athlete-radar__data");
  svg.append(dataPolygon);

  metrics.forEach((metric, index) => {
    const { x, y } = getAxisLabelPosition(index, metrics.length, 70);
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x.toFixed(1));
    label.setAttribute("y", y.toFixed(1));
    label.setAttribute("class", "athlete-radar__label");
    label.textContent = metric.label;
    svg.append(label);
  });

  values.forEach((value, index) => {
    const scale = scales[index];
    const angle = (Math.PI * 2 * index) / values.length - Math.PI / 2;
    const distance = (value / scale.maxValue) * 70;

    const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    point.setAttribute("cx", (100 + Math.cos(angle) * distance).toFixed(1));
    point.setAttribute("cy", (100 + Math.sin(angle) * distance).toFixed(1));
    point.setAttribute("r", "2.8");
    point.setAttribute("class", "athlete-radar__point");
    svg.append(point);
  });

  return svg;
}

function createRadarStatsSummary(
  athlete: Athlete,
  scales: RadarScale[]
): HTMLElement {
  const summary = document.createElement("div");
  summary.classList.add("athlete-radar-summary");

  const metrics = comparisonMetrics[athlete.sport_id];
  const values = getAthleteMetricValues(athlete);

  metrics.forEach((metric, index) => {
    const row = document.createElement("div");
    row.classList.add("athlete-radar-summary__item");

    const label = document.createElement("strong");
    label.textContent = metric.label;

    const value = document.createElement("span");
    const maxValue = scales[index]?.maxValue ?? 1;
    const currentValue = values[index] ?? 0;
    const percentage = Math.round((currentValue / maxValue) * 100);

    value.textContent = `${currentValue} / ${maxValue} (${percentage}%)`;

    row.append(label, value);
    summary.append(row);
  });

  return summary;
}

function createSingleAthleteRadarCard(
  athlete: Athlete,
  scales: RadarScale[]
): HTMLElement {
  const article = document.createElement("article");
  article.classList.add("athlete-radar-card");

  const title = document.createElement("h3");
  title.textContent = getAthleteDisplayName(athlete);

  const role = document.createElement("p");
  role.textContent = getAthleteRole(athlete);

  article.append(
    title,
    role,
    createRadarChart(athlete, scales),
    createRadarStatsSummary(athlete, scales)
  );

  return article;
}

function renderSingleAthleteResult(
  container: HTMLElement,
  athlete: Athlete | undefined,
  athletes: Athlete[]
): void {
  container.replaceChildren();

  if (!athlete) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent =
      "Sélectionnez un athlète pour afficher ses statistiques.";
    container.append(emptyMessage);
    return;
  }

  container.append(
    createSingleAthleteRadarCard(
      athlete,
      getRadarScales(athletes, athlete.sport_id)
    )
  );
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
  renderSingleAthleteResult(elements.singleAthleteResult, undefined, athletes);
  populateAthleteSelect(elements.firstAthleteSelect, athletes);
  populateAthleteSelect(elements.secondAthleteSelect, athletes);
  populateAthleteSelect(elements.singleAthleteSelect, athletes);

  elements.singleAthleteSelect.addEventListener("change", () => {
    renderSingleAthleteResult(
      elements.singleAthleteResult,
      getSelectedAthlete(elements.singleAthleteSelect, athletes),
      athletes
    );
  });

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
