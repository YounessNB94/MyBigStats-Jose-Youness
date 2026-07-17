import type { Encounter } from "../encounters/encounter.types.js";
import type { Team } from "../teams/team.types.js";

export interface SportStatistics {
  totalEncounters: number;
  finishedEncounters: number;
  liveEncounters: number;
  scheduledEncounters: number;
  totalTeams: number;
}

export function calculateSportStatistics(
  encounters: Encounter[],
  teams: Team[]
): SportStatistics {
  return {
    totalEncounters: encounters.length,
    finishedEncounters: encounters.filter((encounter) => encounter.status === "finished").length,
    liveEncounters: encounters.filter((encounter) => encounter.status === "live").length,
    scheduledEncounters: encounters.filter((encounter) => encounter.status === "scheduled").length,
    totalTeams: teams.length
  };
}
