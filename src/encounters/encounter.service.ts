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
  const selectedEncounters: Encounter[] = [];
  let usesDemoFallback = false;

  for (const sportId of [1, 2, 3]) {
    const liveEncounter = [...encounters]
      .filter(
        (encounter) => encounter.sport_id === sportId && encounter.status === "live"
      )
      .sort(
        (first, second) =>
          new Date(second.date).getTime() - new Date(first.date).getTime()
      )[0];

    if (liveEncounter) {
      selectedEncounters.push(liveEncounter);
      continue;
    }

    const fallbackEncounter = [...encounters]
      .filter(
        (encounter) =>
          encounter.sport_id === sportId &&
          (encounter.status === "finished" || encounter.status === "scheduled")
      )
      .sort(
        (first, second) =>
          new Date(second.date).getTime() - new Date(first.date).getTime()
      )[0];

    if (fallbackEncounter) {
      selectedEncounters.push({
        ...fallbackEncounter,
        status: "live" as const
      });
      usesDemoFallback = true;
    }
  }

  return {
    encounters: selectedEncounters,
    usesDemoFallback
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