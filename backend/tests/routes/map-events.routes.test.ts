import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

describe('Events Route Integration', () => {
  let mockEventService: any;
  let mockMapper: any;
  let app: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockEventService = { getAll: vi.fn() };
    mockMapper = { mapEventEntityToDtoArray: vi.fn((arr: any[]) => arr.map((e: any) => ({ ...e }))) };
    vi.doMock('../../src/services/map-event.service', () => ({ MapEventService: function() { return mockEventService; } }));
    vi.doMock('../../src/mappers/map-event.mapper', () => mockMapper);
    const routeModule = await import('../../src/routes/map-events.routes');
    const eventsRouter = routeModule.default;
    app = express();
    app.use(express.json());
    app.use('/', eventsRouter);
  });
  afterEach(() => { vi.resetModules(); });

    it("GET / should return all events with status 200", async () => {
      const mockEvents = [{ id: "e1", objectId: "o1", message: "Test", severity: "info" as const, createdAt: "2026-01-01T00:00:00Z" }];
      mockEventService.getAll.mockResolvedValue(mockEvents);
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("GET / should return empty array when no events", async () => {
      mockEventService.getAll.mockResolvedValue([]);
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });