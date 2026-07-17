import type { Athlete } from "./athlete.types.js";
import {
  getAthleteDisplayName,
  getAthleteRole,
  isMmaAthlete
} from "./athlete.utils.js";

interface AthleteStatEntry {
  label: string;
  value: number;
}

function getAthleteKeyStats(athlete: Athlete): AthleteStatEntry[] {
  if (isMmaAthlete(athlete)) {
    return [
      { label: "Victoires", value: athlete.stats.wins },
      { label: "Défaites", value: athlete.stats.losses }
    ];
  }

  if (athlete.sport_id === 1) {
    return [
      { label: "Buts", value: athlete.stats.goals },
      { label: "Passes décisives", value: athlete.stats.assists }
    ];
  }

  return [
    { label: "Points par match", value: athlete.stats.points_per_game },
    { label: "Rebonds par match", value: athlete.stats.rebounds_per_game }
  ];
}

export function createAthleteCard(athlete: Athlete): HTMLElement {
  const article = document.createElement("article");
  const name = document.createElement("h3");
  const role = document.createElement("p");
  const nationality = document.createElement("p");
  const stats = document.createElement("p");

  article.classList.add("athlete-card");
  article.dataset.athleteId = String(athlete.id);

  name.textContent = getAthleteDisplayName(athlete);
  role.textContent = getAthleteRole(athlete);
  nationality.textContent = athlete.nationality;

  stats.textContent = getAthleteKeyStats(athlete)
    .map((stat) => `${stat.label} : ${stat.value}`)
    .join(" · ");

  article.append(name, role, nationality, stats);

  return article;
}

export function renderAthletes(
  container: HTMLElement,
  athletes: Athlete[]
): void {
  container.replaceChildren();

  if (athletes.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Aucun athlète trouvé.";
    container.append(emptyMessage);
    return;
  }

  const fragment = document.createDocumentFragment();

  athletes.forEach((athlete) => {
    fragment.append(createAthleteCard(athlete));
  });

  container.append(fragment);
}
