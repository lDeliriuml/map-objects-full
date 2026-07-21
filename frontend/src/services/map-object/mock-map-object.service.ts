import type { MapObjectApiService } from '../interfaces/map-object.api.service';
import type { MapObject } from '@/types/model/map-object.model';
import type { CreateObjectInput, UpdateObjectInput } from '@/types/dto/map-object.dto';
import { MockMapEventService } from '@/services/map-event/mock-map-event.service.js';

const delay = (ms = 150): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}`;
}

const now = (): string => new Date().toISOString();

const seededObjects: MapObject[] = [
  { id: 'seed-1', title: 'Vehicle A-123', type: 'vehicle', status: 'active', coordinates: [56.3167, 58.0000], createdAt: '2026-07-14T08:00:00Z', updatedAt: '2026-07-14T09:30:00Z' },
  { id: 'seed-2', title: 'Vehicle B-456', type: 'vehicle', status: 'warning', coordinates: [56.32, 58.005], createdAt: '2026-07-14T08:00:00Z', updatedAt: '2026-07-14T09:30:00Z' },
  { id: 'seed-3', title: 'Sensor #1', type: 'sensor', status: 'active', coordinates: [56.31, 57.995], createdAt: '2026-07-14T08:00:00Z', updatedAt: '2026-07-14T09:30:00Z' },
  { id: 'seed-4', title: 'Sensor #2', type: 'sensor', status: 'offline', coordinates: [56.33, 58.008], createdAt: '2026-07-14T08:00:00Z', updatedAt: '2026-07-14T09:30:00Z' },
  { id: 'seed-5', title: 'Operator Ivanov', type: 'person', status: 'active', coordinates: [56.325, 57.998], createdAt: '2026-07-14T08:00:00Z', updatedAt: '2026-07-14T09:30:00Z' },
  { id: 'seed-6', title: 'Operator Petrov', type: 'person', status: 'active', coordinates: [56.315, 58.01], createdAt: '2026-07-14T08:00:00Z', updatedAt: '2026-07-14T09:30:00Z' },
];

let objects = seededObjects.map((o) => ({ ...o }));

export class MockMapObjectService implements MapObjectApiService {
  async getAll(): Promise<MapObject[]> { await delay(); return objects.map((o) => ({ ...o })); }
  async create(input: CreateObjectInput): Promise<MapObject> {
    await delay();
    const obj = { ...input, id: uid(), createdAt: now(), updatedAt: now() };
    objects = [obj, ...objects];
    MockMapEventService.addEvent(obj.id, `Объект "${input.title}" создан`, 'info');
    return { ...obj };
  }
  async update(id: string, input: UpdateObjectInput): Promise<MapObject | null> {
    await delay();
    const index = objects.findIndex((o) => o.id === id);
    if (index === -1) return null;
    const existing = objects[index];
    const updated = { ...existing, ...input, updatedAt: now() };
    objects = objects.map((o, i) => (i === index ? updated : o));
    if (input.status && input.status !== existing.status) {
      MockMapEventService.addEvent(id, `Статус объекта "${existing.title}" изменен с "${existing.status}" на "${input.status}"`, 'warning');
    }
    return { ...updated };
  }
  async remove(id: string): Promise<boolean> {
    await delay();
    const obj = objects.find((o) => o.id === id);
    const before = objects.length;
    objects = objects.filter((o) => o.id !== id);
    if (objects.length < before && obj) {
      MockMapEventService.addEvent(id, `Объект "${obj.title}" удален`, 'critical');
    }
    return objects.length < before;
  }
}