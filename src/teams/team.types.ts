export interface FootballTeam {
  id: number;
  sport_id: 1;
  name: string;
  short_name: string;
  country: string;
  confederation: string;
  fifa_ranking: number;
  world_cup_titles: number;
  world_cup_appearances: number;
  coach: string;
  group: string;
}

export interface BasketballTeam {
  id: number;
  sport_id: 2;
  name: string;
  short_name: string;
  city: string;
  conference: string;
  seed: number;
  regular_season_wins: number;
  regular_season_losses: number;
  coach: string;
  championships: number;
  arena: string;
}

export type Team =
  | FootballTeam
  | BasketballTeam;