import type { EventSeverity } from '../enum-types.js';

export interface MapEvent {
  id: string;
  objectId: string | null;
  message: string;
  severity: EventSeverity;
  createdAt: string;
}
