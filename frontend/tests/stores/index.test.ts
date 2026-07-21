import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useObjectsStore, useEventsStore } from '@/stores/index';
import type { MapObject } from '@/types/model/map-object.model';
import type { MapEvent } from '@/types/model/map-event.model';
import { objectService, eventService } from '@/services/services-factory';

vi.mock('@/services/services-factory', () => ({
  objectService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
  eventService: {
    getAll: vi.fn(),
  },
}));

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

const makeEvent = (over: Partial<MapEvent> = {}): MapEvent => ({
  id: 'evt-1',
  objectId: 'obj-1',
  message: 'Alert',
  severity: 'warning',
  createdAt: '2026-07-17T10:00:00.000Z',
  ...over,
});

describe('useObjectsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetchObjects loads objects and clears error', async () => {
    vi.mocked(objectService.getAll).mockResolvedValue([makeObject()]);
    const store = useObjectsStore();
    await store.fetchObjects();
    expect(objectService.getAll).toHaveBeenCalled();
    expect(store.objects).toHaveLength(1);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('fetchObjects sets error message on failure', async () => {
    vi.mocked(objectService.getAll).mockRejectedValue(new Error('boom'));
    const store = useObjectsStore();
    await store.fetchObjects();
    expect(store.objects).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe('boom');
  });

  it('addObject prepends created object', async () => {
    const created = makeObject({ id: 'new' });
    vi.mocked(objectService.create).mockResolvedValue(created);
    const store = useObjectsStore();
    store.objects = [makeObject({ id: 'old' })];
    const result = await store.addObject({
      title: 'New',
      type: 'person',
      status: 'active',
      coordinates: [1, 2],
    });
    expect(objectService.create).toHaveBeenCalled();
    expect(result.id).toBe('new');
    expect(store.objects[0].id).toBe('new');
  });

  it('updateObject replaces object when updated', async () => {
    vi.mocked(objectService.update).mockResolvedValue(makeObject({ id: 'obj-1', status: 'offline' }));
    const store = useObjectsStore();
    store.objects = [makeObject({ id: 'obj-1', status: 'active' })];
    await store.updateObject('obj-1', { status: 'offline' });
    expect(store.objects[0].status).toBe('offline');
  });

  it('updateObject keeps object when update returns null', async () => {
    vi.mocked(objectService.update).mockResolvedValue(null);
    const store = useObjectsStore();
    store.objects = [makeObject({ id: 'obj-1', status: 'active' })];
    await store.updateObject('obj-1', { status: 'offline' });
    expect(store.objects).toHaveLength(1);
    expect(store.objects[0].status).toBe('active');
  });

  it('removeObject removes object and clears selection', async () => {
    vi.mocked(objectService.remove).mockResolvedValue(true);
    const store = useObjectsStore();
    store.objects = [makeObject({ id: 'obj-1' }), makeObject({ id: 'obj-2' })];
    store.selectObject(store.objects[0]);
    await store.removeObject('obj-1');
    expect(objectService.remove).toHaveBeenCalledWith('obj-1');
    expect(store.objects).toHaveLength(1);
    expect(store.selectedObject).toBeNull();
  });

  it('filteredObjects filters by type', () => {
    const store = useObjectsStore();
    store.objects = [
      makeObject({ id: '1', type: 'vehicle' }),
      makeObject({ id: '2', type: 'person' }),
    ];
    store.setFilterType('person');
    expect(store.filteredObjects.map((o) => o.id)).toEqual(['2']);
  });

  it('filteredObjects filters by status', () => {
    const store = useObjectsStore();
    store.objects = [
      makeObject({ id: '1', status: 'active' }),
      makeObject({ id: '2', status: 'offline' }),
    ];
    store.setFilterStatus('offline');
    expect(store.filteredObjects.map((o) => o.id)).toEqual(['2']);
  });

  it('filteredObjects with all filters returns everything', () => {
    const store = useObjectsStore();
    store.objects = [makeObject(), makeObject({ id: '2' })];
    store.setFilterType('all');
    store.setFilterStatus('all');
    expect(store.filteredObjects).toHaveLength(2);
  });

  it('selectObject sets and clears selected object', () => {
    const store = useObjectsStore();
    const obj = makeObject();
    store.selectObject(obj);
    expect(store.selectedObject).toStrictEqual(obj);
    store.selectObject(null);
    expect(store.selectedObject).toBeNull();
  });
});

describe('useEventsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetchEvents loads events', async () => {
    vi.mocked(eventService.getAll).mockResolvedValue([makeEvent()]);
    const store = useEventsStore();
    await store.fetchEvents();
    expect(eventService.getAll).toHaveBeenCalled();
    expect(store.events).toHaveLength(1);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('fetchEvents sets error on failure', async () => {
    vi.mocked(eventService.getAll).mockRejectedValue(new Error('boom'));
    const store = useEventsStore();
    await store.fetchEvents();
    expect(store.events).toEqual([]);
    expect(store.error).toBe('boom');
  });
});
