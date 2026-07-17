import { API_URLS } from "../config/api.config.js";
import { fetchJson } from "../core/api/fetch-json.js";
import type { Encounter, EncounterStatus } from "./encounter.types.js";

export async function getEncounters(): Promise<Encounter[]> {
  return fetchJson<Encounter[]>(API_URLS.encounters);
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