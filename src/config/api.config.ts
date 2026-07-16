export type ApiResource =
  | "sports"
  | "athletes"
  | "encounters"
  | "teams";

export const API_URLS: Record<ApiResource, string> = {
  sports: "https://keligmartin.github.io/api/sports.json",
  athletes: "https://keligmartin.github.io/api/athletes.json",
  encounters: "https://keligmartin.github.io/api/rencontres.json",
  teams: "https://keligmartin.github.io/api/equipes.json"
};