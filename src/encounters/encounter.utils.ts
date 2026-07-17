import type { Encounter } from "./encounter.types.js";
import type { Sport } from "../sports/sport.types.js";
import type { Team } from "../teams/team.types.js";

function getEncounterTeamIds(encounter: Encounter): { firstTeamId: number; secondTeamId: number } | undefined {
  if ("home_team_id" in encounter && "away_team_id" in encounter) {
    return {
      firstTeamId: encounter.home_team_id,
      secondTeamId: encounter.away_team_id
    };
  }

  return undefined;
}

export function findEncounterSport(
  encounter: Encounter,
  sports: Sport[]
): Sport | undefined {
  return sports.find((sport) => sport.id === encounter.sport_id);
}

export function findEncounterFirstTeam(
  encounter: Encounter,
  teams: Team[]
): Team | undefined {
  const teamIds = getEncounterTeamIds(encounter);

  if (!teamIds) {
    return undefined;
  }

  return teams.find(
    (team) => team.id === teamIds.firstTeamId && team.sport_id === encounter.sport_id
  );
}

export function findEncounterSecondTeam(
  encounter: Encounter,
  teams: Team[]
): Team | undefined {
  const teamIds = getEncounterTeamIds(encounter);

  if (!teamIds) {
    return undefined;
  }

  return teams.find(
    (team) => team.id === teamIds.secondTeamId && team.sport_id === encounter.sport_id
  );
}

export function formatEncounterDate(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatEncounterScore(encounter: Encounter): string {
  if ("home_score" in encounter && "away_score" in encounter) {
    if (encounter.status === "scheduled") {
      return "À venir";
    }

    return `${encounter.home_score} - ${encounter.away_score}`;
  }

  if (encounter.status === "scheduled") {
    return "À venir";
  }

  return "Score indisponible";
}

export function getEncounterTitle(encounter: Encounter, teams: Team[]): string {
  const firstTeam = findEncounterFirstTeam(encounter, teams);
  const secondTeam = findEncounterSecondTeam(encounter, teams);

  if (firstTeam && secondTeam) {
    return `${firstTeam.name} vs ${secondTeam.name}`;
  }

  if (firstTeam) {
    return `${firstTeam.name} vs Équipe inconnue`;
  }

  if (secondTeam) {
    return `Équipe inconnue vs ${secondTeam.name}`;
  }

  const sport = findEncounterSport(encounter, [] as Sport[]);

  if (sport) {
    return `${sport.name} - ${encounter.type}`;
  }

  return `Rencontre ${encounter.id}`;
}
