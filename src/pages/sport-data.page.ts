import { loadHomeData } from "../core/api/home-data.js";
import { SportNotFoundError } from "../core/errors/api.errors.js";
import {
  getCurrentEncounters,
  getEncountersBySportId,
  getFinishedEncounters,
  getScheduledEncounters
} from "../encounters/encounter.service.js";
import type { Encounter } from "../encounters/encounter.types.js";
import { getSportBySlug } from "../sports/sport.service.js";
import type { Sport, SportSlug } from "../sports/sport.types.js";
import { getTeamsBySportId } from "../teams/team.service.js";
import type { Team } from "../teams/team.types.js";

export interface SportPageData {
  sport: Sport;
  sports: Sport[];
  teams: Team[];
  encounters: Encounter[];
  currentEncounters: Encounter[];
  finishedEncounters: Encounter[];
  scheduledEncounters: Encounter[];
}

function isSportSlug(value: string | undefined): value is SportSlug {
  return value === "football" || value === "basketball" || value === "mma";
}

export async function loadSportPageData(): Promise<SportPageData> {
  const body = document.body;

  if (!body) {
    throw new SportNotFoundError("inconnu");
  }

  const slug = body.dataset.sportSlug;

  if (!isSportSlug(slug)) {
    throw new SportNotFoundError(slug ?? "inconnu");
  }

  const data = await loadHomeData();
  const sport = getSportBySlug(data.sports, slug);
  const sportTeams = getTeamsBySportId(data.teams, sport.id);
  const sportEncounters = getEncountersBySportId(data.encounters, sport.id);

  return {
    sport,
    sports: data.sports,
    teams: sportTeams,
    encounters: sportEncounters,
    currentEncounters: getCurrentEncounters(sportEncounters),
    finishedEncounters: getFinishedEncounters(sportEncounters),
    scheduledEncounters: getScheduledEncounters(sportEncounters)
  };
}
