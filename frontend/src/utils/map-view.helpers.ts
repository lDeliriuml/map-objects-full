import type { MapObject } from '@/types/model/map-object.model';
import { getTypeColor } from '@/utils/helpers';

export function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function markerStyle(obj: MapObject, selected: boolean): string {
  const offline = obj.status === 'offline';
  const size = selected ? 20 : 16;
  const color = getTypeColor(obj.type);
  return [
    `width: ${size}px;`,
    `height: ${size}px;`,
    'border-radius: 50%;',
    `background: ${color};`,
    'border: 2px solid white;',
    'cursor: pointer;',
    selected
      ? `box-shadow: 0 0 0 4px ${hexToRgba(color, 0.45)};`
      : 'box-shadow: 0 2px 4px rgba(0,0,0,0.3);',
    offline ? 'filter: grayscale(1); opacity: 0.5;' : '',
  ].join(' ');
}

export function createPopupContent(obj: MapObject): string {
  return `<div style="padding: 4px; min-width: 150px;">
    <strong>${obj.title}</strong><br/>
    Тип: ${obj.type}<br/>
    Статус: ${obj.status}<br/>
    Координаты: ${obj.coordinates[0].toFixed(4)}, ${obj.coordinates[1].toFixed(4)}
  </div>`;
}
