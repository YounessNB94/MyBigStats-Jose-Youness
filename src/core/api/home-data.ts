import { getEncounters } from "../../encounters/encounter.service.js";
import { getSports } from "../../sports/sport.service.js";
import { getTeams } from "../../teams/team.service.js";
import type { Encounter } from "../../encounters/encounter.types.js";
import type { Sport } from "../../sports/sport.types.js";
import type { Team } from "../../teams/team.types.js";

export interface HomeData {
  sports: Sport[];
  teams: Team[];
  encounters: Encounter[];
}

export async function loadHomeData(): Promise<HomeData> {
  const [sports, teams, encounters] = await Promise.all([
    getSports(),
    getTeams(),
    getEncounters()
  ]);

  return {
    sports,
    teams,
    encounters
  };
}