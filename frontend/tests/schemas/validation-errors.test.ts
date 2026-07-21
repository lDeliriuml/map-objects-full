import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ApiValidationError } from '@/schemas/validation-errors';

describe('ApiValidationError', () => {
  it('has correct name and cause', () => {
    const zodError = new z.ZodError([]);
    const err = new ApiValidationError('test message', zodError);
    expect(err.name).toBe('ApiValidationError');
    expect(err.message).toBe('test message');
    expect(err.cause).toBe(zodError);
  });
});
