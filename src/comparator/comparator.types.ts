import type { BaseAthlete } from "../athletes/athlete.types.js";

export interface ComparisonMetric {
  key: string;
  label: string;
}

export type AthleteSummary = Pick<
  BaseAthlete,
  "id" | "first_name" | "last_name" | "nickname"
>;

export interface ComparisonValue {
  label: string;
  firstValue: number;
  secondValue: number;
}

export const comparisonMetrics: Record<1 | 2 | 3, ComparisonMetric[]> = {
  1: [
    { key: "matches_played", label: "Matchs joués" },
    { key: "goals", label: "Buts" },
    { key: "assists", label: "Passes décisives" },
    { key: "minutes_played", label: "Minutes jouées" }
  ],
  2: [
    { key: "games_played", label: "Matchs joués" },
    { key: "points_per_game", label: "Points par match" },
    { key: "rebounds_per_game", label: "Rebonds par match" },
    { key: "assists_per_game", label: "Passes par match" }
  ],
  3: [
    { key: "wins", label: "Victoires" },
    { key: "losses", label: "Défaites" },
    { key: "wins_by_ko", label: "Victoires par KO" },
    { key: "title_defenses", label: "Défenses de titre" }
  ]
};
