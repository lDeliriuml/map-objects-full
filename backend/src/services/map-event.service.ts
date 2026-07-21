import type { MapEventEntity } from '../types/entity/map-event.entity';
import { mapEventRepository } from '../repository/map-event.repository';

export class MapEventService {
  async getAll(): Promise<MapEventEntity[]> {
    return mapEventRepository.findAll();
  }
}
