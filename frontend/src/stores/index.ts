import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { objectService, eventService } from '@/services/services-factory';
import type { MapObject } from '@/types/model/map-object.model';
import type { MapEvent } from '@/types/model/map-event.model';
import type { MapObjectType, MapObjectStatus } from '@/types/enum-types';

export const useObjectsStore = defineStore('objects', () => {
  const objects = ref<MapObject[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedObject = ref<MapObject | null>(null);
  const filterType = ref<MapObjectType | 'all'>('all');
  const filterStatus = ref<MapObjectStatus | 'all'>('all');

  const filteredObjects = computed(() => {
    let result = objects.value;
    if (filterType.value !== 'all') {
      result = result.filter((o) => o.type === filterType.value);
    }
    if (filterStatus.value !== 'all') {
      result = result.filter((o) => o.status === filterStatus.value);
    }
    return result;
  });

  async function fetchObjects() {
    loading.value = true;
    error.value = null;
    try {
      objects.value = await objectService.getAll();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch objects';
    } finally {
      loading.value = false;
    }
  }

  async function addObject(input: Parameters<typeof objectService.create>[0]) {
    const obj = await objectService.create(input);
    objects.value = [obj, ...objects.value];
    return obj;
  }

  async function updateObject(id: string, input: Parameters<typeof objectService.update>[1]) {
    const updated = await objectService.update(id, input);
    if (updated) {
      objects.value = objects.value.map((o) => (o.id === id ? updated : o));
    }
  }

  async function removeObject(id: string) {
    await objectService.remove(id);
    objects.value = objects.value.filter(o => o.id !== id);
    if (selectedObject.value?.id === id) {
      selectedObject.value = null;
    }
  }

  function selectObject(obj: MapObject | null) {
    selectedObject.value = obj;
  }

  function setFilterType(type: MapObjectType | 'all') {
    filterType.value = type;
  }

  function setFilterStatus(status: MapObjectStatus | 'all') {
    filterStatus.value = status;
  }

  return {
    objects,
    filteredObjects,
    loading,
    error,
    selectedObject,
    filterType,
    filterStatus,
    fetchObjects,
    addObject,
    updateObject,
    removeObject,
    selectObject,
    setFilterType,
    setFilterStatus,
  };
});

export const useEventsStore = defineStore('events', () => {
  const events = ref<MapEvent[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchEvents() {
    loading.value = true;
    error.value = null;
    try {
      events.value = await eventService.getAll();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch events';
    } finally {
      loading.value = false;
    }
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
  };
});

