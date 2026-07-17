import { fetchJson } from "../core/api/fetch-json.js";
import { API_URLS } from "../config/api.config.js";
import type { Athlete } from "./athlete.types.js";

export function getAthletes(): Promise<Athlete[]> {
  return fetchJson<Athlete[]>(API_URLS.athletes);
}

export function findAthleteById(
  athletes: Athlete[],
  athleteId: number
): Athlete | undefined {
  return athletes.find((athlete) => athlete.id === athleteId);
}

export function getAthletesBySportId(
  athletes: Athlete[],
  sportId: number
): Athlete[] {
  return athletes.filter((athlete) => athlete.sport_id === sportId);
}

export function getAthletesByTeamId(
  athletes: Athlete[],
  teamId: number
): Athlete[] {
  return athletes.filter((athlete) => athlete.team_id === teamId);
}
