export interface BaseAthlete {
  id: number;
  first_name: string;
  last_name: string;
  nickname?: string;
  nationality: string;
  birth_date: string;
  height_cm: number;
  weight_kg: number;
}

export interface FootballStats {
  matches_played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
}

export interface BasketballStats {
  games_played: number;
  points_per_game: number;
  rebounds_per_game: number;
  assists_per_game: number;
  steals_per_game: number;
  blocks_per_game: number;
  field_goal_percentage: number;
  three_point_percentage: number;
  free_throw_percentage: number;
  minutes_per_game: number;
}

export interface MmaStats {
  wins: number;
  losses: number;
  draws: number;
  no_contests: number;
  wins_by_ko: number;
  wins_by_submission: number;
  wins_by_decision: number;
  title_defenses: number;
}

export interface FootballAthlete extends BaseAthlete {
  sport_id: 1;
  team_id: number;
  jersey_number: number;
  position: string;
  stats: FootballStats;
}

export interface BasketballAthlete extends BaseAthlete {
  sport_id: 2;
  team_id: number;
  jersey_number: number;
  position: string;
  stats: BasketballStats;
}

export interface MmaAthlete extends BaseAthlete {
  sport_id: 3;
  team_id: null;
  nickname: string;
  reach_cm: number;
  weight_class: string;
  stance: string;
  stats: MmaStats;
}

export type Athlete =
  | FootballAthlete
  | BasketballAthlete
  | MmaAthlete;
