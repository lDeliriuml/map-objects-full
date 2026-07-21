import { describe, it, expect } from 'vitest';
import { AppError, ValidationError } from './src/errors.js';

describe('AppError', () => {
  it('should create error with status code and message', () => {
    const error = new AppError(500, 'Internal server error');
    expect(error.name).toBe('AppError');
    expect(error.message).toBe('Internal server error');
    expect(error.statusCode).toBe(500);
    expect(error.details).toBeUndefined();
  });

  it('should accept details parameter', () => {
    const details = [{ field: 'email', message: 'Invalid email' }];
    const error = new AppError(400, 'Bad request', details);
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual(details);
  });

  it('should extend Error', () => {
    const error = new AppError(500, 'error');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('ValidationError', () => {
  it('should create validation error with issues', () => {
    const issues = [
      { field: 'title', message: 'Title is required' },
      { field: 'type', message: 'Invalid type' },
    ];
    const error = new ValidationError(issues);
    expect(error.name).toBe('ValidationError');
    expect(error.message).toBe('Validation error');
    expect(error.statusCode).toBe(400);
    expect(error.issues).toEqual(issues);
  });

  it('should accept custom message', () => {
    const issues = [{ field: 'email', message: 'Invalid' }];
    const error = new ValidationError(issues, 'Input validation failed');
    expect(error.message).toBe('Input validation failed');
  });

  it('should extend AppError', () => {
    const error = new ValidationError([]);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it('should have empty issues array by default', () => {
    const error = new ValidationError([]);
    expect(error.issues).toHaveLength(0);
  });
});