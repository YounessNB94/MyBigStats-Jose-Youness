import { AppError } from "../core/errors/api.errors.js";

export class ComparisonError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "ComparisonError";
  }
}

export class MissingAthleteError extends ComparisonError {
  constructor() {
    super("Sélectionnez deux athlètes.");
    this.name = "MissingAthleteError";
  }
}

export class SameAthleteError extends ComparisonError {
  constructor() {
    super("Sélectionnez deux athlètes différents.");
    this.name = "SameAthleteError";
  }
}

export class DifferentSportsError extends ComparisonError {
  constructor() {
    super("Les athlètes doivent pratiquer le même sport.");
    this.name = "DifferentSportsError";
  }
}
