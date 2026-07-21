import { describe, it, expect } from 'vitest';
import { mapObjectDtoArraySchema } from '@/schemas/map-object.schema';
import type { MapObjectDto } from '@/types/dto/map-object.dto';

describe('mapObjectDtoArraySchema', () => {
  const validObject: MapObjectDto = {
    id: 'abc',
    title: 'Car',
    type: 'vehicle',
    status: 'active',
    coordinates: [37.6, 55.7],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  it('accepts valid objects', () => {
    const result = mapObjectDtoArraySchema.safeParse([validObject]);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data[0].id).toBe('abc');
  });

  it('rejects invalid enum type', () => {
    const bad = { ...validObject, type: 'spaceship' as never };
    const result = mapObjectDtoArraySchema.safeParse([bad]);
    expect(result.success).toBe(false);
  });

  it('rejects non-array input', () => {
    const result = mapObjectDtoArraySchema.safeParse({ foo: 'bar' });
    expect(result.success).toBe(false);
  });
});
