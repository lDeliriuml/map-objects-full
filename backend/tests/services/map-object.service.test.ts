import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/repository/map-object.repository', () => ({
  mapObjectRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../src/repository/map-event.repository', () => ({
  mapEventRepository: {
    findAll: vi.fn(),
    create: vi.fn(),
  },
}));

import { mapObjectRepository } from '../../src/repository/map-object.repository';
import { mapEventRepository } from '../../src/repository/map-event.repository';
import { MapObjectService } from '../../src/services/map-object.service';

const mockEntity = (overrides: Partial<MapObjectEntity> = {}): MapObjectEntity => ({
  id: '1', title: 'Test', type: 'vehicle' as const, status: 'active' as const,
  coordinates: [1, 2] as [number, number],
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('MapObjectService', () => {
  let service: MapObjectService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MapObjectService();
  });

  describe('getAll', () => {
    it('should return all objects from repository', async () => {
      const mockObjects = [mockEntity({ id: '1' }), mockEntity({ id: '2' })];
      (mapObjectRepository.findAll as any).mockResolvedValue(mockObjects);
      const result = await service.getAll();
      expect(result).toEqual(mockObjects);
      expect(mapObjectRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no objects exist', async () => {
      (mapObjectRepository.findAll as any).mockResolvedValue([]);
      const result = await service.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it("should create object and log info event on success", async () => {
      const dto = { title: "New Object", type: "person" as const, status: "active" as const, coordinates: [10, 20] as [number, number] };
      const createdObj = mockEntity({ ...dto, id: "new-id" });
      (mapObjectRepository.create as any).mockResolvedValue(createdObj);
      const result = await service.create(dto);
      expect(result).toEqual(createdObj);
      expect(mapObjectRepository.create).toHaveBeenCalledWith(dto);
      expect(mapEventRepository.create).toHaveBeenCalledTimes(1);
    });

    it("should throw ValidationError on empty title", async () => {
      const dto = { title: "", type: "vehicle" as const, status: "active" as const, coordinates: [1, 2] as [number, number] };
      await expect(service.create(dto as any)).rejects.toThrow('Validation error');
      expect(mapObjectRepository.create).not.toHaveBeenCalled();
    });

    it("should throw ValidationError on invalid type", async () => {
      const dto = { title: "Valid", type: "invalid" as any, status: "active" as const, coordinates: [1, 2] as [number, number] };
      await expect(service.create(dto)).rejects.toThrow('Validation error');
    });

    it("should throw ValidationError on invalid status", async () => {
      const dto = { title: "Valid", type: "vehicle" as const, status: "invalid" as any, coordinates: [1, 2] as [number, number] };
      await expect(service.create(dto)).rejects.toThrow('Validation error');
    });
  });

  describe('update', () => {
    it("should update object and return updated entity", async () => {
      const existing = mockEntity({ id: "1", title: "Old" });
      const updated = mockEntity({ ...existing, title: "New", updatedAt: "2026-01-02T00:00:00Z" });
      (mapObjectRepository.findById as any).mockResolvedValueOnce(existing);
      (mapObjectRepository.update as any).mockResolvedValue(updated);
      const result = await service.update('1', { title: 'New' });
      expect(result).toEqual(updated);
    });

    it("should return null when object not found", async () => {
      (mapObjectRepository.findById as any).mockResolvedValue(null);
      const result = await service.update('nonexistent', { title: 'New' });
      expect(result).toBeNull();
    });

    it("should create warning event when status changes", async () => {
      const existing = mockEntity({ id: "1", title: "Obj", status: "active" });
      const updated = mockEntity({ ...existing, status: "offline", updatedAt: "2026-01-02T00:00:00Z" });
      (mapObjectRepository.findById as any).mockResolvedValueOnce(existing);
      (mapObjectRepository.update as any).mockResolvedValue(updated);
      await service.update('1', { status: 'offline' });
      expect(mapEventRepository.create).toHaveBeenCalledTimes(1);
    });

    it("should NOT create event when only title changes", async () => {
      const existing = mockEntity({ id: "1", title: "Obj" });
      const updated = mockEntity({ ...existing, title: "New Title", updatedAt: "2026-01-02T00:00:00Z" });
      (mapObjectRepository.findById as any).mockResolvedValueOnce(existing);
      (mapObjectRepository.update as any).mockResolvedValue(updated);
      await service.update('1', { title: 'New Title' });
      expect(mapEventRepository.create).not.toHaveBeenCalled();
    });

    it("should throw ValidationError on invalid update data", async () => {
      (mapObjectRepository.findById as any).mockResolvedValue(mockEntity({ id: '1' }));
      await expect(service.update('1', { title: '' })).rejects.toThrow('Validation error');
    });

    it("should return null when update returns null", async () => {
      (mapObjectRepository.findById as any).mockResolvedValue(mockEntity({ id: '1' }));
      (mapObjectRepository.update as any).mockResolvedValue(null);
      const result = await service.update('1', { title: 'New' });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it("should delete object and log critical event on success", async () => {
      const existing = mockEntity({ id: "1", title: "ToDelete" });
      (mapObjectRepository.findById as any).mockResolvedValueOnce(existing);
      (mapObjectRepository.delete as any).mockResolvedValue(true);
      const result = await service.remove('1');
      expect(result).toBe(true);
      expect(mapEventRepository.create).toHaveBeenCalledTimes(1);
      expect(mapObjectRepository.delete).toHaveBeenCalledWith('1');
    });

    it("should return false when object not found", async () => {
      (mapObjectRepository.findById as any).mockResolvedValue(null);
      const result = await service.remove('nonexistent');
      expect(result).toBe(false);
      expect(mapObjectRepository.delete).not.toHaveBeenCalled();
    });

    it("should create critical event before deletion", async () => {
      const existing = mockEntity({ id: "1", title: "ToDelete" });
      (mapObjectRepository.findById as any).mockResolvedValueOnce(existing);
      (mapObjectRepository.delete as any).mockResolvedValue(true);
      await service.remove('1');
      // Event should be created with the deleted object's id
      const callArgs = (mapEventRepository.create as any).mock.calls[0];
      expect(callArgs[0]).toBe('1');
      expect(callArgs[2]).toBe('critical');
    });
  });
});