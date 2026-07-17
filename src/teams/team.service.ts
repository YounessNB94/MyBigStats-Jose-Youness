import { API_URLS } from "../config/api.config.js";
import { fetchJson } from "../core/api/fetch-json.js";
import type { Team } from "./team.types.js";

export async function getTeams(): Promise<Team[]> {
  return fetchJson<Team[]>(API_URLS.teams);
}

export function findTeamById(
  teams: Team[],
  teamId: number | null
): Team | undefined {
  if (teamId === null) {
    return undefined;
  }

  return teams.find((team) => team.id === teamId);
}

export function getTeamsBySportId(
  teams: Team[],
  sportId: number
): Team[] {
  return teams.filter((team) => team.sport_id === sportId);
}