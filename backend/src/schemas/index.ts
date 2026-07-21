import { z } from 'zod';
import { MAP_OBJECT_TYPES, MAP_OBJECT_STATUSES} from '../types/enum-types';

export const CreateMapObjectSchema = z.object({
  title: z.string().min(1).max(255),
  type: z.enum(MAP_OBJECT_TYPES),
  status: z.enum(MAP_OBJECT_STATUSES),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const UpdateMapObjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  type: z.enum(MAP_OBJECT_TYPES).optional(),
  status: z.enum(MAP_OBJECT_STATUSES).optional(),
});