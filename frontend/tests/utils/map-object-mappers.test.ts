import { describe, it, expect } from 'vitest';
import type { MapObjectDto } from '@/types/dto/map-object.dto';
import { mapDtoToDomain, mapDtoToDomainArray } from '@/utils/map-object-mappers';

const sampleDto: MapObjectDto = {
  id: 'obj-1',
  title: 'Test Object',
  type: 'vehicle',
  status: 'active',
  coordinates: [37.6, 55.7],
  createdAt: '2026-07-17T10:00:00.000Z',
  updatedAt: '2026-07-17T11:00:00.000Z',
};

describe('object-mappers', () => {
  it('mapDtoToDomain maps all fields', () => {
    const domain = mapDtoToDomain(sampleDto);
    expect(domain).toEqual({
      id: 'obj-1',
      title: 'Test Object',
      type: 'vehicle',
      status: 'active',
      coordinates: [37.6, 55.7],
      createdAt: '2026-07-17T10:00:00.000Z',
      updatedAt: '2026-07-17T11:00:00.000Z',
    });
  });

  it('mapDtoToDomain does not mutate the source dto', () => {
    const copy = { ...sampleDto };
    mapDtoToDomain(sampleDto);
    expect(sampleDto).toEqual(copy);
  });

  it('mapDtoToDomainArray maps every element', () => {
    const second: MapObjectDto = { ...sampleDto, id: 'obj-2', type: 'person', status: 'warning' };
    const list = [sampleDto, second];
    const result = mapDtoToDomainArray(list);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('obj-1');
    expect(result[1].id).toBe('obj-2');
    expect(result[1].type).toBe('person');
  });

  it('mapDtoToDomainArray returns empty array for empty input', () => {
    expect(mapDtoToDomainArray([])).toEqual([]);
  });
});
