import type { MapObjectType, MapObjectStatus } from '../enum-types.js';

export interface MapObject {
  id: string;
  title: string;
  type: MapObjectType;
  status: MapObjectStatus;
  coordinates: [number, number];
  createdAt: string;
  updatedAt: string;
}
