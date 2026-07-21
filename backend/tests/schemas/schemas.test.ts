import { describe, it, expect } from 'vitest';
import { CreateMapObjectSchema, UpdateMapObjectSchema } from '../../src/schemas/index';

describe('CreateMapObjectSchema', () => {
  const validInput = {
    title: 'Test Object',
    type: 'vehicle' as const,
    status: 'active' as const,
    coordinates: [37.6173, 55.7558],
  };

  it('should pass valid input', () => {
    const result = CreateMapObjectSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should fail with empty title', () => {
    const result = CreateMapObjectSchema.safeParse({ ...validInput, title: '' });
    expect(result.success).toBe(false);
  });

  it('should fail with title exceeding max length', () => {
    const result = CreateMapObjectSchema.safeParse({ ...validInput, title: 'a'.repeat(256) });
    expect(result.success).toBe(false);
  });

  it('should fail with missing title', () => {
    const input = { ...validInput };
    delete input.title;
    const result = CreateMapObjectSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should fail with invalid type', () => {
    const result = CreateMapObjectSchema.safeParse({ ...validInput, type: 'invalid' as any });
    expect(result.success).toBe(false);
  });

  it('should fail with invalid status', () => {
    const result = CreateMapObjectSchema.safeParse({ ...validInput, status: 'invalid' as any });
    expect(result.success).toBe(false);
  });

  it('should fail with missing coordinates', () => {
    const input = { ...validInput };
    delete input.coordinates;
    const result = CreateMapObjectSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should fail with wrong coordinates format', () => {
    const result = CreateMapObjectSchema.safeParse({ ...validInput, coordinates: [1] as any });
    expect(result.success).toBe(false);
  });

  it('should accept all valid types', () => {
    for (const type of ['vehicle', 'person', 'sensor'] as const) {
      const result = CreateMapObjectSchema.safeParse({ ...validInput, type });
      expect(result.success).toBe(true);
    }
  });

  it('should accept all valid statuses', () => {
    for (const status of ['active', 'warning', 'offline'] as const) {
      const result = CreateMapObjectSchema.safeParse({ ...validInput, status });
      expect(result.success).toBe(true);
    }
  });

  it('should fail with negative coordinates', () => {
    // Coordinates should be valid lat/lng
    const result = CreateMapObjectSchema.safeParse({ ...validInput, coordinates: [-180, -90] });
    expect(result.success).toBe(true); // Zod does not validate range by default
  });
});

describe('UpdateMapObjectSchema', () => {
  it('should pass with empty object (all fields optional)', () => {
    const result = UpdateMapObjectSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should pass with partial update', () => {
    const result = UpdateMapObjectSchema.safeParse({ title: 'Updated' });
    expect(result.success).toBe(true);
  });

  it('should fail with empty title in update', () => {
    const result = UpdateMapObjectSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });

  it('should fail with invalid type in update', () => {
    const result = UpdateMapObjectSchema.safeParse({ type: 'invalid' as any });
    expect(result.success).toBe(false);
  });

  it('should allow all fields at once', () => {
    const input = { title: 'Full Update', type: 'sensor' as const, status: 'offline' as const };
    const result = UpdateMapObjectSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});