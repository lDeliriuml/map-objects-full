import type { MapEventApiService } from '../interfaces/map-event.api.service';
import type { MapEvent } from '@/types/model/map-event.model';
import type { EventSeverity } from '@/types/enum-types';

const delay = (ms = 150): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}`;
}

const now = (): string => new Date().toISOString();

const seededEvents: MapEvent[] = [
  { id: 'evt-1', objectId: 'seed-1', message: 'Объект Vehicle A-123 создан', severity: 'info', createdAt: '2026-07-14T08:00:05Z' },
  { id: 'evt-2', objectId: 'seed-2', message: 'Статус объекта Vehicle B-456 изменен с active на warning', severity: 'warning', createdAt: '2026-07-14T09:30:00Z' },
  { id: 'evt-3', objectId: 'seed-4', message: 'Статус объекта Sensor #2 изменен с active на offline', severity: 'critical', createdAt: '2026-07-14T05:00:00Z' },
  { id: 'evt-4', objectId: 'seed-3', message: 'Объект Sensor #1 создан', severity: 'info', createdAt: '2026-07-14T09:45:00Z' },
];

let events = [...seededEvents];

export class MockMapEventService implements MapEventApiService {
  async getAll(): Promise<MapEvent[]> { await delay(); return events.map((e) => ({ ...e })).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }

  static addEvent(objectId: string, message: string, severity: EventSeverity) {
    events = [{ id: uid(), objectId, message, severity, createdAt: now() }, ...events];
  }
}