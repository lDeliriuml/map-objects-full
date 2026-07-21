import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/repository/map-event.repository', () => ({
  mapEventRepository: {
    findAll: vi.fn(),
    create: vi.fn(),
  },
}));

import { mapEventRepository } from '../../src/repository/map-event.repository';
import { MapEventService } from '../../src/services/map-event.service';

describe('MapEventService', () => {
  let service: MapEventService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MapEventService();
  });

  describe('getAll', () => {
    it("should return all events from repository", async () => {
      const mockEvents = [{ id: "e1", objectId: "o1", message: "Event 1", severity: "info" as const, createdAt: "2026-01-01T00:00:00Z" }];
      (mapEventRepository.findAll as any).mockResolvedValue(mockEvents);
      const result = await service.getAll();
      expect(result).toEqual(mockEvents);
      expect(mapEventRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no events exist", async () => {
      (mapEventRepository.findAll as any).mockResolvedValue([]);
      const result = await service.getAll();
      expect(result).toEqual([]);
    });

    it("should return all events from repository (order depends on DB)", async () => {
      const mockEvents = [
        { id: "e1", objectId: null, message: "First", severity: "info" as const, createdAt: "2026-01-01T00:00:00Z" },
        { id: "e2", objectId: "o1", message: "Second", severity: "warning" as const, createdAt: "2026-01-02T00:00:00Z" },
      ];
      (mapEventRepository.findAll as any).mockResolvedValue(mockEvents);
      const result = await service.getAll();
      expect(result).toHaveLength(2);
    });

    it("should call repository findAll exactly once", async () => {
      (mapEventRepository.findAll as any).mockResolvedValue([]);
      await service.getAll();
      expect(mapEventRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("should pass through repository errors", async () => {
      const dbError = new Error("Database connection failed");
      (mapEventRepository.findAll as any).mockRejectedValue(dbError);
      await expect(service.getAll()).rejects.toThrow('Database connection failed');
    });
  });
});