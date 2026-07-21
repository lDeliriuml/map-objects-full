import { describe, it, expect } from 'vitest';
import { mapObjectEntityToDto, mapObjectEntityToDtoArray } from '../../src/mappers/map-object.mapper';
import { mapEventEntityToDto, mapEventEntityToDtoArray } from '../../src/mappers/map-event.mapper';

describe('Mapper Mutability Tests', () => {
    const objectEntity = { id: "1", title: "Test", type: "vehicle" as const, status: "active" as const, coordinates: [10, 20] as [number, number], createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" };
    const eventEntity = { id: "e1", objectId: "o1", message: "Msg", severity: "info" as const, createdAt: "2026-01-01T00:00:00Z" };

    it("object mapper should return a completely new object (no reference equality)", () => {
      const dto = mapObjectEntityToDto(objectEntity);
      expect(dto).not.toBe(objectEntity);
    });

    it("modifying mapped DTO should not affect original entity", () => {
      const dto = mapObjectEntityToDto(objectEntity);
      (dto as any).title = 'Hacked';
      expect(objectEntity.title).toBe('Test');
    });

    it("event mapper should return a completely new object", () => {
      const dto = mapEventEntityToDto(eventEntity);
      expect(dto).not.toBe(eventEntity);
    });

    it("modifying event DTO should not affect original entity", () => {
      const dto = mapEventEntityToDto(eventEntity);
      (dto as any).message = 'Hacked';
      expect(eventEntity.message).toBe('Msg');
    });

    it("mapObjectEntityToDtoArray should return new array with new objects", () => {
      const arr = [objectEntity, { ...objectEntity, id: '2' }];
      const result = mapObjectEntityToDtoArray(arr);
      expect(result).not.toBe(arr);
      expect(result[0]).not.toBe(arr[0]);
      expect(result[1]).not.toBe(arr[1]);
    });

    it("modifying mapped array elements should not affect original entities", () => {
      const arr = [objectEntity];
      const result = mapObjectEntityToDtoArray(arr);
      (result[0] as any).title = 'Hacked';
      expect(arr[0].title).toBe('Test');
    });

    it("mapEventEntityToDtoArray should return new array with new objects", () => {
      const arr = [eventEntity];
      const result = mapEventEntityToDtoArray(arr);
      expect(result).not.toBe(arr);
      expect(result[0]).not.toBe(arr[0]);
    });

    it("should handle entities with null objectId in event mapper", () => {
      const entity = { ...eventEntity, objectId: null };
      const dto = mapEventEntityToDto(entity);
      expect(dto.objectId).toBeNull();
    });

    it("should preserve all coordinates precision", () => {
      const entity = { ...objectEntity, coordinates: [37.61729999, 55.75580001] as [number, number] };
      const dto = mapObjectEntityToDto(entity);
      expect(dto.coordinates[0]).toBe(37.61729999);
      expect(dto.coordinates[1]).toBe(55.75580001);
    });

    it("should handle empty string title", () => {
      const entity = { ...objectEntity, title: "" };
      const dto = mapObjectEntityToDto(entity);
      expect(dto.title).toBe('');
    });

    it("should handle very long title", () => {
      const longTitle = "a".repeat(255);
      const entity = { ...objectEntity, title: longTitle };
      const dto = mapObjectEntityToDto(entity);
      expect(dto.title).toBe(longTitle);
    });

    it("mappers should be pure functions (same input -> same output)", () => {
      const result1 = mapObjectEntityToDto(objectEntity);
      const result2 = mapObjectEntityToDto(objectEntity);
      expect(result1).toEqual(result2);
    });
  });
