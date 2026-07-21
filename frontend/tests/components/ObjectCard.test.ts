import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ObjectCard from '@/components/ObjectCard.vue';
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

describe('ObjectCard', () => {
  it('renders the object title in an editable input', () => {
    const wrapper = mount(ObjectCard, { props: { obj: makeObject() } });
    const input = wrapper.find('input.title-input');
    expect(input.exists()).toBe(true);
    expect((input.element as HTMLInputElement).value).toBe('Car');
  });

  it('emits close when close button clicked', async () => {
    const wrapper = mount(ObjectCard, { props: { obj: makeObject() } });
    await wrapper.find('.close-btn').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('emits save with id and edited fields', async () => {
    const wrapper = mount(ObjectCard, { props: { obj: makeObject() } });
    await wrapper.find('input.title-input').setValue('Truck');
    await wrapper.findAll('select')[1].setValue('offline');
    await wrapper.find('button.btn-primary').trigger('click');
    const emitted = wrapper.emitted('save') as [string, Partial<MapObject>][];
    expect(emitted[0][0]).toBe('obj-1');
    expect(emitted[0][1]).toEqual({ title: 'Truck', type: 'vehicle', status: 'offline' });
  });

  it('emits delete with id', async () => {
    const wrapper = mount(ObjectCard, { props: { obj: makeObject() } });
    await wrapper.find('button.btn-danger').trigger('click');
    const emitted = wrapper.emitted('delete') as [string][];
    expect(emitted[0][0]).toBe('obj-1');
  });
});
