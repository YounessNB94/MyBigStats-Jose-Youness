export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

export class ApiError extends AppError {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class SportNotFoundError extends AppError {
  constructor(sport: string) {
    super(`Le sport "${sport}" n'existe pas.`);
    this.name = "SportNotFoundError";
  }
}