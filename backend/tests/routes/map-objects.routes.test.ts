import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

describe('Objects Route Integration', () => {
  let mockObjectService: any;
  let mockMapper: any;
  let app: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockObjectService = { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() };
    mockMapper = { mapObjectEntityToDto: vi.fn((e: any) => ({ ...e })), mapObjectEntityToDtoArray: vi.fn((arr: any[]) => arr.map((e: any) => ({ ...e }))) };
    vi.doMock('../../src/services/map-object.service', () => ({ MapObjectService: function() { return mockObjectService; } }));
    vi.doMock('../../src/mappers/map-object.mapper', () => mockMapper);
    const routeModule = await import('../../src/routes/map-objects.routes');
    const objectsRouter = routeModule.default;
    app = express();
    app.use(express.json());
    app.use('/', objectsRouter);
  });
  afterEach(() => { vi.resetModules(); });

    it("GET / should return all objects with status 200", async () => {
      const mockObjects = [{ id: "1", title: "A", type: "vehicle" as const, status: "active" as const, coordinates: [1, 2] as [number, number], createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }];
      mockObjectService.getAll.mockResolvedValue(mockObjects);
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("POST / should return created object with status 201", async () => {
      const dto = { title: "New", type: "person" as const, status: "active" as const, coordinates: [10, 20] as [number, number] };
      const created = { ...dto, id: "new-1", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" };
      mockObjectService.create.mockResolvedValue(created);
      mockMapper.mapObjectEntityToDto.mockReturnValue({ ...created });
      const res = await request(app).post("/").send(dto);
      expect(res.status).toBe(201);
    });

    it("PATCH /:id should return updated object with status 200", async () => {
      const updated = { id: "1", title: "Updated", type: "vehicle" as const, status: "active" as const, coordinates: [1, 2] as [number, number], createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-02T00:00:00Z" };
      mockObjectService.update.mockResolvedValue(updated);
      mockMapper.mapObjectEntityToDto.mockReturnValue({ ...updated });
      const res = await request(app).patch("/1").send({ title: "Updated" });
      expect(res.status).toBe(200);
    });

    it("PATCH /:id should return 404 when object not found", async () => {
      mockObjectService.update.mockResolvedValue(null);
      const res = await request(app).patch("/1").send({ title: "Updated" });
      expect(res.status).toBe(404);
    });

    it("DELETE /:id should return 204 on success", async () => {
      mockObjectService.remove.mockResolvedValue(true);
      const res = await request(app).delete("/1");
      expect(res.status).toBe(204);
    });

    it("DELETE /:id should return 404 when not found", async () => {
      mockObjectService.remove.mockResolvedValue(false);
      const res = await request(app).delete("/1");
      expect(res.status).toBe(404);
    });

    it("POST / should return 500 on service error", async () => {
      const err = new Error("Database error");
      // Mock throws generic error;
      mockObjectService.create.mockRejectedValue(err);
      const res = await request(app).post("/").send({ title: "", type: "vehicle" as const, status: "active" as const, coordinates: [1, 2] });
      expect(res.status).toBe(500);
    });
  });