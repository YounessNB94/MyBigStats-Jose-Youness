import { API_URLS } from "../config/api.config.js";
import { fetchJson } from "../core/api/fetch-json.js";
import type { Encounter, EncounterStatus } from "./encounter.types.js";

export interface HomeEncounterSelection {
  encounters: Encounter[];
  usesDemoFallback: boolean;
}

export async function getEncounters(): Promise<Encounter[]> {
  return fetchJson<Encounter[]>(API_URLS.encounters);
}

export function getHomeEncounterSelection(
  encounters: Encounter[]
): HomeEncounterSelection {
  const liveEncounters = getEncountersByStatus(encounters, "live");

  if (liveEncounters.length > 0) {
    return {
      encounters: liveEncounters,
      usesDemoFallback: false
    };
  }

  const fallbackCandidates = [...encounters]
    .filter(
      (encounter) =>
        encounter.status === "finished" || encounter.status === "scheduled"
    )
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime()
    );

  const demoEncounters = fallbackCandidates.slice(0, 3).map((encounter) => ({
    ...encounter,
    status: "live" as const
  }));

  return {
    encounters: demoEncounters,
    usesDemoFallback: demoEncounters.length > 0
  };
}

export function getEncountersBySportId(
  encounters: Encounter[],
  sportId: number
): Encounter[] {
  return encounters.filter((encounter) => encounter.sport_id === sportId);
}

export function getEncountersByStatus(
  encounters: Encounter[],
  status: EncounterStatus
): Encounter[] {
  return encounters.filter((encounter) => encounter.status === status);
}

export function getCurrentEncounters(
  encounters: Encounter[]
): Encounter[] {
  return getEncountersByStatus(encounters, "live");
}

export function getFinishedEncounters(
  encounters: Encounter[]
): Encounter[] {
  return getEncountersByStatus(encounters, "finished");
}

export function getScheduledEncounters(
  encounters: Encounter[]
): Encounter[] {
  return getEncountersByStatus(encounters, "scheduled");
}

export function sortEncountersByDate(
  encounters: Encounter[]
): Encounter[] {
  return [...encounters].sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  );
}