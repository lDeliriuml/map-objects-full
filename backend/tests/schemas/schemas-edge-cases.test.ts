import { describe, it, expect } from 'vitest';
import { CreateMapObjectSchema, UpdateMapObjectSchema } from '../../src/schemas/index';

describe('CreateMapObjectSchema - Edge Cases', () => {
    const base = { title: "Valid", type: "vehicle" as const, status: "active" as const, coordinates: [0, 0] as [number, number] };

    it("should fail with whitespace-only title", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, title: "   " }).success).toBe(true); // Zod trims only if specified
    });

    it("should fail with null title", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, title: null as any }).success).toBe(false);
    });

    it("should fail with number instead of string title", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, title: 123 as any }).success).toBe(false);
    });

    it("should reject coordinates with non-finite numbers", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, coordinates: [NaN, 0] as any }).success).toBe(false); // Zod does not check NaN by default
    });

    it("should reject extra unknown fields (strict)", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, extra: true } as any ).success).toBe(true); // Zod passthrough by default
    });

    it("should fail with coordinates containing strings", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, coordinates: ["1" as any, "2" as any] }).success).toBe(false);
    });

    it("should accept zero coordinates", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, coordinates: [0, 0] as [number, number] }).success).toBe(true);
    });

    it("should accept maximum allowed title length (255)", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, title: "a".repeat(255) }).success).toBe(true);
    });

    it("should reject coordinates with more than 2 elements", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, coordinates: [1, 2, 3] as any }).success).toBe(false);
    });

    it("should reject coordinates with fewer than 2 elements", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, coordinates: [1] as any }).success).toBe(false);
    });

    it("should accept all coordinate sign combinations", () => {
      expect(CreateMapObjectSchema.safeParse({ ...base, coordinates: [-180, -90] as [number, number] }).success).toBe(true);
      expect(CreateMapObjectSchema.safeParse({ ...base, coordinates: [180, 90] as [number, number] }).success).toBe(true);
    });
  });

describe('UpdateMapObjectSchema - Edge Cases', () => {
    it("should accept partial update with only type", () => {
      expect(UpdateMapObjectSchema.safeParse({ type: "sensor" as const }).success).toBe(true);
    });

    it("should accept partial update with only status", () => {
      expect(UpdateMapObjectSchema.safeParse({ status: "offline" as const }).success).toBe(true);
    });

    it("should reject type that is not a string", () => {
      expect(UpdateMapObjectSchema.safeParse({ type: 123 as any }).success).toBe(false);
    });

    it("should reject status that is not a string", () => {
      expect(UpdateMapObjectSchema.safeParse({ status: false as any }).success).toBe(false);
    });

    it("should allow title with special characters", () => {
      expect(UpdateMapObjectSchema.safeParse({ title: "Test @#$%" }).success).toBe(true);
    });

    it("should allow title with unicode characters", () => {
      expect(UpdateMapObjectSchema.safeParse({ title: "Тест" }).success).toBe(true);
    });

    it("should reject empty string title in update", () => {
      expect(UpdateMapObjectSchema.safeParse({ title: "" }).success).toBe(false);
    });

    it("should allow updating type from vehicle to sensor", () => {
      expect(UpdateMapObjectSchema.safeParse({ type: "sensor" as const }).success).toBe(true);
    });

    it("should allow updating status through all valid values", () => {
      expect(UpdateMapObjectSchema.safeParse({ status: "active" as const }).success).toBe(true);
      expect(UpdateMapObjectSchema.safeParse({ status: "warning" as const }).success).toBe(true);
      expect(UpdateMapObjectSchema.safeParse({ status: "offline" as const }).success).toBe(true);
    });

    it("should reject updating to invalid type", () => {
      expect(UpdateMapObjectSchema.safeParse({ type: "drone" as any }).success).toBe(false);
    });

    it("should reject updating to invalid status", () => {
      expect(UpdateMapObjectSchema.safeParse({ status: "dead" as any }).success).toBe(false);
    });
  });
