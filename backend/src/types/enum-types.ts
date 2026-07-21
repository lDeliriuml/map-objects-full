export const MAP_OBJECT_TYPES = ['vehicle', 'person', 'sensor'] as const;
export const MAP_OBJECT_STATUSES = ['active', 'warning', 'offline'] as const;
export const EVENT_SEVERITIES = ['info', 'warning', 'critical'] as const;

export type MapObjectType = (typeof MAP_OBJECT_TYPES)[number];
export type MapObjectStatus = (typeof MAP_OBJECT_STATUSES)[number];
export type EventSeverity = (typeof EVENT_SEVERITIES)[number];
