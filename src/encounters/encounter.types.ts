export type EncounterStatus =
  | "finished"
  | "live"
  | "scheduled";

export interface CommonEncounter {
  id: number;
  sport_id: number;
  type: string;
  date: string;
  status: EncounterStatus;
  venue: string;
}

export interface FootballEncounter extends CommonEncounter {
  sport_id: 1;
  stage: string;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  attendance: number;
  scorers: Array<{
    athlete_id: number;
    minute: number;
  }>;
}

export interface BasketballEncounter extends CommonEncounter {
  sport_id: 2;
  playoff_round: string;
  game_number: number;
  series: string;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  attendance: number;
  quarter_scores: {
    home: number[];
    away: number[];
  };
}

export interface MmaEncounter extends CommonEncounter {
  sport_id: 3;
  card_position: string;
  fighter1_id: number;
  fighter2_id: number;
  winner_id: number;
  method: string;
  round: number;
  time: string;
  weight_class: string;
  title_fight: boolean;
}

export type Encounter =
  | FootballEncounter
  | BasketballEncounter
  | MmaEncounter;