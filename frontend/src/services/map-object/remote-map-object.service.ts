import type { MapObjectApiService } from '../interfaces/map-object.api.service';
import type { MapObject } from '@/types/model/map-object.model.js';
import type { CreateObjectInput, UpdateObjectInput } from '@/types/dto/map-object.dto.js';
import api from '../client.api.js';
import { mapDtoToDomainArray } from '@/utils/map-object-mappers.js';
import { mapObjectDtoSchema, mapObjectDtoArraySchema, ApiValidationError } from '@/schemas/index.js';

export class RemoteMapObjectService implements MapObjectApiService {
  private readonly path = '/objects';

  async getAll(): Promise<MapObject[]> {
    const { data } = await api.get(this.path);
    const result = mapObjectDtoArraySchema.safeParse(data);
    if (!result.success) throw new ApiValidationError('Invalid /objects response from server', result.error);
    return mapDtoToDomainArray(result.data);
  }

  async create(input: CreateObjectInput): Promise<MapObject> {
    const { data } = await api.post(this.path, input);
    const result = mapObjectDtoSchema.safeParse(data);
    if (!result.success) throw new ApiValidationError('Invalid /objects response from server', result.error);
    return mapDtoToDomainArray([result.data])[0];
  }

  async update(id: string, input: UpdateObjectInput): Promise<MapObject | null> {
    const response = await api.patch(`${this.path}/${id}`, input);
    if (response.status === 404) return null;
    const result = mapObjectDtoSchema.safeParse(response.data);
    if (!result.success) throw new ApiValidationError('Invalid /objects response from server', result.error);
    return mapDtoToDomainArray([result.data])[0];
  }

  async remove(id: string): Promise<boolean> {
    await api.delete(`${this.path}/${id}`);
    return true;
  }
}