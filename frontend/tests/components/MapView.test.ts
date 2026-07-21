import { describe, it, expect } from 'vitest';
import { hexToRgba, markerStyle, createPopupContent } from '@/utils/map-view.helpers';
import type { MapObject } from '@/types/model/map-object.model';

const makeObject = (over: Partial<MapObject> = {}): MapObject => ({
  id: 'obj-1',
  title: 'Car',
  type: 'vehicle',
  status: 'active',
  coordinates: [37.6, 55.7],
  createdAt: '2026-07-17T10:00:00.000Z',
  updatedAt: '2026-07-17T11:00:00.000Z',
  ...over,
});

describe('map-view helpers', () => {
  it('hexToRgba converts hex with alpha', () => {
    expect(hexToRgba('#3B82F6', 0.45)).toBe('rgba(59, 130, 246, 0.45)');
    expect(hexToRgba('#FFFFFF', 1)).toBe('rgba(255, 255, 255, 1)');
  });

  it('markerStyle grows size when selected', () => {
    const base = markerStyle(makeObject(), false);
    const selected = markerStyle(makeObject(), true);
    expect(base).toContain('width: 16px;');
    expect(selected).toContain('width: 20px;');
    expect(selected).toContain('box-shadow: 0 0 0 4px');
    expect(base).toContain('box-shadow: 0 2px 4px rgba(0,0,0,0.3)');
  });

  it('markerStyle greys out offline objects', () => {
    const offline = markerStyle(makeObject({ status: 'offline' }), false);
    expect(offline).toContain('filter: grayscale(1); opacity: 0.5;');
  });

  it('createPopupContent includes title, type and status', () => {
    const html = createPopupContent(makeObject({ title: 'Truck' }));
    expect(html).toContain('<strong>Truck</strong>');
    expect(html).toContain('Тип: vehicle');
    expect(html).toContain('Статус: active');
    expect(html).toContain('37.6000, 55.7000');
  });
});
