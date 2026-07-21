import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EventPanel from '@/components/EventPanel.vue';
import type { MapEvent } from '@/types/model/map-event.model';

const makeEvent = (over: Partial<MapEvent> = {}): MapEvent => ({
  id: 'evt-1',
  objectId: 'obj-1',
  message: 'Alert',
  severity: 'warning',
  createdAt: '2026-07-17T10:00:00.000Z',
  ...over,
});

describe('EventPanel', () => {
  it('shows loading state', () => {
    const wrapper = mount(EventPanel, {
      props: { events: [], loading: true, error: null },
    });
    expect(wrapper.text()).toContain('Загрузка');
  });

  it('shows error state', () => {
    const wrapper = mount(EventPanel, {
      props: { events: [], loading: false, error: 'Failed' },
    });
    expect(wrapper.text()).toContain('Failed');
  });

  it('shows empty state', () => {
    const wrapper = mount(EventPanel, {
      props: { events: [], loading: false, error: null },
    });
    expect(wrapper.text()).toContain('Нет событий');
  });

  it('renders a list of events with severity color', () => {
    const events = [
      makeEvent({ id: 'e1', severity: 'critical', message: 'Fire' }),
      makeEvent({ id: 'e2', severity: 'info', message: 'Ok' }),
    ];
    const wrapper = mount(EventPanel, {
      props: { events, loading: false, error: null },
    });
    const items = wrapper.findAll('.event-item');
    expect(items).toHaveLength(2);
    expect(items[0].classes()).toContain('severity-critical');
    expect(items[1].classes()).toContain('severity-info');
    const dot = items[0].find('.severity-dot');
    expect(dot.attributes('style')).toContain('background: rgb(239, 68, 68)');
    expect(wrapper.text()).toContain('Fire');
  });
});
