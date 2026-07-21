<template>
  <div class="object-list">
    <div class="filters">
      <select v-model="store.filterType" class="filter-select">
        <option value="all">Все типы</option>
        <option value="vehicle">Транспорт</option>
        <option value="person">Персона</option>
        <option value="sensor">Датчик</option>
      </select>

      <select v-model="store.filterStatus" class="filter-select">
        <option value="all">Все статусы</option>
        <option value="active">Активный</option>
        <option value="warning">Предупреждение</option>
        <option value="offline">Недоступен</option>
      </select>
    </div>

    <div v-if="store.loading" class="state">Загрузка...</div>

    <div v-else-if="store.error" class="state error">{{ store.error }}</div>

    <div v-else-if="store.filteredObjects.length === 0" class="state empty">
      Нет объектов для отображения
    </div>

    <ul v-else class="list">
      <li
        v-for="obj in store.filteredObjects"
        :key="obj.id"
        class="list-item"
        :class="{ selected: isSelected(obj) }"
        @click="emit('select', obj)"
      >
        <div class="item-header">
          <span class="dot" :style="{ background: getTypeColor(obj.type) }"></span>
          <span class="title">{{ obj.title }}</span>
          <span class="status-badge" :class="`status-${obj.status}`">{{ getStatusLabel(obj.status) }}</span>
        </div>
        <div class="item-details">
          <span class="type-label">{{ getTypeLabel(obj.type) }}</span>
          <span class="time">{{ formatDateTime(obj.createdAt) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useObjectsStore } from '@/stores/index';
import type { MapObject } from '@/types/model/map-object.model';
import { getTypeColor, getTypeLabel, getStatusLabel, formatDateTime } from '@/utils/helpers';

const emit = defineEmits<{
  select: [obj: MapObject];
}>();

const store = useObjectsStore();

function isSelected(obj: MapObject): boolean {
  return store.selectedObject?.id === obj.id;
}
</script>

<style scoped>
.object-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.filters {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.filter-select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  background: white;
}

.state {
  padding: 20px;
  text-align: center;
  color: #6b7280;
}

.state.error {
  color: #ef4444;
}

.list {
  list-style: none;
  margin: 0;
  padding: 8px;
  overflow-y: auto;
  flex: 1;
}

.list-item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
  margin-bottom: 4px;
}

.list-item:hover {
  background: #f3f4f6;
}

.list-item.selected {
  background: #e0e7ff;
  border-left: 3px solid #3b82f6;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.title {
  font-weight: 500;
  font-size: 14px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #e5e7eb;
  color: #374151;
  white-space: nowrap;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.status-offline {
  background: #fee2e2;
  color: #991b1b;
}

.item-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}

.type-label {
  text-transform: capitalize;
}
</style>
