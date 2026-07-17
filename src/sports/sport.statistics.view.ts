import type { SportStatistics } from "./sport.statistics.js";

export function renderSportStatistics(
  container: HTMLElement,
  statistics: SportStatistics
): void {
  container.replaceChildren();

  const fragment = document.createDocumentFragment();

  const items = [
    ["Rencontres totales", statistics.totalEncounters],
    ["Rencontres terminées", statistics.finishedEncounters],
    ["Rencontres en cours", statistics.liveEncounters],
    ["Rencontres programmées", statistics.scheduledEncounters],
    ["Équipes", statistics.totalTeams]
  ];

  items.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "sport-statistics__item";

    const title = document.createElement("strong");
    title.textContent = `${label} :`;

    const count = document.createElement("span");
    count.textContent = String(value);

    item.append(title, count);
    fragment.append(item);
  });

  container.append(fragment);
}
