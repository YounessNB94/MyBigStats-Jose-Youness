import type { Encounter } from "./encounter.types.js";
import type { Sport } from "../sports/sport.types.js";
import type { Team } from "../teams/team.types.js";
import {
  formatEncounterDate,
  formatEncounterScore,
  getEncounterTitle,
  findEncounterSport
} from "./encounter.utils.js";

function createInfoLine(label: string, value: string): HTMLParagraphElement {
  const paragraph = document.createElement("p");
  paragraph.textContent = `${label} : ${value}`;
  return paragraph;
}

export function createEncounterCard(
  encounter: Encounter,
  teams: Team[],
  sports: Sport[]
): HTMLElement {
  const article = document.createElement("article");
  article.className = "encounter-card";

  const title = document.createElement("h2");
  title.textContent = getEncounterTitle(encounter, teams);

  const sport = findEncounterSport(encounter, sports);
  const sportName = sport?.name ?? "Sport inconnu";
  const dateText = formatEncounterDate(encounter.date);
  const scoreText = formatEncounterScore(encounter);
  const statusText = encounter.status;

  article.append(
    title,
    createInfoLine("Sport", sportName),
    createInfoLine("Date", dateText),
    createInfoLine("Statut", statusText),
    createInfoLine("Score", scoreText)
  );

  return article;
}

export function renderEncounters(
  container: HTMLElement,
  encounters: Encounter[],
  teams: Team[],
  sports: Sport[]
): void {
  container.replaceChildren();

  if (encounters.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Aucun événement en cours.";
    container.append(message);
    return;
  }

  const fragment = document.createDocumentFragment();

  encounters.forEach((encounter) => {
    fragment.append(createEncounterCard(encounter, teams, sports));
  });

  container.append(fragment);
}

export function renderSportHistory(
  container: HTMLElement,
  encounters: Encounter[],
  teams: Team[],
  sports: Sport[]
): void {
  container.replaceChildren();

  const finishedEncounters = [...encounters]
    .filter((encounter) => encounter.status === "finished")
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime()
    );

  if (finishedEncounters.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Aucun historique disponible pour ce sport.";
    container.append(message);
    return;
  }

  const fragment = document.createDocumentFragment();

  finishedEncounters.forEach((encounter) => {
    const article = document.createElement("article");
    article.className = "encounter-card encounter-card--history";

    const title = document.createElement("h3");
    title.textContent = getEncounterTitle(encounter, teams);

    const sport = findEncounterSport(encounter, sports);
    const sportName = sport?.name ?? "Sport inconnu";

    article.append(
      title,
      createInfoLine("Date", formatEncounterDate(encounter.date)),
      createInfoLine("Participants", getEncounterTitle(encounter, teams)),
      createInfoLine("Score final", formatEncounterScore(encounter)),
      createInfoLine("Sport", sportName)
    );

    fragment.append(article);
  });

  container.append(fragment);
}
