import { describe, it, expect } from 'vitest';
import { mapEventEntityToDto, mapEventEntityToDtoArray } from '../../src/mappers/map-event.mapper';

describe('mapEventMapper', () => {
  const mockEntity = {
    id: 'evt-1',
    objectId: 'obj-1',
    message: 'Test event message',
    severity: 'warning' as const,
    createdAt: '2026-07-14T09:30:00Z',
  };

  describe('mapEventEntityToDto', () => {
    it('should map entity to dto correctly', () => {
      const result = mapEventEntityToDto(mockEntity);
      expect(result.id).toBe('evt-1');
      expect(result.objectId).toBe('obj-1');
      expect(result.message).toBe('Test event message');
      expect(result.severity).toBe('warning');
      expect(result.createdAt).toBe('2026-07-14T09:30:00Z');
    });

    it('should handle null objectId', () => {
      const entity = { ...mockEntity, objectId: null };
      const result = mapEventEntityToDto(entity);
      expect(result.objectId).toBeNull();
    });

    it('should return a new object (not reference equality)', () => {
      const result = mapEventEntityToDto(mockEntity);
      expect(result).not.toBe(mockEntity);
    });
  });

  describe('mapEventEntityToDtoArray', () => {
    it('should map empty array to empty array', () => {
      const result = mapEventEntityToDtoArray([]);
      expect(result).toEqual([]);
    });

    it('should map single event to dto array', () => {
      const result = mapEventEntityToDtoArray([mockEntity]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('evt-1');
    });

    it('should map multiple events correctly', () => {
      const entities = [
        { ...mockEntity, id: 'e1', severity: 'info' as const },
        { ...mockEntity, id: 'e2', severity: 'critical' as const },
      ];
      const result = mapEventEntityToDtoArray(entities);
      expect(result).toHaveLength(2);
      expect(result[0].severity).toBe('info');
      expect(result[1].severity).toBe('critical');
    });
  });
});