import { describe, it, expect } from 'vitest';
import { mapEventDtoArraySchema } from '@/schemas/map-event.schema';
import type { MapEventDto } from '@/types/dto/map-event.dto';

describe('mapEventDtoArraySchema', () => {
  const validEvent: MapEventDto = {
    id: 'e1',
    objectId: 'abc',
    message: 'created',
    severity: 'info',
    createdAt: '2026-01-01T00:00:00Z',
  };

  it('accepts valid events', () => {
    const result = mapEventDtoArraySchema.safeParse([validEvent]);
    expect(result.success).toBe(true);
  });

  it('accepts null objectId', () => {
    const event = { ...validEvent, objectId: null };
    const result = mapEventDtoArraySchema.safeParse([event]);
    expect(result.success).toBe(true);
  });

  it('rejects invalid severity', () => {
    const bad = { ...validEvent, severity: 'loud' as never };
    const result = mapEventDtoArraySchema.safeParse([bad]);
    expect(result.success).toBe(false);
  });
});
