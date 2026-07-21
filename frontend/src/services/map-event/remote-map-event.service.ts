import type { MapEventApiService } from '../interfaces/map-event.api.service';
import type { MapEvent } from '@/types/model/map-event.model';
import api from '../client.api';
import { mapEventDtoToDomainArray } from '@/utils/map-event-mappers.js';
import { mapEventDtoArraySchema, ApiValidationError } from '@/schemas/index.js';

export class RemoteMapEventService implements MapEventApiService {
  private readonly path = '/events';

  async getAll(): Promise<MapEvent[]> {
    const { data } = await api.get(this.path);
    const result = mapEventDtoArraySchema.safeParse(data);
    if (!result.success) throw new ApiValidationError('Invalid /events response from server', result.error);
    return mapEventDtoToDomainArray(result.data);
  }
}
