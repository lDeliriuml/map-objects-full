import { describe, it, expect } from 'vitest';
import { mapObjectEntityToDto, mapObjectEntityToDtoArray } from '../../src/mappers/map-object.mapper';

describe('mapObjectMapper', () => {
  const mockEntity = {
    id: 'test-1',
    title: 'Test Object',
    type: 'vehicle' as const,
    status: 'active' as const,
    coordinates: [37.6173, 55.7558] as [number, number],
    createdAt: '2026-07-14T08:00:00Z',
    updatedAt: '2026-07-14T09:00:00Z',
  };

  describe('mapObjectEntityToDto', () => {
    it('should map entity to dto correctly', () => {
      const result = mapObjectEntityToDto(mockEntity);
      expect(result.id).toBe('test-1');
      expect(result.title).toBe('Test Object');
      expect(result.type).toBe('vehicle');
      expect(result.status).toBe('active');
      expect(result.coordinates).toEqual([37.6173, 55.7558]);
      expect(result.createdAt).toBe('2026-07-14T08:00:00Z');
      expect(result.updatedAt).toBe('2026-07-14T09:00:00Z');
    });

    it('should return a new object (not reference equality)', () => {
      const result = mapObjectEntityToDto(mockEntity);
      expect(result).not.toBe(mockEntity);
    });
  });

  describe('mapObjectEntityToDtoArray', () => {
    it('should map empty array to empty array', () => {
      const result = mapObjectEntityToDtoArray([]);
      expect(result).toEqual([]);
    });

    it('should map single entity to dto array', () => {
      const result = mapObjectEntityToDtoArray([mockEntity]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test-1');
    });

    it('should map multiple entities to dto array', () => {
      const entities = [
        { ...mockEntity, id: '1', title: 'First' },
        { ...mockEntity, id: '2', title: 'Second' },
        { ...mockEntity, id: '3', title: 'Third' },
      ];
      const result = mapObjectEntityToDtoArray(entities);
      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('First');
      expect(result[1].title).toBe('Second');
      expect(result[2].title).toBe('Third');
    });

    it('should map each entity independently', () => {
      const entities = [mockEntity, { ...mockEntity, id: 'other' }];
      const result = mapObjectEntityToDtoArray(entities);
      expect(result[0].id).not.toBe(result[1].id);
    });
  });
});