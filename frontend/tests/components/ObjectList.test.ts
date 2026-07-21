import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ObjectList from '@/components/ObjectList.vue';
import { useObjectsStore } from '@/stores/index';
import type { MapObject } from '@/types/model/map-object.model';

vi.mock('@/services/services-factory', () => ({
  objectService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
  eventService: { getAll: vi.fn() },
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

describe('ObjectList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows loading state', async () => {
    const store = useObjectsStore();
    store.loading = true;
    const wrapper = mount(ObjectList);
    await flushPromises();
    expect(wrapper.text()).toContain('Загрузка');
  });

  it('shows error state', async () => {
    const store = useObjectsStore();
    store.error = 'Boom';
    const wrapper = mount(ObjectList);
    await flushPromises();
    expect(wrapper.text()).toContain('Boom');
  });

  it('shows empty state when no objects', async () => {
    const store = useObjectsStore();
    store.objects = [];
    const wrapper = mount(ObjectList);
    await flushPromises();
    expect(wrapper.text()).toContain('Нет объектов');
  });

  it('renders filtered objects and emits select', async () => {
    const store = useObjectsStore();
    store.objects = [
      makeObject({ id: 'a', title: 'Alpha' }),
      makeObject({ id: 'b', title: 'Beta' }),
    ];
    const wrapper = mount(ObjectList);
    await flushPromises();
    const items = wrapper.findAll('.list-item');
    expect(items).toHaveLength(2);
    expect(wrapper.text()).toContain('Alpha');

    await items[1].trigger('click');
    const emitted = wrapper.emitted('select') as [MapObject][];
    expect(emitted[0][0].id).toBe('b');
  });

  it('marks selected object', async () => {
    const store = useObjectsStore();
    const obj = makeObject({ id: 'a' });
    store.objects = [obj];
    store.selectedObject = obj;
    const wrapper = mount(ObjectList);
    await flushPromises();
    expect(wrapper.find('.list-item').classes()).toContain('selected');
  });
});
