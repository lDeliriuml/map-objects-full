import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AddForm from '@/components/AddForm.vue';
import type { CreateObjectInput } from '@/types/dto/map-object.dto';

describe('AddForm', () => {
  it('emits nothing when title is empty', async () => {
    const wrapper = mount(AddForm, { props: { show: true } });
    await wrapper.find('button.btn-primary').trigger('click');
    expect(wrapper.emitted('add')).toBeUndefined();
  });

  it('emits add with trimmed title and default fields', async () => {
    const wrapper = mount(AddForm, { props: { show: true } });
    await wrapper.find('input[type="text"]').setValue('  My Object  ');
    await wrapper.find('button.btn-primary').trigger('click');
    const emitted = wrapper.emitted('add') as [CreateObjectInput][];
    expect(emitted).toHaveLength(1);
    const payload = emitted[0][0];
    expect(payload.title).toBe('My Object');
    expect(payload.type).toBe('vehicle');
    expect(payload.status).toBe('active');
    expect(payload.coordinates).toEqual([56.3167, 58.0]);
  });

  it('emits cancel', async () => {
    const wrapper = mount(AddForm, { props: { show: true } });
    await wrapper.find('button.btn-secondary').trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('uses provided coords and rounds them', async () => {
    const wrapper = mount(AddForm, {
      props: { show: true, coords: [37.123456, 55.987654] },
    });
    await wrapper.find('input[type="text"]').setValue('Point');
    await wrapper.find('button.btn-primary').trigger('click');
    const emitted = wrapper.emitted('add') as [CreateObjectInput][];
    expect(emitted[0][0].coordinates).toEqual([37.1235, 55.9877]);
  });

  it('does not render when show is false', () => {
    const wrapper = mount(AddForm, { props: { show: false } });
    expect(wrapper.find('.add-form').exists()).toBe(false);
  });
});
