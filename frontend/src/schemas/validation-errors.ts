import { z } from 'zod';

export class ApiValidationError extends Error {
  public readonly cause: z.ZodError;

  constructor(message: string, cause: z.ZodError) {
    super(message);
    this.name = 'ApiValidationError';
    this.cause = cause;
  }
}
