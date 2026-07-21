import type { MapObject } from '@/types/model/map-object.model';
import type { CreateObjectInput, UpdateObjectInput } from '@/types/dto/map-object.dto';

export interface MapObjectApiService {
  getAll(): Promise<MapObject[]>;
  create(input: CreateObjectInput): Promise<MapObject>;
  update(id: string, input: UpdateObjectInput): Promise<MapObject | null>;
  remove(id: string): Promise<boolean>;
}
