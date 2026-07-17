import type { Athlete } from "./athlete.types.js";
import {
  getAthleteDisplayName,
  getAthleteRole,
  isMmaAthlete
} from "./athlete.utils.js";

interface AthleteCardOptions {
  href?: string;
}

interface AthleteStatEntry {
  label: string;
  value: number | string;
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

function getAthleteDetailedStats(athlete: Athlete): AthleteStatEntry[] {
  if (isMmaAthlete(athlete)) {
    return [
      { label: "Victoires par KO", value: athlete.stats.wins_by_ko },
      { label: "Victoires par soumission", value: athlete.stats.wins_by_submission },
      { label: "Victoires par décision", value: athlete.stats.wins_by_decision },
      { label: "Défenses de titre", value: athlete.stats.title_defenses }
    ];
  }

  if (athlete.sport_id === 1) {
    return [
      { label: "Matchs joués", value: athlete.stats.matches_played },
      { label: "Minutes jouées", value: athlete.stats.minutes_played },
      { label: "Cartons jaunes", value: athlete.stats.yellow_cards },
      { label: "Cartons rouges", value: athlete.stats.red_cards }
    ];
  }

  return [
    { label: "Matchs joués", value: athlete.stats.games_played },
    { label: "Passes par match", value: athlete.stats.assists_per_game },
    { label: "Interceptions par match", value: athlete.stats.steals_per_game },
    { label: "Contres par match", value: athlete.stats.blocks_per_game }
  ];
}

function createStatsDetails(athlete: Athlete): HTMLElement {
  const section = document.createElement("div");
  const title = document.createElement("p");
  title.textContent = "Statistiques détaillées";

  section.append(title);

  getAthleteDetailedStats(athlete).forEach((stat) => {
    const entry = document.createElement("p");
    entry.textContent = `${stat.label} : ${stat.value}`;
    section.append(entry);
  });

  return section;
}

export function createAthleteCard(
  athlete: Athlete,
  options: AthleteCardOptions = {}
): HTMLElement {
  const article = options.href
    ? document.createElement("a")
    : document.createElement("article");
  const name = document.createElement("h3");
  const role = document.createElement("p");
  const nationality = document.createElement("p");
  const stats = document.createElement("p");

  article.classList.add("athlete-card");
  if (options.href) {
    article.classList.add("athlete-card--link");
    article.setAttribute("href", options.href);
  }
  article.dataset.athleteId = String(athlete.id);

  name.textContent = getAthleteDisplayName(athlete);
  role.textContent = getAthleteRole(athlete);
  nationality.textContent = athlete.nationality;

  stats.textContent = getAthleteKeyStats(athlete)
    .map((stat) => `${stat.label} : ${stat.value}`)
    .join(" · ");

  article.append(name, role, nationality, stats, createStatsDetails(athlete));

  return article;
}

export function renderAthletes(
  container: HTMLElement,
  athletes: Athlete[],
  sportSlug?: string
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
    const href = sportSlug ? `${sportSlug}.html?athlete=${athlete.id}` : undefined;
    fragment.append(createAthleteCard(athlete, { href }));
  });

  container.append(fragment);
}
