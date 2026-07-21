import type { EventSeverity } from '../enum-types';

export interface MapEventDto{
  id: string;
  objectId: string | null;
  message: string;
  severity: EventSeverity;
  createdAt: string;
}
