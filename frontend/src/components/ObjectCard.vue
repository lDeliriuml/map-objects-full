<template>
  <div v-if="obj" class="object-card">
    <div class="card-head">
      <input
        v-model="editTitle"
        class="title-input"
        type="text"
        placeholder="Название"
      />
      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>

    <div class="card-fields">
      <label class="field-inline">
        <span>Тип</span>
        <select v-model="editType">
          <option value="vehicle">Транспорт</option>
          <option value="person">Персона</option>
          <option value="sensor">Датчик</option>
        </select>
      </label>

      <label class="field-inline">
        <span>Статус</span>
        <select v-model="editStatus">
          <option value="active">Активный</option>
          <option value="warning">Предупреждение</option>
          <option value="offline">Недоступен</option>
        </select>
      </label>

      <div class="field-inline">
        <span>Коорд.</span>
        <span class="mono">{{ obj.coordinates[0].toFixed(4) }}, {{ obj.coordinates[1].toFixed(4) }}</span>
      </div>

      <div class="field-inline">
        <span>Создан</span>
        <span class="mono">{{ formatDate(obj.createdAt) }}</span>
      </div>

      <div class="field-inline">
        <span>Обновлён</span>
        <span class="mono">{{ formatDate(obj.updatedAt) }}</span>
      </div>
    </div>

    <div class="card-actions">
      <button class="btn btn-primary" @click="handleSave">Сохранить</button>
      <button class="btn btn-danger" @click="handleDelete">Удалить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { MapObject } from '@/types/model/map-object.model';
import type { MapObjectType, MapObjectStatus } from '@/types/enum-types';
import { formatDateTime } from '@/utils/helpers';

const props = defineProps<{
  obj: MapObject;
}>();

const emit = defineEmits<{
  close: [];
  save: [id: string, data: Partial<MapObject>];
  delete: [id: string];
}>();

const editTitle = ref<string>(props.obj.title);
const editType = ref<MapObjectType>(props.obj.type);
const editStatus = ref<MapObjectStatus>(props.obj.status);

watch(() => props.obj.title, (val) => { if (val) editTitle.value = val; });
watch(() => props.obj.type, (val) => { if (val) editType.value = val; });
watch(() => props.obj.status, (val) => { if (val) editStatus.value = val; });

function handleSave() {
  emit('save', props.obj.id, {
    title: editTitle.value.trim(),
    type: editType.value,
    status: editStatus.value,
  });
}

function handleDelete() {
  emit('delete', props.obj.id);
}

function formatDate(dateStr: string): string {
  return formatDateTime(dateStr);
}
</script>

<style scoped>
.object-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-input {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
  padding: 2px 6px;
}

.close-btn:hover {
  color: #111827;
}

.card-fields {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.field-inline {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
  color: #6b7280;
}

.field-inline select {
  padding: 5px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  background: white;
}

.mono {
  font-size: 13px;
  color: #374151;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}
</style>
