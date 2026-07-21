import type { MapEvent } from '@/types/model/map-event.model';

export interface MapEventApiService {
  getAll(): Promise<MapEvent[]>;
}
