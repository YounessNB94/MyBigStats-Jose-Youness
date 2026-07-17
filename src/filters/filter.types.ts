export interface AthleteFilters {
  query: string;
  sportId: number;
  position: string;
}

export type ActiveAthleteFilters = Partial<AthleteFilters>;
