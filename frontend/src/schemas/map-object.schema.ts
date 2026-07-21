import { z } from 'zod';
import { MAP_OBJECT_TYPES, MAP_OBJECT_STATUSES } from '@/types/enum-types';

const coordinateSchema = z.tuple([z.number(), z.number()]);

export const mapObjectDtoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(MAP_OBJECT_TYPES),
  status: z.enum(MAP_OBJECT_STATUSES),
  coordinates: coordinateSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const mapObjectDtoArraySchema = z.array(mapObjectDtoSchema);
