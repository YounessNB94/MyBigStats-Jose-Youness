export interface AthleteFilters {
  query: string;
  position: string;
}

export type ActiveAthleteFilters = Partial<AthleteFilters>;
