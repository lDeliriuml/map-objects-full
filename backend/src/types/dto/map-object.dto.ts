import type { MapObjectType, MapObjectStatus } from '../enum-types.js';

export interface MapObjectDto {
  id: string;
  title: string;
  type: MapObjectType;
  status: MapObjectStatus;
  coordinates: [number, number];
  createdAt: string;
  updatedAt: string;
}

export type CreateMapObjectDto = Omit<MapObjectDto, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMapObjectDto = Partial<Omit<MapObjectDto, 'id' | 'createdAt' | 'updatedAt'>>;

