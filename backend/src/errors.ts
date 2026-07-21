export interface ErrorDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  public readonly issues: ErrorDetail[];

  constructor(issues: ErrorDetail[], message = 'Validation error') {
    super(400, message, issues);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}
