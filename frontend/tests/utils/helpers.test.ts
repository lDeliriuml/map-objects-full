import { describe, it, expect } from 'vitest';
import { mapDtoToDomain, mapDtoToDomainArray } from '@/utils/map-object-mappers';
import { mapEventDtoToDomain, mapEventDtoToDomainArray } from '@/utils/map-event-mappers';
import type { MapObjectDto } from '@/types/dto/map-object.dto';
import type { MapEventDto } from '@/types/dto/map-event.dto';

describe('mappers', () => {
  describe('mapDtoToDomain', () => {
    it('translates ApiMapObject to MapObject', () => {
      const dto: MapObjectDto = {
        id: 'abc',
        title: 'Car',
        type: 'vehicle',
        status: 'active',
        coordinates: [37.6, 55.7],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      };
      const result = mapDtoToDomain(dto);
      expect(result.id).toBe('abc');
      expect(result.title).toBe('Car');
      expect(result.type).toBe('vehicle');
      expect(result.status).toBe('active');
      expect(result.coordinates).toEqual([37.6, 55.7]);
    });

    it('preserves all fields', () => {
      const dto: MapObjectDto = {
        id: 'x',
        title: 'T',
        type: 'sensor',
        status: 'offline',
        coordinates: [0, 0],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      };
      const result = mapDtoToDomain(dto);
      expect(result).toEqual(dto);
    });
  });

  describe('mapDtoToDomainArray', () => {
    it('maps array of DTOs to domain models', () => {
      const dtos: MapObjectDto[] = [
        { id: '1', title: 'A', type: 'vehicle', status: 'active', coordinates: [1, 2], createdAt: '', updatedAt: '' },
        { id: '2', title: 'B', type: 'person', status: 'warning', coordinates: [3, 4], createdAt: '', updatedAt: '' },
      ];
      const result = mapDtoToDomainArray(dtos);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });
  });

  describe('mapEventDtoToDomain', () => {
    it('translates snake_case to camelCase', () => {
      const dto: MapEventDto = {
        id: 'e1',
        objectId: 'abc',
        message: 'test',
        severity: 'info',
        createdAt: '2026-01-01T00:00:00Z',
      };
      const result = mapEventDtoToDomain(dto);
      expect(result.objectId).toBe('abc');
      expect(result.createdAt).toBe('2026-01-01T00:00:00Z');
      expect(result.id).toBe('e1');
      expect(result.message).toBe('test');
      expect(result.severity).toBe('info');
    });

    it('converts null object_id', () => {
      const dto: MapEventDto = {
        id: 'e2',
        objectId: null,
        message: 'orphan',
        severity: 'critical',
        createdAt: '2026-01-01T00:00:00Z',
      };
      const result = mapEventDtoToDomain(dto);
      expect(result.objectId).toBeNull();
    });
  });

  describe('mapEventDtoToDomainArray', () => {
    it('maps array of event DTOs', () => {
      const dtos: MapEventDto[] = [
        { id: 'e1', objectId: 'o1', message: 'm1', severity: 'info', createdAt: '' },
      ];
      const result = mapEventDtoToDomainArray(dtos);
      expect(result).toHaveLength(1);
      expect(result[0].objectId).toBe('o1');
    });
  });
});
