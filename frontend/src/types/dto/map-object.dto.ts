import type { MapObjectType, MapObjectStatus } from '../enum-types';

export interface MapObjectDto{
  id: string;
  title: string;
  type: MapObjectType;
  status: MapObjectStatus;
  coordinates: [number, number];
  createdAt: string;
  updatedAt: string;
}

export type CreateObjectInput = Omit<MapObjectDto, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateObjectInput = Partial<Pick<MapObjectDto, 'title' | 'type' | 'status'>>;
