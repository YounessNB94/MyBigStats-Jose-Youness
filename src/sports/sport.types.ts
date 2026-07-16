export type SportSlug =
  | "football"
  | "basketball"
  | "mma";

export interface FootballCompetition {
  name: string;
  host_country: string;
  start_date: string;
  end_date: string;
  number_of_teams: number;
  format: string;
}

export interface BasketballCompetition {
  name: string;
  host_country: string;
  start_date: string;
  end_date: string;
  number_of_teams: number;
  format: string;
}

export interface MmaCompetition {
  name: string;
  host_country: string;
  venue: string;
  date: string;
  format: string;
}

export type SportCompetition =
  | FootballCompetition
  | BasketballCompetition
  | MmaCompetition;

export interface Sport {
  id: number;
  name: string;
  slug: SportSlug;
  type: "team" | "individual";
  players_per_team: number;
  match_duration_minutes: number;
  governing_body: string;
  competition: SportCompetition;
}