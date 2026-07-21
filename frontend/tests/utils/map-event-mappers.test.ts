import { describe, it, expect } from 'vitest';
import type { MapEventDto } from '@/types/dto/map-event.dto';
import { mapEventDtoToDomain, mapEventDtoToDomainArray } from '@/utils/map-event-mappers';

const sampleDto: MapEventDto = {
  id: 'evt-1',
  objectId: 'obj-1',
  message: 'Something happened',
  severity: 'warning',
  createdAt: '2026-07-17T10:00:00.000Z',
};

describe('event-mappers', () => {
  it('mapEventDtoToDomain maps all fields', () => {
    const domain = mapEventDtoToDomain(sampleDto);
    expect(domain).toEqual({
      id: 'evt-1',
      objectId: 'obj-1',
      message: 'Something happened',
      severity: 'warning',
      createdAt: '2026-07-17T10:00:00.000Z',
    });
  });

  it('mapEventDtoToDomain handles null objectId', () => {
    const domain = mapEventDtoToDomain({ ...sampleDto, objectId: null });
    expect(domain.objectId).toBeNull();
  });

  it('mapEventDtoToDomain does not mutate the source dto', () => {
    const copy = { ...sampleDto };
    mapEventDtoToDomain(sampleDto);
    expect(sampleDto).toEqual(copy);
  });

  it('mapEventDtoToDomainArray maps every element', () => {
    const second: MapEventDto = { ...sampleDto, id: 'evt-2', severity: 'critical', objectId: null };
    const list = [sampleDto, second];
    const result = mapEventDtoToDomainArray(list);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('evt-1');
    expect(result[1].id).toBe('evt-2');
    expect(result[1].severity).toBe('critical');
    expect(result[1].objectId).toBeNull();
  });

  it('mapEventDtoToDomainArray returns empty array for empty input', () => {
    expect(mapEventDtoToDomainArray([])).toEqual([]);
  });
});
