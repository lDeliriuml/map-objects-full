import { z } from 'zod';
import { EVENT_SEVERITIES } from '@/types/enum-types';

const mapEventDtoSchema = z.object({
  id: z.string().min(1),
  objectId: z.string().min(1).or(z.null()),
  message: z.string().min(1),
  severity: z.enum(EVENT_SEVERITIES),
  createdAt: z.string(),
});

export const mapEventDtoArraySchema = z.array(mapEventDtoSchema);
