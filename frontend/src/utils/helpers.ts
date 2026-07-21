import type { MapObjectType, MapObjectStatus, EventSeverity } from '@/types/enum-types';

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const TYPE_LABELS: Record<MapObjectType, string> = {
  vehicle: 'Транспорт',
  person: 'Персона',
  sensor: 'Датчик',
};

export const STATUS_LABELS: Record<MapObjectStatus, string> = {
  active: 'Активный',
  warning: 'Предупреждение',
  offline: 'Недоступен',
};

export const TYPE_COLORS: Record<MapObjectType, string> = {
  vehicle: '#3B82F6',
  person: '#10B981',
  sensor: '#F59E0B',
};

export function getTypeLabel(type: MapObjectType): string {
  return TYPE_LABELS[type];
}

export function getStatusLabel(status: MapObjectStatus): string {
  return STATUS_LABELS[status];
}

export function getTypeColor(type: MapObjectType): string {
  return TYPE_COLORS[type];
}

export const SEVERITY_COLORS: Record<EventSeverity, string> = {
  info: '#22c55e',
  warning: '#f59e0b',
  critical: '#ef4444',
};

export function getSeverityColor(severity: EventSeverity): string {
  return SEVERITY_COLORS[severity];
}
