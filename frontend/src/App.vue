<template>
  <div class="app">
    <header class="header">
      <h1>Карта объектов и событий</h1>
      <button class="btn-add" @click="showAddForm = true">+ Добавить</button>
    </header>

    <div class="main-layout">
      <div class="columns">
        <aside class="sidebar-left">
          <ObjectList @select="handleSelectObject" />
        </aside>

        <main class="map-area">
        <MapView
          :objects="objectsStore.objects"
          :selected-object="objectsStore.selectedObject"
          @select-object="handleSelectObject"
          @map-dbl-click="handleMapClick"
        />
        </main>

        <aside class="sidebar-right">
          <ObjectCard
            v-if="objectsStore.selectedObject"
            :obj="objectsStore.selectedObject"
            @close="objectsStore.selectObject(null)"
            @save="handleSaveObject"
            @delete="handleDeleteObject"
          />
          <EventPanel
            :events="eventsStore.events"
            :loading="eventsStore.loading"
            :error="eventsStore.error"
          />
        </aside>
      </div>
    </div>

    <AddForm
      v-if="showAddForm"
      :show="showAddForm"
      :coords="addCoords"
      @add="handleAddObject"
      @cancel="showAddForm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MapView from '@/components/MapView.vue';
import ObjectList from '@/components/ObjectList.vue';
import ObjectCard from '@/components/ObjectCard.vue';
import EventPanel from '@/components/EventPanel.vue';
import AddForm from '@/components/AddForm.vue';
import { useObjectsStore, useEventsStore } from '@/stores/index.js';
import type { MapObject } from '@/types/model/map-object.model';

const objectsStore = useObjectsStore();
const eventsStore = useEventsStore();
const showAddForm = ref(false);
  const addCoords = ref<[number, number]>([56.3167, 58.0000]);

onMounted(() => {
  objectsStore.fetchObjects();
  eventsStore.fetchEvents();
});

function handleSelectObject(obj: MapObject | null) {
  objectsStore.selectObject(obj);
}

function handleMapClick(coords: [number, number]) {
  addCoords.value = coords;
  showAddForm.value = true;
}

async function handleAddObject(data: { title: string; type: MapObject['type']; status: MapObject['status']; coordinates: [number, number] }) {
  const obj = await objectsStore.addObject(data);
  objectsStore.selectObject(obj);
  showAddForm.value = false;
  eventsStore.fetchEvents();
}

async function handleSaveObject(id: string, data: Partial<MapObject>) {
  await objectsStore.updateObject(id, data);
  eventsStore.fetchEvents();
}

async function handleDeleteObject(id: string) {
  await objectsStore.removeObject(id);
  eventsStore.fetchEvents();
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f3f4f6;
  color: #111827;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.header h1 {
  font-size: 18px;
  font-weight: 600;
}

.btn-add {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-add:hover {
  background: #2563eb;
}

.main-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.columns {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

.sidebar-left {
  width: 300px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow: hidden;
}

.map-area {
  flex: 1;
  position: relative;
  min-width: 0;
}

  .sidebar-right {
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: white;
    border-left: 1px solid #e5e7eb;
    overflow: hidden;
  }

  .sidebar-right > .object-card {
    flex-shrink: 0;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
  }

@media (max-width: 900px) {
  .sidebar-left {
    width: 240px;
  }

  .sidebar-right {
    width: 260px;
  }
}

@media (max-width: 700px) {
  .columns {
    flex-direction: column;
  }

  .sidebar-left {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .sidebar-right {
    width: 100%;
    height: 200px;
    border-left: none;
    border-top: 1px solid #e5e7eb;
  }
}
</style>
